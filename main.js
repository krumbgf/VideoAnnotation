var video = document.getElementById("video");
var tracks = document.getElementById("tracks");
var playButton = document.getElementById("play-pause");
var muteButton = document.getElementById("mute");
var fullScreenButton = document.getElementById("fullscreen");
var seekBar = document.getElementById("seek_bar");
var volumeBar = document.getElementById("volume_bar");
var current_time_input = document.getElementById("current_time");

var add_title_button = document.getElementById("add_title_button");
var add_annotation_button = document.getElementById("add_annotation_button");
var import_export = document.getElementById("import_export");

var myDropdown = document.getElementById("myDropdown");
var new_note_button = document.getElementById("new_note_button");
var new_label_button = document.getElementById("new_label_button");
var new_title_button = document.getElementById("new_title_button");
var new_polygon_button = document.getElementById("new_polygon_button");						
var new_img_button = document.getElementById("new_img_button");

var new_item_div = document.getElementById("new_item");
var titles_ol = document.getElementById("titles_ol");
var annot_ol = document.getElementById("annot_ol");

var titles_array = new Array();
var canvas_array = new Array(); 

var scale_factor = 1;
var VIDEO_WIDTH = 640;
var VIDEO_HEIGHT = 360;
var canvas_note = new Object();
var canvas_title = new Object();
var canvas_polygon = new Object();
var canvas_img = new Object();

var paint;
var title_paint;
var polygon_paint;
var font = "Arial";
window.onload = function() 
{	
	video.width = VIDEO_WIDTH;
	video.height = VIDEO_HEIGHT;
	paint = 
	{ 
		RECTANGLE_LINE_COLOR : "rgba(255,255,255,1.0)",
		RECTANGLE_LINE_WIDTH : 1,
		RECTANGLE_BACKGROUND_COLOR : "rgba(210,254,230,0.2)",
		FONT : font,
		FONT_SIZE : 15,
		FONT_COLOR : "rgba(255,255,255,1.0)"
	};
	
	title_paint = 
	{ 
		FONT : font,
		FONT_SIZE : 35,
		FONT_COLOR : "rgba(255,255,255,1.0)"
	};
	polygon_paint = "rgba(175,203,247,0.5)";

	current_time_input.value = SecondsIntoReadableTime(0);
	current_time_input.readOnly = true;
	volumeBar.value = 0.2;
	video.volume = 0.2;
	AddPlayerControlsEventHandlers();
	
	video.addEventListener("timeupdate", function() 
	{
		PlayCanvas();
		CurrTimeSeekBarRefresh();
	});
	
	document.getElementById("media_player").addEventListener("mousemove",function(e)
	{
		var currX = e.clientX - video.offsetLeft + window.pageXOffset;
		var currY = e.clientY - video.offsetTop + window.pageYOffset;
		MouseOverLabel({"x":currX,"y":currY});
	});

	
	NewItemMenuButtonEventHandlers();
	NewAnnotationTypeButtonHandlers();
	
	window.onclick = function(event) 
	{
		if(new_item_div.innerHTML!="")
		{
			document.body.style.overflow = "visible";
		}
		if (event.target !=document.getElementById("myDropdown") && event.target!=add_annotation_button) 
		{
			document.getElementById("myDropdown").classList.remove("show");
		}
	};
	
	if(annot_str.length > 0)
	{
		LoadAnnotationsFromString(annot_str);
	}
	if(subt_str.length > 0)
	{
		LoadSubtitlesFromString(subt_str);
	}
	document.getElementById("video_len").value = "/ "  + SecondsIntoReadableTime(video.duration);
	
}


