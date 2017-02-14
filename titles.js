function ToVTTFormat()
{
	var track_file = new String();
	track_file += "WEBVTT\n\n"
	
	for(var i=0;i<titles_array.length;i++)
	{
		track_file+=SecondsToVTTFormat(titles_array[i].start_time) + " --> " + SecondsToVTTFormat(titles_array[i].end_time) + "\n";
		track_file+=titles_array[i].data +"\n\n";
	}
	track_file += "\n";
	return track_file;
}

function ToSRTFormat()
{
	var track_file = new String();
	
	for(var i=0;i<titles_array.length;i++)
	{
		track_file +=(i+1) +"\n";
		track_file+=SecondsToSRTFormat(titles_array[i].start_time) + " --> " + SecondsToSRTFormat(titles_array[i].end_time) + "\n";
		track_file+=titles_array[i].data +"\n\n";
	}
	track_file += "\n";
	return track_file;
}

function LoadTracks()
{
	tracks.src = 'data:text/vtt;charset=utf-8,' + encodeURIComponent(ToVTTFormat());
	tracks.addEventListener("load", function() 
	{ 
		this.mode = "showing"; 
		video.textTracks[0].mode = "showing";
	});
}

function CreateAddTitleDiv(start_time, end_time)
{
	var container = document.createElement("div");
	var stime = document.createElement("input");
	stime.setAttribute("id","stime");
	stime.setAttribute("type","text");
	stime.value = SecondsIntoReadableTime(start_time);
	var stime_insert_curr_time = document.createElement("button");
	stime_insert_curr_time.setAttribute("class","getcurrtime");
	var etime = document.createElement("input");
	etime.setAttribute("id","etime");
	etime.setAttribute("type","text");
	etime.value = SecondsIntoReadableTime(end_time);
	var etime_insert_curr_time = document.createElement("button");
	etime_insert_curr_time.setAttribute("class","getcurrtime");
	var t = document.createTextNode("-->");
	var times_div = document.createElement("div");
	times_div.setAttribute("class","times_div");
	times_div.appendChild(stime);
	times_div.appendChild(stime_insert_curr_time);
	times_div.appendChild(t);
	times_div.appendChild(etime);
	times_div.appendChild(etime_insert_curr_time);
	var text = document.createElement("textarea");
	text.setAttribute("rows",3);
	text.setAttribute("cols",30);
	var save_button = document.createElement("button");
	save_button.setAttribute("id","save_button");
	save_button.innerHTML="Save";
	var discard_button = document.createElement("button");
	discard_button.setAttribute("class","discard_button");
	discard_button.innerHTML= "Delete";
	container.appendChild(times_div);
	container.appendChild(text);
	container.appendChild(save_button);
	container.appendChild(discard_button);
	new_item_div.appendChild(container);
	save_button.addEventListener("click",function()
	{
		if(text.value != "")
		{
			var start = ReadableTimeToSeconds(stime.value);
			var end = ReadableTimeToSeconds(etime.value);
			if(start<end && start>=0 && end<=video.duration)
			{
				var title = {"start_time":start, "end_time":end, "data":text.value};
				var index = InsertIndex(title,titles_array,0,titles_array.length-1);
				if(!OverlapCheck(titles_array,index,start,end))
				{
					titles_array.splice(index,0,title);
					titles_ol.insertBefore(CreateListRow(index,start,end,text.value),titles_ol.childNodes[index]);
					UpdateIndexes(titles_ol,index);
					LoadTracks();
					add_title_button.setAttribute("class","button");
					container.remove();
				}
			}
		}
		else
		{
			discard_button.click();
		}
	});
	
	discard_button.addEventListener("click",function()
	{
		myDropdown.classList.remove("show");
		import_export.setAttribute("class","button");
		add_annotation_button.setAttribute("class","button");
		add_title_button.setAttribute("class","button");
		LoadTracks();
		container.remove();
	});
	
	stime_insert_curr_time.addEventListener("click",function()
	{
		stime.value=SecondsIntoReadableTime(video.currentTime);
		etime.value=SecondsIntoReadableTime(video.currentTime+1.0);
	});
	
	etime_insert_curr_time.addEventListener("click",function()
	{
		etime.value=SecondsIntoReadableTime(video.currentTime);
	});
}

