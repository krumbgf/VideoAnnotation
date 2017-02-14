var seekbarclicked = false;
var prevstate = false; // false = paused
function Play()
{
	if (video.paused == true) 
	{
		video.play();
		playButton.style.backgroundImage = "url('./img/pause.png')";
		document.getElementById("video_len").value = "/ " + SecondsIntoReadableTime(video.duration); // IE
	} 
}

function Pause()
{
	if (video.paused == false) 
	{
		video.pause();
		playButton.style.backgroundImage = "url('./img/play.png')";
	} 
}

function AddPlayerControlsEventHandlers()
{
	playButton.addEventListener("click", function() 
	{
		if (video.paused == true) 
		{
			Play();
		} 
		else 
		{
			Pause();
		}
	});

	muteButton.addEventListener("click", function() 
	{
		if (video.muted == false) 
		{
			video.muted = true;
			muteButton.style.backgroundImage = "url('./img/mute.png')";
		} 
		else 
		{
			video.muted = false;
			if(volumeBar.value > 0.5)
			{
				muteButton.style.backgroundImage = "url('./img/on.png')";
			}
			else
			{
				muteButton.style.backgroundImage = "url('./img/off.png')";
			}
		}
	});

	fullScreenButton.addEventListener("click", function() 
	{
		if(video.videoWidth > VIDEO_WIDTH)
		{
			var paused = false;
			if (video.paused == true)
			{
				paused = true;
			}
			if(scale_factor == 1)
			{
				scale_factor = window.innerWidth/video.width;
				video.width = window.innerWidth;
				video.height = video.videoHeight*window.innerWidth/video.videoWidth;
				document.getElementById("create_item_menu").classList.add("hide");
				document.getElementById("right_side").classList.add("hide");
				document.getElementById("main_content").classList.add("center");
				document.getElementById("left_side").classList.add("center");
				document.getElementById("control_buttons").style.paddingLeft = (window.innerWidth/2 - 320) +"px";

			}
			else
			{
				video.width = VIDEO_WIDTH;
				video.height = VIDEO_HEIGHT;
				scale_factor = 1;
				document.getElementById("create_item_menu").classList.remove("hide");
				document.getElementById("right_side").classList.remove("hide");
				document.getElementById("main_content").classList.remove("center");
				document.getElementById("left_side").classList.remove("center");
				document.getElementById("control_buttons").style.paddingLeft = "0px";
			}
			if(paused == false)
			{
				Play();
			}
			ReDraw();
		}		
	});

	seekBar.addEventListener("change", function()
	{
		video.currentTime = video.duration * (seekBar.value / 100);
		current_time_input.value = SecondsIntoReadableTime(video.currentTime);
	});
	
	seekBar.addEventListener("mousedown", function()
	{
		if(video.paused == false)
		{
			Pause();
			prevstate = true;
		}
		else
		{
			prevstate = false;
		}
		seekbarclicked = true;
	});
	
	seekBar.addEventListener("mouseup", function()
	{
		if(prevstate == true)
		{
			Play();
		}
		seekbarclicked = false;
	});
	
	seekBar.addEventListener("mousemove", function(e)
	{
		var currX = e.clientX - seekBar.offsetLeft + window.pageXOffset;
		if(seekbarclicked)
		{
			video.currentTime = video.duration * (currX / seekBar.clientWidth);
			current_time_input.value = SecondsIntoReadableTime(video.currentTime);
		}

	});
		
	volumeBar.addEventListener("change", function() 
	{
		video.volume = volumeBar.value;
		if(volumeBar.value > 0.5)
		{
			muteButton.style.backgroundImage = "url('./img/on.png')";
		}
		else
		{
			muteButton.style.backgroundImage = "url('./img/off.png')";
		}
	});
	
	current_time_input.addEventListener("click",function()
	{
		if(current_time_input.readOnly==true)
		{
			video.pause();
			current_time_input.readOnly = false;		
		}
	});
	
	current_time_input.addEventListener("change",function()
	{
		if(current_time_input.readOnly == false)
		{
			video.currentTime = ReadableTimeToSeconds(current_time_input.value);
			current_time_input.readOnly = true;
		}
	});
	
	document.getElementById("replay").addEventListener("click",function()
	{
		Pause();
		video.currentTime = 0;
	});
	
	document.getElementById("fb").addEventListener("click",function()
	{
		Pause();
		if(video.currentTime - 0.02 >= 0)
		{
			video.currentTime -= 0.02;
		}
	});
	
	document.getElementById("ff").addEventListener("click",function()
	{
		Pause();
		if(video.currentTime + 0.02 <= video.duration)
		{
			video.currentTime += 0.02;
		}
	});
}

function CurrTimeSeekBarRefresh()
{
	seekBar.value = (100 / video.duration) * video.currentTime;
	current_time_input.value = SecondsIntoReadableTime(video.currentTime);
}