function NewAnnotationTypeButtonHandlers()
{
	new_note_button.addEventListener("click",function()
	{
		Pause();
		myDropdown.classList.remove("show");
		if(new_item_div.innerHTML=="")
		{
			var start = video.currentTime;
			var end = start+2 > video.duration ? video.duration : start+2;	
			CreateNoteOrLabelDiv(start,end,"note",false);
			add_title_button.setAttribute("class","button");
			add_annotation_button.setAttribute("class","pressed_button");
			import_export.setAttribute("class","button");
		}
		else
		{
			document.getElementById("save_button").click();
			if(new_item_div.innerHTML=="")
			{
				var start = video.currentTime;
				var end = start+2 > video.duration ? video.duration : start+2;	
				CreateNoteOrLabelDiv(start,end,"note",false);	
				add_title_button.setAttribute("class","button");
				add_annotation_button.setAttribute("class","pressed_button");
				import_export.setAttribute("class","button");
			}
		}
	});
	
	new_label_button.addEventListener("click",function()
	{
		Pause();
		myDropdown.classList.remove("show");
		if(new_item_div.innerHTML=="")
		{
			var start = video.currentTime;
			var end = start+2 > video.duration ? video.duration : start+2;	
			CreateNoteOrLabelDiv(start,end,"label",false);	
			add_title_button.setAttribute("class","button");
			add_annotation_button.setAttribute("class","pressed_button");
			import_export.setAttribute("class","button");
		}
		else
		{
			document.getElementById("save_button").click();
			if(new_item_div.innerHTML=="")
			{
				var start = video.currentTime;
				var end = start+2 > video.duration ? video.duration : start+2;	
				CreateNoteOrLabelDiv(start,end,"label",false);	
				add_title_button.setAttribute("class","button");
				add_annotation_button.setAttribute("class","pressed_button");
				import_export.setAttribute("class","button");
			}
		}
	});
	
	new_title_button.addEventListener("click",function()
	{
		Pause();
		myDropdown.classList.remove("show");
		if(new_item_div.innerHTML=="")
		{
			var start = video.currentTime;
			var end = start+2 > video.duration ? video.duration : start+2;	
			CreateTitleDiv(start,end,false);	
			add_title_button.setAttribute("class","button");
			add_annotation_button.setAttribute("class","pressed_button");
			import_export.setAttribute("class","button");
		}
		else
		{
			document.getElementById("save_button").click();
			if(new_item_div.innerHTML=="")
			{
				var start = video.currentTime;
				var end = start+2 > video.duration ? video.duration : start+2;	
				CreateTitleDiv(start,end,false);	
				add_title_button.setAttribute("class","button");
				add_annotation_button.setAttribute("class","pressed_button");
				import_export.setAttribute("class","button");
			}
		}
	});
	
	new_polygon_button.addEventListener("click",function()
	{
		Pause();
		myDropdown.classList.remove("show");
		if(new_item_div.innerHTML=="")
		{
			var start = video.currentTime;
			var end = start+2 > video.duration ? video.duration : start+2;	
			CreatePolygonDiv(start,end,false);	
			add_title_button.setAttribute("class","button");
			add_annotation_button.setAttribute("class","pressed_button");
			import_export.setAttribute("class","button");
		}
		else
		{
			document.getElementById("save_button").click();
			if(new_item_div.innerHTML=="")
			{
				var start = video.currentTime;
				var end = start+2 > video.duration ? video.duration : start+2;	
				CreatePolygonDiv(start,end,false);	
				add_title_button.setAttribute("class","button");
				add_annotation_button.setAttribute("class","pressed_button");
				import_export.setAttribute("class","button");
			}
		}
	});
	
	new_img_button.addEventListener("click",function()
	{
		Pause();
		myDropdown.classList.remove("show");
		if(new_item_div.innerHTML=="")
		{
			var start = video.currentTime;
			var end = start+2 > video.duration ? video.duration : start+2;	
			CreateImgDiv(start,end,false);	
			add_title_button.setAttribute("class","button");
			add_annotation_button.setAttribute("class","pressed_button");
			import_export.setAttribute("class","button");
		}
		else
		{
			document.getElementById("save_button").click();
			if(new_item_div.innerHTML=="")
			{
				var start = video.currentTime;
				var end = start+2 > video.duration ? video.duration : start+2;	
				CreateImgDiv(start,end,false);	
				add_title_button.setAttribute("class","button");
				add_annotation_button.setAttribute("class","pressed_button");
				import_export.setAttribute("class","button");
			}
		}
	});
}