function CreateListRow(index,start_time,end_time,text)
{
	var container = document.createElement("li");
	container.setAttribute("class","list_row");
	container.classList.add("fixed_height");
	var d = document.createElement("div");
	var index_container = document.createElement("span");
	index_container.setAttribute("class","index_container");
	index_container.innerHTML = index + 1;
	
	var times_container = document.createElement("span");
	times_container.setAttribute("class","times_container");
	times_container.innerHTML="["+ SecondsIntoReadableTime(start_time) + " - " + SecondsIntoReadableTime(end_time) + "]";
	
	var tools = document.createElement("div");
	var delete_button = document.createElement("button");
	delete_button.setAttribute("class","delete_button");
	delete_button.innerHTML="Delete";
	var edit_button = document.createElement("button");
	edit_button.innerHTML="Edit";
	edit_button.setAttribute("class","edit");
	tools.appendChild(edit_button);
	tools.appendChild(delete_button);


	var text_area = document.createElement("textarea");
	text_area.setAttribute("rows",3);
	text_area.setAttribute("cols",20);
	text_area.setAttribute("class", "textarea_prev");
	text_area.value = text;
	text_area.readOnly= true;
	
	var substr = text.substring(0,20);
	if(text.length > 20)
	{
		substr += "...";
	}
	var text_div = document.createElement("div");
	text_div.setAttribute("class","text_prev");
	text_div.innerHTML = substr;
	
	d.appendChild(index_container);
	d.appendChild(times_container);
	container.appendChild(d);
	container.appendChild(text_div);
	
	var show = false;
	container.addEventListener("click", function(e)
	{
		if(show == false)
		{
			text_div.remove();
			container.appendChild(text_area);
			container.appendChild(tools);
			container.classList.remove("fixed_height");
			show = true;
		}
		else if(show == true && e.target != text_area)
		{
			text_area.remove();
			tools.remove();
			container.appendChild(text_div);
			container.classList.add("fixed_height");
			show = false;
		}
	});
		
	delete_button.addEventListener("click",function()
	{
		titles_array.splice(container.getElementsByClassName("index_container")[0].innerHTML-1,1);
		container.remove();
		UpdateIndexes(titles_ol,0);
		LoadTracks();
	});
	
	edit_button.addEventListener("click",function()
	{
		if(new_item_div.innerHTML=="")
		{
			CreateAddTitleDiv(start_time,end_time);
			new_item_div.getElementsByTagName("textarea")[0].value = text;
			titles_array.splice(container.getElementsByClassName("index_container")[0].innerHTML-1,1);
			container.remove();
			UpdateIndexes(titles_ol,0);
		}
		else
		{
			new_item_div.classList.add("highlighted");
			setTimeout(function() { new_item_div.classList.remove("highlighted"); }, 400);
		}
	});
	
	return container;
}

function TitlesArrayToString()
{
	var result = new String();
	for(var i=0;i<titles_array.length;i++)
	{
		result += titles_array[i].start_time + "," + titles_array[i].end_time + "," + encodeURIComponent(titles_array[i].data) + "\n";
	}
	return result;
}

function StringToTitlesArray(str)
{
	var lines = str.split("\n");
	var result = new Array();
	for(var i=0;i<lines.length;i++)
	{
		var item = lines[i].split(",");
		if(item.length == 3)
		{
			result.push({"start_time" : parseFloat(item[0],10), "end_time": parseFloat(item[1],10), "data":decodeURIComponent(item[2])});
		}
	}
	return result;
}

function LoadSubtitlesFromString(str)
{
	titles_array = StringToTitlesArray(str);
	titles_ol.innerHTML ="";
	for(var i=0;i<titles_array.length;i++)
	{
		titles_ol.appendChild(CreateListRow(i,titles_array[i].start_time,titles_array[i].end_time,titles_array[i].data));
	}
	LoadTracks();
}

function LoadSubtitlesFromVTTFile(str)
{
	var srt_rx = /^(\d\d:\d\d:\d\d.\d\d\d)\s*-->\s*(\d\d:\d\d:\d\d.\d\d\d)$[\r\n]*([\S\s]*?)(?=\s*[\r\n]\s*[\r\n])|(\d\d:\d\d.\d\d\d)\s*-->\s*(\d\d:\d\d.\d\d\d)$[\s\S]^([\S\s]*?)(?=\s*[\r\n]\s*[\r\n])/gm;
	var match = srt_rx.exec(str);
	if(match!= null)
	{
		titles_array = [];
		while (match != null) 
		{
			if(typeof match[1] !== 'undefined')
			{
				titles_array.push({"start_time": ReadableTimeToSeconds(match[1]) ,"end_time" : ReadableTimeToSeconds(match[2]),"data": match[3]});
			}
			else if(typeof match[4] !== 'undefined')
			{
				titles_array.push({"start_time": ReadableTimeToSeconds(match[4]) ,"end_time" : ReadableTimeToSeconds(match[5]),"data": match[6]});
			}
			match = srt_rx.exec(str);
			
		}
		titles_ol.innerHTML ="";
		for(var i=0;i<titles_array.length;i++)
		{
			titles_ol.appendChild(CreateListRow(i,titles_array[i].start_time,titles_array[i].end_time,titles_array[i].data));
		}
		LoadTracks();
	}
}

function LoadSubtitlesFromSRTFile(str)
{
	var srt_rx = /^(\d\d:\d\d:\d\d,\d\d\d)\s*-->\s*(\d\d:\d\d:\d\d,\d\d\d)$[\r\n]*([\S\s]*?)(?=\s*[\r\n]\s*[\r\n])/gm;
	var match = srt_rx.exec(str);
	if(match!= null)
	{
		titles_array = [];
		while (match != null) 
		{
			titles_array.push({"start_time": SRTTimeToSeconds(match[1]) ,"end_time" : SRTTimeToSeconds(match[2]),"data": match[3]});
			match = srt_rx.exec(str);
			
		}
		titles_ol.innerHTML ="";
		for(var i=0;i<titles_array.length;i++)
		{
			titles_ol.appendChild(CreateListRow(i,titles_array[i].start_time,titles_array[i].end_time,titles_array[i].data));
		}
		LoadTracks();
	}
}