function NewItemMenuButtonEventHandlers()
{
	add_title_button.addEventListener("click",function()
	{
		myDropdown.classList.remove("show");
		var start = video.currentTime;
		var end = start+2 > video.duration ? video.duration : start+2;	
		var title = {"start_time":start, "end_time":end, "data":""};
		var index = InsertIndex(title,titles_array,0,titles_array.length-1);
		if(new_item_div.innerHTML=="" && !OverlapCheck(titles_array,index,start,end))
		{
			Pause();	
			CreateAddTitleDiv(start,end);
			add_title_button.setAttribute("class","pressed_button");
			add_annotation_button.setAttribute("class","button");
			import_export.setAttribute("class","button");
		}
		else if(new_item_div.innerHTML!="")
		{
			document.getElementById("save_button").click();
			if(new_item_div.innerHTML=="")
			{
				start = 0;
				if(titles_array.length==0)
				{
					start = 0;
				}
				else
				{
					start = titles_array[titles_array.length - 1].end_time + 0.2;
				}
				if(start < video.duration)
				{
					Pause();
					var end = start+2 > video.duration ? video.duration : start+2;
					CreateAddTitleDiv(start,end);
					add_title_button.setAttribute("class","pressed_button");
					add_annotation_button.setAttribute("class","button");
					import_export.setAttribute("class","button");
				}
			}
		}
		else
		{
			start = 0;
			if(titles_array.length==0)
			{
				start = 0;
			}
			else
			{
				start = titles_array[titles_array.length - 1].end_time + 0.2;
			}
			if(start < video.duration)
			{
				Pause();
				var end = start+2 > video.duration ? video.duration : start+2;
				CreateAddTitleDiv(start,end);
				add_title_button.setAttribute("class","pressed_button");
				document.getElementById("myDropdown").classList.remove("show");
				add_annotation_button.setAttribute("class","button");
				import_export.setAttribute("class","button");
			}
		}
	});
	
	add_annotation_button.addEventListener("click",function()
	{
		myDropdown.classList.toggle("show");
	});
	
	import_export.addEventListener("click",function()
	{
		if(import_export.getAttribute("class") == "pressed_button")
		{
			new_item_div.innerHTML="";
			import_export.setAttribute("class","button");
			add_annotation_button.setAttribute("class","button");
			add_title_button.setAttribute("class","button");
		}
		else
		{	
			myDropdown.classList.remove("show");
			if(new_item_div.innerHTML=="")
			{
				import_export.setAttribute("class","pressed_button");
				add_annotation_button.setAttribute("class","button");
				add_title_button.setAttribute("class","button");
				CreateImportExportDiv();
			}
			else
			{
				document.getElementById("save_button").click();
				if(new_item_div.innerHTML=="")
				{
					import_export.setAttribute("class","pressed_button");
					add_annotation_button.setAttribute("class","button");
					add_title_button.setAttribute("class","button");
					CreateImportExportDiv();
				}
			}
		}
	});
}

function CreateImportExportDiv()
{
	var container = document.createElement("div");
	var subt_name = document.createTextNode("Download Subtitles:");
	var subt_name_input = document.createElement("input");
	subt_name_input.setAttribute("type","text");
	subt_name_input.setAttribute("placeholder","filename");
	var subt_format_input = document.createElement("select");
	var srt_format = document.createElement("option");
	srt_format.value = ".srt";
	srt_format.innerHTML = ".srt";
	var vtt_format = document.createElement("option");
	vtt_format.value = ".vtt";
	vtt_format.innerHTML = ".vtt";
	subt_format_input.appendChild(srt_format);
	subt_format_input.appendChild(vtt_format);
	var dlsubt_button = document.createElement("button");
	dlsubt_button.innerHTML = "Download";
	
	var annot_name = document.createTextNode("Download Annotations:");
	var annot_name_input = document.createElement("input");
	annot_name_input.setAttribute("type","text");
	annot_name_input.setAttribute("placeholder","filename");
	var dl_annot_button = document.createElement("button");
	dl_annot_button.innerHTML = "Download";
	
	var d1 = document.createElement("div");
	d1.appendChild(annot_name);
	d1.appendChild(annot_name_input);
	d1.appendChild(dl_annot_button);
	
	var d = document.createElement("div");
	d.appendChild(subt_name);
	d.appendChild(subt_name_input);
	d.appendChild(subt_format_input);
	d.appendChild(dlsubt_button);
	
	if(titles_array.length > 0)
	{
		container.appendChild(d);
	}
	if(canvas_array.length > 0)
	{
		container.appendChild(d1);
	}
	
	var up_annot_text = document.createTextNode("Upload Annotations:");	
	var annot_input = document.createElement("input");
	annot_input.setAttribute("type","file");
	
	var up_subt_text = document.createTextNode("Upload Subtitels:");
	var subt_input = document.createElement("input");
	subt_input.setAttribute("type","file");

	var d2 = document.createElement("div");
	d2.appendChild(up_subt_text);
	d2.appendChild(subt_input); 
	container.appendChild(d2);
	
	var d3 = document.createElement("div");
	d3.appendChild(up_annot_text);
	d3.appendChild(annot_input);
	
	var save_db = document.createElement("div");
	container.appendChild(d3);
	
	if(canvas_array.length > 0 || titles_array.length > 0)
	{
		save_db.setAttribute("class","button");
		save_db.innerHTML = "Save to database";
		container.appendChild(save_db);
	}
	
	new_item_div.appendChild(container);
	
	subt_input.addEventListener('change', function(evt)
	{
		var file = evt.target.files[0];
		var reader = new FileReader();
		reader.readAsText(file);
		reader.addEventListener("load", function () 
		{
			
			var ext =subt_input.value.split(".");
			if(ext[ext.length-1]=="srt")
			{
				LoadSubtitlesFromSRTFile(reader.result);
			}
			else if(ext[ext.length-1]=="vtt")
			{
				LoadSubtitlesFromVTTFile(reader.result);
			}
		}, false);	
	});
	
	annot_input.addEventListener('change', function(evt)
	{
		var file = evt.target.files[0];
		var reader = new FileReader();
		reader.readAsText(file);
		reader.addEventListener("load", function () 
		{
			LoadAnnotationsFromString(reader.result);
			import_export.setAttribute("class","button");
			add_annotation_button.setAttribute("class","button");
			add_title_button.setAttribute("class","button");
			container.remove();
		}, false);
	});


	dlsubt_button.addEventListener("click",function()
	{
		var pom = document.createElement('a');
		if(subt_format_input.value == ".vtt")
		{
			pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(ToVTTFormat()));
		}
		else
		{
			pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(ToSRTFormat()));
		}
		var filename = "subtitles" + subt_format_input.value;
		if(subt_name_input.value != "")
		{	
			filename = subt_name_input.value + subt_format_input.value;
		}		
		pom.setAttribute('download', filename);

		if (document.createEvent) 
		{
			var event = document.createEvent('MouseEvents');
			event.initEvent('click', true, true);
			pom.dispatchEvent(event);
		}
		else 
		{
			pom.click();
		}

	});
	
	dl_annot_button.addEventListener("click",function()
	{
		var pom = document.createElement('a');
		pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(CanvasArrayToString()));
		var filename = "annotations.ant";
		if(annot_name_input.value != "")
		{	
			filename = annot_name_input.value + ".ant";
		}		
		pom.setAttribute('download', filename);

		if (document.createEvent) 
		{
			var event = document.createEvent('MouseEvents');
			event.initEvent('click', true, true);
			pom.dispatchEvent(event);
		}
		else 
		{
			pom.click();
		}

	});
	
	save_db.addEventListener("click",function()
	{
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action","./upload_files.php");
		var video_src = document.createElement("input");
		video_src.setAttribute("type","hidden");
		video_src.setAttribute("name","video_src");
		video_src.value = video.getElementsByTagName("source")[0].src;
		var author_input = document.createElement("input");
		author_input.setAttribute("type","text");
		author_input.setAttribute("name","author");
		author_input.setAttribute("placeholder","Your Name");
		var submit = document.createElement("input");
		submit.setAttribute("type","submit");
		submit.setAttribute("value","Upload");
		form.appendChild(video_src);
		form.appendChild(author_input);
		form.appendChild(submit);
		if(titles_array.length > 0)
		{
			var subt = document.createElement("input");
			subt.setAttribute("type", "hidden");
			subt.setAttribute("name", "subt");
			subt.setAttribute("value", TitlesArrayToString());
			form.appendChild(subt);
			var subt_size = document.createElement("input");
			subt_size.setAttribute("name","subt_size");
			subt_size.setAttribute("type","hidden");
			subt_size.value = titles_array.length;
			form.appendChild(subt_size);
		}
		if(canvas_array.length > 0)
		{
			var annot_size = document.createElement("input");
			annot_size.setAttribute("name","annot_size");
			annot_size.setAttribute("type","hidden");
			annot_size.value = canvas_array.length;
			var annot = document.createElement("input");
			annot.setAttribute("type", "hidden");
			annot.setAttribute("name", "annot");
			annot.setAttribute("value", CanvasArrayToString());
			form.appendChild(annot);
			form.appendChild(annot_size);
		}
		if(canvas_array.length > 0 || titles_array.length > 0)
		{
			container.appendChild(form);
		}
	});
		
	var remove = document.createElement("button");
	remove.setAttribute("id","save_button");
	container.appendChild(remove);
	remove.setAttribute("class","hide");
	remove.addEventListener("click",function()
	{
		container.remove();
	});
}
