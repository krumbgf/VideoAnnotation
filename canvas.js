function SetStyle(canvas_obj)
{
	canvas_obj.style.position = "absolute";
	canvas_obj.style.top=video.offsetTop+"px";
	canvas_obj.style.left=video.offsetLeft+"px";
//DEBUG	canvas_obj.style.backgroundColor = "rgba(255,0,0,0.5)";
}
function ResizeCanvas(canvas_obj)
{
	var w = video.offsetWidth;
	var h = video.offsetHeight;
	canvas_obj.width = w;
	canvas_obj.height =h;
}

function CreateImg(img_obj)
{
	document.documentElement.scrollTop = video.offsetTop;
	document.body.style.overflow = "hidden";
	canvas_img.img = img_obj;
	var scale = canvas_img.width/canvas_img.img.width;
	var width = canvas_img.width;
	var height = canvas_img.img.height*scale;
	var c = document.createElement("canvas");
	document.getElementById("media_player").appendChild(c);
	var ctx = c.getContext('2d');
	SetStyle(c);
	ResizeCanvas(c);
	document.getElementById("media_player").appendChild(c);
	ctx.drawImage(canvas_img.img,0,0,canvas_img.img.width,canvas_img.img.height,canvas_img.position.x,canvas_img.position.y,width,height);
	
	var drag = false;
	var prevX;
	var prevY;
	c.addEventListener("mousedown",function(e)
	{
		var currX = e.clientX - c.offsetLeft + window.pageXOffset;
		var currY = e.clientY - c.offsetTop + window.pageYOffset;
		if(currX > canvas_img.position.x && currX < canvas_img.position.x + width && currY > canvas_img.position.y && currY < canvas_img.position.y + height)
		{
			prevX = currX;
			prevY = currY;
			drag = true;
		}
		
	});
	
	c.addEventListener("mouseup",function(e)
	{
		drag = false;
	});
	
	c.addEventListener("mousewheel",function(e)
	{
		document.documentElement.scrollTop = video.offsetTop;
		document.body.style.overflow = "hidden";
		if(e.wheelDelta > 0)
		{
			canvas_img.width += canvas_img.width/17;
		}
		else
		{
			canvas_img.width -= canvas_img.width/17;
		}
		width = canvas_img.width;
		scale = width/canvas_img.img.width;
		height = canvas_img.img.height*scale;
		ctx.clearRect(0,0,c.width,c.height);
		ctx.drawImage(canvas_img.img,0,0,canvas_img.img.width,canvas_img.img.height,canvas_img.position.x,canvas_img.position.y,width,height);
	});
	
	c.addEventListener('DOMMouseScroll',function(e)
	{
		document.documentElement.scrollTop = video.offsetTop;
		document.body.style.overflow = "hidden";
		if(e.detail > 0)
		{
			canvas_img.width -= canvas_img.width/17;
		}
		else
		{
			canvas_img.width += canvas_img.width/17;
		}
		width = canvas_img.width;
		scale = width/canvas_img.img.width;
		height = canvas_img.img.height*scale;
		ctx.clearRect(0,0,c.width,c.height);
		ctx.drawImage(canvas_img.img,0,0,canvas_img.img.width,canvas_img.img.height,canvas_img.position.x,canvas_img.position.y,width,height);
	});
	
	c.addEventListener("mousemove",function(e)
	{
		var currX = e.clientX - c.offsetLeft + window.pageXOffset;
		var currY = e.clientY - c.offsetTop + window.pageYOffset;
		if(drag==true)
		{
			var diffX = currX - prevX;
			var diffY = currY - prevY;
			prevX = currX;
			prevY = currY;
			canvas_img.position.x +=diffX;
			canvas_img.position.y +=diffY;
			ctx.clearRect(0,0,c.width,c.height);
			ctx.drawImage(canvas_img.img,0,0,canvas_img.img.width,canvas_img.img.height,canvas_img.position.x,canvas_img.position.y,width,height);
		}
	});
	return c;
}

function DrawImage(canvas_obj, img_obj)
{
	var ctx = canvas_obj.getContext("2d");
	ctx.clearRect(0,0,canvas_obj.width,canvas_obj.height);
	var width = img_obj.width;
	var scale = img_obj.width/img_obj.img.width;
	var height = img_obj.img.height*scale;
	ctx.clearRect(0,0,canvas_obj.width,canvas_obj.height);
	ctx.drawImage(img_obj.img,0,0,img_obj.img.width,img_obj.img.height,img_obj.position.x*scale_factor,img_obj.position.y*scale_factor,width*scale_factor,height*scale_factor);
}

function MouseOverLabel(point)
{
	for(var i = 0;i<canvas_array.length;i++)
	{
		if(canvas_array[i].type == "label")
		{
			if(point.x > canvas_array[i].rect[0].x*scale_factor && point.x < canvas_array[i].rect[2].x*scale_factor 
				&& point.y > canvas_array[i].rect[0].y*scale_factor && point.y < canvas_array[i].rect[2].y*scale_factor)
			{
				canvas_array[i].mouseover = true;
			}
			else
			{
				canvas_array[i].mouseover = false;
			}
		}
	}
}

function DrawPolygonHelper(canvas_obj,canvas_note_obj)
{
	var w = canvas_note_obj.rect[2].x - canvas_note_obj.rect[0].x;
	var h = canvas_note_obj.rect[2].y - canvas_note_obj.rect[0].y;
	var ctx = canvas_obj.getContext('2d');
	SetStyle(canvas_obj);
	ResizeCanvas(canvas_obj);
	ctx.clearRect(0,0,canvas_obj.width,canvas_obj.height);
	for(var i=0;i<4;i++)
	{
		DrawSquare(canvas_obj,canvas_note_obj.rect[i],5);
	}
	DrawTextBox(canvas_obj,canvas_note_obj.rect[0].x,canvas_note_obj.rect[0].y,w,h,canvas_note_obj.text,canvas_note_obj.paint);
}

function CreateNote()
{
	var c = document.createElement("canvas");
	var ctx = c.getContext('2d');
	SetStyle(c);
	ResizeCanvas(c);
	document.getElementById("media_player").appendChild(c);	
	var w = canvas_note.rect[2].x - canvas_note.rect[0].x;
	var h = canvas_note.rect[2].y - canvas_note.rect[0].y;
	for(var i=0;i<4;i++)
	{
		DrawSquare(c,canvas_note.rect[i],5);
	}
	DrawTextBox(c,canvas_note.rect[0].x,canvas_note.rect[0].y,w,h,canvas_note.text,canvas_note.paint);
	var resize = false;
	var point_index = -1;
	var drag = false;
	var prevX;
	var prevY;
	
	c.addEventListener("mousedown",function(e)
	{
		var currX = e.clientX - c.offsetLeft + window.pageXOffset;
		var currY = e.clientY - c.offsetTop + window.pageYOffset;
		if(!resize && !drag)
		{
			for(var i=0;i<4;i++)
			{
				if(IsInsideSquare(canvas_note.rect[i],5,{"x":currX,"y":currY}))
				{
					point_index = i;
					resize = true;
				}
			}
			if(!resize)
			{
				if(currX > canvas_note.rect[0].x && currX < canvas_note.rect[2].x && currY > canvas_note.rect[0].y && currY < canvas_note.rect[2].y)
				{
					prevX = currX;
					prevY = currY;
					drag = true;
				}
			}
		}
		
	});
	
	c.addEventListener("mousemove",function(e)
	{
		var currX = e.clientX - c.offsetLeft + window.pageXOffset;
		var currY = e.clientY - c.offsetTop + window.pageYOffset;
		if(resize)
		{			
			if(point_index == 0)
			{
				var x_point = 3;
				var y_point = 1;
				if(canvas_note.rect[2].x > 3 + currX && canvas_note.rect[2].y > 3 + currY)
				{
					ctx.clearRect(0, 0, c.width, c.height);
					canvas_note.rect[point_index].x = currX;
					canvas_note.rect[point_index].y = currY;
					canvas_note.rect[x_point].x = currX;
					canvas_note.rect[y_point].y = currY;
					w = canvas_note.rect[2].x - canvas_note.rect[0].x;
					h = canvas_note.rect[2].y - canvas_note.rect[0].y;
					for(var i=0;i<4;i++)
					{
						DrawSquare(c,canvas_note.rect[i],5);
					}
					DrawTextBox(c,canvas_note.rect[0].x,canvas_note.rect[0].y,w,h,canvas_note.text,canvas_note.paint);
				}
				else
				{
					resize = false;
					point_index = -1;
				}
			}
			else if(point_index == 2)
			{
				var x_point = 1;
				var y_point = 3;
				if(canvas_note.rect[0].x + 3 < currX && canvas_note.rect[0].y + 3 < currY)
				{
					ctx.clearRect(0, 0, c.width, c.height);
					canvas_note.rect[point_index].x = currX;
					canvas_note.rect[point_index].y = currY;
					canvas_note.rect[x_point].x = currX;
					canvas_note.rect[y_point].y = currY;
					w = canvas_note.rect[2].x - canvas_note.rect[0].x;
					h = canvas_note.rect[2].y - canvas_note.rect[0].y;
					for(var i=0;i<4;i++)
					{
						DrawSquare(c,canvas_note.rect[i],5);
					}
					DrawTextBox(c,canvas_note.rect[0].x,canvas_note.rect[0].y,w,h,canvas_note.text,canvas_note.paint);
				}
				else
				{
					resize = false;
					point_index = -1;
				}
			}
			else if(point_index == 1)
			{
				var x_point = 2;
				var y_point = 0;
				if(canvas_note.rect[3].x + 3 < currX && canvas_note.rect[3].y > 3+ currY)
				{
					ctx.clearRect(0, 0, c.width, c.height);
					canvas_note.rect[point_index].x = currX;
					canvas_note.rect[point_index].y = currY;
					canvas_note.rect[x_point].x = currX;
					canvas_note.rect[y_point].y = currY;
					w = canvas_note.rect[2].x - canvas_note.rect[0].x;
					h = canvas_note.rect[2].y - canvas_note.rect[0].y;
					for(var i=0;i<4;i++)
					{
						DrawSquare(c,canvas_note.rect[i],5);
					}
					DrawTextBox(c,canvas_note.rect[0].x,canvas_note.rect[0].y,w,h,canvas_note.text,canvas_note.paint);
				}
				else
				{
					resize = false;
					point_index = -1;
				}
			}
			else if(point_index == 3)
			{
				var x_point = 0;
				var y_point = 2;
				if(canvas_note.rect[1].x > 3+currX && canvas_note.rect[1].y+ 3 < currY)
				{
					ctx.clearRect(0, 0, c.width, c.height);
					canvas_note.rect[point_index].x = currX;
					canvas_note.rect[point_index].y = currY;
					canvas_note.rect[x_point].x = currX;
					canvas_note.rect[y_point].y = currY;
					w = canvas_note.rect[2].x - canvas_note.rect[0].x;
					h = canvas_note.rect[2].y - canvas_note.rect[0].y;
					for(var i=0;i<4;i++)
					{
						DrawSquare(c,canvas_note.rect[i],5);
					}
					DrawTextBox(c,canvas_note.rect[0].x,canvas_note.rect[0].y,w,h,canvas_note.text,canvas_note.paint);
				}
				else
				{
					resize = false;
					point_index = -1;
				}
			}
		}
		else if(drag==true)
		{
			var diffX = currX - prevX;
			var diffY = currY - prevY;
			prevX = currX;
			prevY = currY;
			ctx.clearRect(0, 0, c.width, c.height);
			for(var i=0;i<4;i++)
			{
				canvas_note.rect[i].x += diffX;
				canvas_note.rect[i].y += diffY;
				DrawSquare(c,canvas_note.rect[i],5);
			}
			DrawTextBox(c,canvas_note.rect[0].x,canvas_note.rect[0].y,w,h,canvas_note.text,canvas_note.paint);
			
		}
	});
	
	c.addEventListener("mouseup",function(e)
	{
		resize = false;
		point_index = -1;
		drag= false;
	});
	
	c.addEventListener("mouseout",function(e)
	{
		drag = false;
		resize = false;
	});
	return c;
}

function CreatePolygon()
{
	var c = document.createElement("canvas");
	var ctx = c.getContext('2d');
	SetStyle(c);
	ResizeCanvas(c);
	document.getElementById("media_player").appendChild(c);
	canvas_polygon.points = new Array();
	c.addEventListener("mouseup",function(e)
	{
		var currX = e.clientX - c.offsetLeft + window.pageXOffset;
		var currY = e.clientY - c.offsetTop + window.pageYOffset;
		for(var i=0;i<canvas_polygon.points.length;i++)
		{
			if(IsInsideSquare(canvas_polygon.points[i],3,{"x":currX,"y":currY}))
			{
				canvas_polygon.points.splice(i,1);
				DrawPolygon(c,canvas_polygon.points,canvas_polygon.RGBA_COLOR);
				for(var j=0;j<canvas_polygon.points.length;j++)
				{
					DrawSquare(c,canvas_polygon.points[j],3);
				}				
				return;
			}
		}
		if(canvas_polygon.points.length >=2)
		{
			canvas_polygon.points.push({"x":currX, "y": currY});
			DrawPolygon(c,canvas_polygon.points,canvas_polygon.RGBA_COLOR);
			for(var i=0;i<canvas_polygon.points.length;i++)
			{
				DrawSquare(c,canvas_polygon.points[i],3);
			}	
		}
		else
		{
			canvas_polygon.points.push({"x":currX, "y": currY});
			DrawSquare(c,{"x":currX,"y":currY},3);
		}
	});
	return c;
}

function DrawPolygon(canvas_obj, points_arr, rgba_color_string)
{
	var ctx = canvas_obj.getContext("2d");
	ctx.clearRect(0, 0, canvas_obj.width, canvas_obj.height);
	ctx.fillStyle = rgba_color_string;
	ctx.beginPath();
	ctx.moveTo(points_arr[0].x*scale_factor, points_arr[0].y*scale_factor);
	for(var i = 1;i<points_arr.length;i++)
	{
		ctx.lineTo(points_arr[i].x*scale_factor , points_arr[i].y*scale_factor);
	}
	ctx.closePath();
	ctx.fill();
}

function IsInsideSquare(center,half_size,point)
{
	if(point.x < center.x - half_size || point.x > center.x + half_size)
	{
		return false;
	}
	if(point.y < center.y - half_size || point.y > center.y + half_size)
	{
		return false;
	}
	return true;
}

function DrawSquare(canvas_obj,center,half_size)
{
	var ctx = canvas_obj.getContext('2d');
	ctx.fillStyle = '#0f1114';
	ctx.fillRect(center.x-half_size,center.y-half_size,half_size*2,half_size*2);
}

//http://andreinc.net/2012/11/14/painting-and-wrapping-a-text-inside-a-rectangular-area-html5-canvas/
function DrawTitle(canvas_obj, text, Paint) 
{
	var font_size = Paint.FONT_SIZE*scale_factor;
	var VALUE_FONT = font_size + "px " + Paint.FONT; 
	var fh = Math.floor(0.8*font_size);
	var spl = Math.floor(font_size/10)+1;
    /*
     * @param ctx   : The 2d context 
     * @param mw    : The max width of the text accepted
     * @param font  : The font used to draw the text
     * @param text  : The text to be splitted   into 
     */
    var split_lines = function(ctx, mw, font, text) 
	{
        // We give a little "padding"
        // This should probably be an input param
        // but for the sake of simplicity we will keep it
        // this way
        mw = mw - 5;
        // We setup the text font to the context (if not already)
        ctx2d.font = font;
        // We split the text by words 
        var words = text.split(' ');
        var new_line = words[0];
        var lines = [];
        for(var i = 1; i < words.length; ++i) 
		{
           if (ctx.measureText(new_line + " " + words[i]).width < mw) 
		   {
               new_line += " " + words[i];
           } else 
		   {
               lines.push(new_line);
               new_line = words[i];
           }
        }
        lines.push(new_line);
        return lines;
    }
    // Obtains the context 2d of the canvas 
    // It may return null
    var ctx2d = canvas_obj.getContext('2d');
	ctx2d.clearRect(0,0,canvas_obj.width,canvas_obj.height);
	// Paint text
	ctx2d.fillStyle = Paint.FONT_COLOR;
	var lines = split_lines(ctx2d, canvas_obj.width, VALUE_FONT, text);
	// Block of text height
	var both = lines.length * (fh + spl);

	// We determine the y of the first line
	var ly = (canvas_obj.height - both)/2 + spl*lines.length;
	var lx = 0;
	for (var j = 0, ly; j < lines.length; ++j, ly+=fh+spl) 
	{
		lx = canvas_obj.width/2-ctx2d.measureText(lines[j]).width/2;
		ctx2d.fillText(lines[j], lx, ly);
	}
}

//http://andreinc.net/2012/11/14/painting-and-wrapping-a-text-inside-a-rectangular-area-html5-canvas/
function DrawTextBox(canvas_obj, x, y, w, h, text, Paint) 
{	
	var VALUE_FONT = Paint.FONT_SIZE + "px " +Paint.FONT; 
	var fh = Math.floor(0.77*Paint.FONT_SIZE);
	var spl = Math.floor(Paint.FONT_SIZE/12)+1;
	
    /*
     * @param ctx   : The 2d context 
     * @param mw    : The max width of the text accepted
     * @param font  : The font used to draw the text
     * @param text  : The text to be splitted   into 
     */
    var split_lines = function(ctx, mw, font, text) 
	{
        // We give a little "padding"
        // This should probably be an input param
        // but for the sake of simplicity we will keep it
        // this way
        mw = mw - 5;
        // We setup the text font to the context (if not already)
        ctx2d.font = font;
        // We split the text by words 
        var words = text.split(' ');
        var new_line = words[0];
        var lines = [];
        for(var i = 1; i < words.length; ++i) 
		{
           if (ctx.measureText(new_line + " " + words[i]).width < mw) 
		   {
               new_line += " " + words[i];
           } else 
		   {
               lines.push(new_line);
               new_line = words[i];
           }
        }
        lines.push(new_line);
        return lines;
    }
    // Obtains the context 2d of the canvas 
    // It may return null
    var ctx2d = canvas_obj.getContext('2d');

	// draw rectangular
	ctx2d.fillStyle = Paint.RECTANGLE_BACKGROUND_COLOR;
	ctx2d.fillRect(x,y,w,h);
	ctx2d.strokeStyle=Paint.RECTANGLE_LINE_COLOR;
	ctx2d.lineWidth = Paint.RECTANGLE_LINE_WIDTH;
	ctx2d.strokeRect(x, y, w, h);
	// Paint text
	ctx2d.fillStyle = Paint.FONT_COLOR;
	var lines = split_lines(ctx2d, w, VALUE_FONT, text);
	// Block of text height

	var ly = y + spl+fh;
	var lx = 0;
	for (var j = 0, ly; j < lines.length; ++j, ly+=fh+spl) 
	{
		lx = x+w/2-ctx2d.measureText(lines[j]).width/2;
		ctx2d.fillText(lines[j], lx, ly);
	}

}

function CreateTitleDiv(start_time, end_time,edit)
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
	
	var font_size_text = document.createElement("span");
	font_size_text.setAttribute("class","fixed_width_text")
	font_size_text.innerHTML="Font size:";
	var font_color_text = document.createElement("span");
	font_color_text.setAttribute("class","fixed_width_text");
	font_color_text.innerHTML="Font color:";
	var font_opacity_text = document.createElement("span");
	font_opacity_text.setAttribute("class","fixed_width_text");
	font_opacity_text.innerHTML="Font Opacity:";
	
	var hex_opacity;
	var font_size_input = document.createElement("input");
	font_size_input.setAttribute("id","font_size");
	font_size_input.setAttribute("type", "number")
	font_size_input.setAttribute("min","1");
	font_size_input.setAttribute("max","100");
	font_size_input.value = title_paint.FONT_SIZE;
	
	hex_opacity = RGBAToHex(title_paint.FONT_COLOR);
	var font_color_input = document.createElement("input");
	font_color_input.setAttribute("id","font_color"); 
	font_color_input.setAttribute("type","color");
	font_color_input.value = hex_opacity.hex;
	
	var font_opacity_input = document.createElement("input");
	font_opacity_input.setAttribute("id","font_opacity");
	font_opacity_input.setAttribute("type", "number")
	font_opacity_input.setAttribute("min","0");
	font_opacity_input.setAttribute("max","1");
	font_opacity_input.setAttribute("step","0.05");
	font_opacity_input.value = hex_opacity.opacity;
	
	var d1 = document.createElement("div");
	d1.appendChild(font_size_text);
	d1.appendChild(font_size_input);
	d1.appendChild(font_color_text);
	d1.appendChild(font_color_input);
	d1.appendChild(font_opacity_text);
	d1.appendChild(font_opacity_input);
	
	var save_button = document.createElement("button");
	save_button.setAttribute("id","save_button");
	save_button.innerHTML="Save";
	var discard_button = document.createElement("button");
	discard_button.setAttribute("class","discard_button");
	discard_button.innerHTML= "Delete";
	var d2 = document.createElement("div");
	d2.appendChild(save_button);
	d2.appendChild(discard_button);

	container.appendChild(times_div);
	container.appendChild(text);
	container.appendChild(d1);
	container.appendChild(d2);
	new_item_div.appendChild(container);
	
	if(edit == false)
	{
		title_note = new Object();
		title_note.type = "title";
		title_note.show = false;
		title_note.start_time = start_time;
		title_note.end_time = end_time;
		title_note.text = "";
		title_note.paint = cloneObject(title_paint);
	}
	
	var c = document.createElement("canvas");
	SetStyle(c);
	ResizeCanvas(c);
	DrawTitle(c,title_note.text,title_note.paint);
	document.getElementById("media_player").appendChild(c);
	
	text.onkeyup = function ()
	{
		title_note.text = text.value;
		DrawTitle(c,title_note.text,title_note.paint)
	};
	
	font_size_input.addEventListener("change",function()
	{
		title_note.paint.FONT_SIZE = font_size_input.value;
		DrawTitle(c,title_note.text,title_note.paint)
	});
	
	font_color_input.addEventListener("change",function()
	{
		var opacity = RGBAToHex(title_note.paint.FONT_COLOR).opacity;
		title_note.paint.FONT_COLOR = HexToRGBA(font_color_input.value,opacity);
		DrawTitle(c,title_note.text,title_note.paint)
	});
	
	font_opacity_input.addEventListener("change",function()
	{
		var color = RGBAToHex(title_note.paint.FONT_COLOR).hex;
		title_note.paint.FONT_COLOR = HexToRGBA(color,font_opacity_input.value);
		DrawTitle(c,title_note.text,title_note.paint)
	});
	
	save_button.addEventListener("click",function()
	{
		if(text.value == "")
		{
			discard_button.click();
		}
		else
		{
			var start = ReadableTimeToSeconds(stime.value);
			var end = ReadableTimeToSeconds(etime.value);
			if(start < end && start >= 0 && end<=video.duration)
			{
				title_note.start_time = start;
				title_note.end_time = end;
				var index = InsertIndex(title_note,canvas_array,0,canvas_array.length - 1);
				annot_ol.insertBefore(CreateAnnotationListRow(index,start,end,text.value,"Title"),annot_ol.childNodes[index]);
				UpdateIndexes(annot_ol,0);
				canvas_array.splice(index,0,title_note);
				title_paint = title_note.paint;
				c.remove();
				ReDraw();
				PlayCanvas();
				add_annotation_button.setAttribute("class","button");
				container.remove();
			}
		}
	});
	
	discard_button.addEventListener("click",function()
	{
		myDropdown.classList.remove("show");
		import_export.setAttribute("class","button");
		add_annotation_button.setAttribute("class","button");
		add_title_button.setAttribute("class","button");
		c.remove();
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

function CreateNoteOrLabelDiv(start_time,end_time,type,edit)
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
	
	var font_size_text = document.createElement("span");
	font_size_text.setAttribute("class","fixed_width_text")
	font_size_text.innerHTML="Font size:";
	var font_color_text = document.createElement("span");
	font_color_text.setAttribute("class","fixed_width_text");
	font_color_text.innerHTML="Font color:";
	var font_opacity_text = document.createElement("span");
	font_opacity_text.setAttribute("class","fixed_width_text");
	font_opacity_text.innerHTML="Font Opacity:";
	var background_color_text = document.createElement("span");
	background_color_text.setAttribute("class","fixed_width_text");
	background_color_text.innerHTML="Background:";
	var background_opacity_text = document.createElement("span");
	background_opacity_text.setAttribute("class","fixed_width_text");
	background_opacity_text.innerHTML="Background Opacity:";
	var border_color_text = document.createElement("span");
	border_color_text.setAttribute("class","fixed_width_text");
	border_color_text.innerHTML="Border color:";
	var border_size_text = document.createElement("span");
	border_size_text.setAttribute("class","fixed_width_text");
	border_size_text.innerHTML="Border size:";
	
	var hex_opacity;
	var font_size_input = document.createElement("input");
	font_size_input.setAttribute("id","font_size");
	font_size_input.setAttribute("type", "number")
	font_size_input.setAttribute("min","1");
	font_size_input.setAttribute("max","100");
	font_size_input.value = paint.FONT_SIZE;
	
	hex_opacity = RGBAToHex(paint.FONT_COLOR);
	var font_color_input = document.createElement("input");
	font_color_input.setAttribute("id","font_color"); 
	font_color_input.setAttribute("type","color");
	font_color_input.value = hex_opacity.hex;
	
	var font_opacity_input = document.createElement("input");
	font_opacity_input.setAttribute("id","font_opacity");
	font_opacity_input.setAttribute("type", "number")
	font_opacity_input.setAttribute("min","0");
	font_opacity_input.setAttribute("max","1");
	font_opacity_input.setAttribute("step","0.05");
	font_opacity_input.value = hex_opacity.opacity;
	
	hex_opacity = RGBAToHex(paint.RECTANGLE_BACKGROUND_COLOR);
	var background_color_input = document.createElement("input");
	background_color_input.setAttribute("id","background_color");
	background_color_input.setAttribute("type","color");
	background_color_input.value = hex_opacity.hex;
	
	var background_opacity_input = document.createElement("input");
	background_opacity_input.setAttribute("id","background_opacity");
	background_opacity_input.setAttribute("type", "number")
	background_opacity_input.setAttribute("min","0");
	background_opacity_input.setAttribute("max","1");
	background_opacity_input.setAttribute("step","0.05");
	background_opacity_input.value = hex_opacity.opacity;
	
	hex_opacity = RGBAToHex(paint.RECTANGLE_LINE_COLOR);
	var border_color_input = document.createElement("input");
	border_color_input.setAttribute("id","border_color");
	border_color_input.setAttribute("type","color");
	border_color_input.value = hex_opacity.hex;
	
	var border_size_input = document.createElement("input");
	border_size_input.setAttribute("id","border_size");
	border_size_input.setAttribute("type", "number")
	border_size_input.setAttribute("min","1");
	border_size_input.setAttribute("max","10");
	border_size_input.value = paint.RECTANGLE_LINE_WIDTH;
	
	var d1 = document.createElement("div");
	d1.appendChild(font_size_text);
	d1.appendChild(font_size_input);
	d1.appendChild(font_color_text);
	d1.appendChild(font_color_input);
	d1.appendChild(font_opacity_text);
	d1.appendChild(font_opacity_input);
	
	var d2 = document.createElement("div");
	d2.appendChild(border_size_text);
	d2.appendChild(border_size_input);
	d2.appendChild(border_color_text);
	d2.appendChild(border_color_input);
	
	var d3 = document.createElement("div");
	d3.appendChild(background_color_text);
	d3.appendChild(background_color_input);
	d3.appendChild(background_opacity_text);
	d3.appendChild(background_opacity_input);
	
	var save_button = document.createElement("button");
	save_button.setAttribute("id","save_button");
	save_button.innerHTML="Save";
	var discard_button = document.createElement("button");
	discard_button.setAttribute("class","discard_button");
	discard_button.innerHTML= "Delete";
	var d4 = document.createElement("div");
	d4.appendChild(save_button);
	d4.appendChild(discard_button);

	container.appendChild(times_div);
	container.appendChild(text);
	container.appendChild(d1);
	container.appendChild(d2);
	container.appendChild(d3);
	container.appendChild(d4);
	new_item_div.appendChild(container);
	
	if(edit == false)
	{
		canvas_note = undefined;
		canvas_note = new Object();
		canvas_note.start_time = start_time;
		canvas_note.end_time = end_time;
		canvas_note.text = "";
		canvas_note.paint = new Object();
		canvas_note.paint = cloneObject(paint);
		canvas_note.rect = new Array();
		canvas_note.rect.push({"x":20, "y":20});
		canvas_note.rect.push({"x":200, "y":20});
		canvas_note.rect.push({"x":200, "y":100});
		canvas_note.rect.push({"x":20, "y":100});
	}
	var canvas = CreateNote();
	
	text.onkeyup = function ()
	{
		canvas_note.text = text.value;
		DrawPolygonHelper(canvas,canvas_note);
	};
	
	font_size_input.addEventListener("change",function()
	{
		canvas_note.paint.FONT_SIZE = font_size_input.value;
		DrawPolygonHelper(canvas,canvas_note);
	});
	
	font_color_input.addEventListener("change",function()
	{
		var opacity = RGBAToHex(canvas_note.paint.FONT_COLOR).opacity;
		canvas_note.paint.FONT_COLOR = HexToRGBA(font_color_input.value,opacity);
		DrawPolygonHelper(canvas,canvas_note);
	});
	
	font_opacity_input.addEventListener("change",function()
	{
		var color = RGBAToHex(canvas_note.paint.FONT_COLOR).hex;
		canvas_note.paint.FONT_COLOR = HexToRGBA(color,font_opacity_input.value);
		DrawPolygonHelper(canvas,canvas_note);
	});
	
	background_color_input.addEventListener("change",function()
	{
		var opacity = RGBAToHex(canvas_note.paint.RECTANGLE_BACKGROUND_COLOR).opacity;
		canvas_note.paint.RECTANGLE_BACKGROUND_COLOR = HexToRGBA(background_color_input.value,opacity);
		DrawPolygonHelper(canvas,canvas_note);
	});
	
	background_opacity_input.addEventListener("change",function()
	{
		var color = RGBAToHex(canvas_note.paint.RECTANGLE_BACKGROUND_COLOR).hex;
		canvas_note.paint.RECTANGLE_BACKGROUND_COLOR = HexToRGBA(color,background_opacity_input.value);
		DrawPolygonHelper(canvas,canvas_note);
	});
	
	border_color_input.addEventListener("change",function()
	{
		canvas_note.paint.RECTANGLE_LINE_COLOR = HexToRGBA(border_color_input.value,1.0);
		DrawPolygonHelper(canvas,canvas_note);
	});
	
	border_size_input.addEventListener("change",function()
	{
		canvas_note.paint.RECTANGLE_LINE_WIDTH = border_size_input.value;
		DrawPolygonHelper(canvas,canvas_note);
	});
	
	save_button.addEventListener("click",function()
	{
		var start = ReadableTimeToSeconds(stime.value);
		var end = ReadableTimeToSeconds(etime.value);
		if(start < end && start >= 0 && end<=video.duration)
		{
			canvas_note.start_time = start;
			canvas_note.end_time = end;
			var index = InsertIndex(canvas_note,canvas_array,0,canvas_array.length - 1);
			annot_ol.insertBefore(CreateAnnotationListRow(index,start,end,text.value,type),annot_ol.childNodes[index]);
			UpdateIndexes(annot_ol,0);
			canvas_note.type = type;
			canvas_note.show = false;
			canvas_note.mouseover = false;
			canvas_array.splice(index,0,canvas_note);
			paint = canvas_note.paint;
			canvas_note = undefined;
			canvas.remove();
			ReDraw();
			PlayCanvas();
			add_annotation_button.setAttribute("class","button");
			container.remove();
		}
	});
	
	discard_button.addEventListener("click",function()
	{
		myDropdown.classList.remove("show");
		import_export.setAttribute("class","button");
		add_annotation_button.setAttribute("class","button");
		add_title_button.setAttribute("class","button");
		canvas.remove();
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

function CreatePolygonDiv(start_time,end_time,edit)
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
	
	var background_color_text = document.createElement("span");
	background_color_text.setAttribute("class","fixed_width_text");
	background_color_text.innerHTML="Background:";
	var background_opacity_text = document.createElement("span");
	background_opacity_text.setAttribute("class","fixed_width_text");
	background_opacity_text.innerHTML="Background Opacity:";
	
	var hex_opacity = RGBAToHex(polygon_paint);
	var background_color_input = document.createElement("input");
	background_color_input.setAttribute("id","background_color");
	background_color_input.setAttribute("type","color");
	background_color_input.value = hex_opacity.hex;
	
	var background_opacity_input = document.createElement("input");
	background_opacity_input.setAttribute("id","background_opacity");
	background_opacity_input.setAttribute("type", "number")
	background_opacity_input.setAttribute("min","0");
	background_opacity_input.setAttribute("max","1");
	background_opacity_input.setAttribute("step","0.05");
	background_opacity_input.value = hex_opacity.opacity;
	
	var d1 = document.createElement("div");
	d1.appendChild(background_color_text);
	d1.appendChild(background_color_input);
	d1.appendChild(background_opacity_text);
	d1.appendChild(background_opacity_input);
	
	var save_button = document.createElement("button");
	save_button.setAttribute("id","save_button");
	save_button.innerHTML="Save";
	var discard_button = document.createElement("button");
	discard_button.setAttribute("class","discard_button");
	discard_button.innerHTML= "Delete";
	var clear_button = document.createElement("button");
	clear_button.setAttribute("class","edit");
	clear_button.innerHTML= "Clear";
	var d2 = document.createElement("div");
	d2.appendChild(save_button);
	d2.appendChild(discard_button);
	d2.appendChild(clear_button);

	container.appendChild(times_div);
	container.appendChild(d1);
	container.appendChild(d2);
	new_item_div.appendChild(container);
	
	var canvas;
	if(edit == false)
	{
		canvas_polygon = new Object();
		canvas_polygon.start_time = start_time;
		canvas_polygon.end_time = end_time;
		canvas_polygon.RGBA_COLOR = new String();
		canvas_polygon.RGBA_COLOR = polygon_paint;
		canvas = CreatePolygon();
	}
	else
	{
		canvas = document.createElement("canvas");
		var ctx = canvas.getContext('2d');
		SetStyle(canvas);
		ResizeCanvas(canvas);
		document.getElementById("media_player").appendChild(canvas);
		DrawPolygon(canvas,canvas_polygon.points,canvas_polygon.RGBA_COLOR);
	}
	
	background_color_input.addEventListener("change",function()
	{
		var opacity = RGBAToHex(canvas_polygon.RGBA_COLOR).opacity;
		canvas_polygon.RGBA_COLOR = HexToRGBA(background_color_input.value,opacity);
		if(canvas_polygon.points.length > 2)
		{
			DrawPolygon(canvas,canvas_polygon.points,canvas_polygon.RGBA_COLOR);
		}
	});
	
	background_opacity_input.addEventListener("change",function()
	{
		var color = RGBAToHex(canvas_polygon.RGBA_COLOR).hex;
		canvas_polygon.RGBA_COLOR = HexToRGBA(color,background_opacity_input.value);
		if(canvas_polygon.points.length > 2)
		{
			DrawPolygon(canvas,canvas_polygon.points,canvas_polygon.RGBA_COLOR);
		}
	});
	
	save_button.addEventListener("click",function()
	{
		if(canvas_polygon.points.length <3 )
		{
			discard_button.click();
		}
		else
		{
			var start = ReadableTimeToSeconds(stime.value);
			var end = ReadableTimeToSeconds(etime.value);
			if(start < end && start >= 0 && end<=video.duration)
			{
				canvas_polygon.start_time = start;
				canvas_polygon.end_time = end;
				var index = InsertIndex(canvas_polygon,canvas_array,0,canvas_array.length - 1);
				annot_ol.insertBefore(CreateAnnotationListRow(index,start,end,"","Polygon"),annot_ol.childNodes[index]);
				UpdateIndexes(annot_ol,0);
				canvas_polygon.type = "polygon";
				canvas_polygon.show = false;
				canvas_polygon.mouseover = false;
				canvas_array.splice(index,0,canvas_polygon);
				polygon_paint = canvas_polygon.RGBA_COLOR;
				canvas_polygon = undefined;
				canvas.remove();
				ReDraw();
				PlayCanvas();
				add_annotation_button.setAttribute("class","button");
				container.remove();
			}
		}
	});
	
	discard_button.addEventListener("click",function()
	{
		myDropdown.classList.remove("show");
		import_export.setAttribute("class","button");
		add_annotation_button.setAttribute("class","button");
		add_title_button.setAttribute("class","button");
		canvas.remove();
		container.remove();
	});
	
	clear_button.addEventListener("click",function()
	{
		canvas.remove();
		canvas = CreatePolygon();
	});
	
	stime_insert_curr_time.addEventListener("click",function()
	{
		stime.value=SecondsIntoReadableTime(video.currentTime);
		etime.value=SecondsIntoReadableTime(video.currentTime+0.2);
	});
	
	etime_insert_curr_time.addEventListener("click",function()
	{
		etime.value=SecondsIntoReadableTime(video.currentTime);
	});	
}

function CreateImgDiv(start_time, end_time,edit)
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
	
	var input_img = document.createElement("input");
	input_img.setAttribute("type","file");
	input_img.setAttribute("id","files");
	
	var d1 = document.createElement("div");
	d1.appendChild(input_img);
	
	var save_button = document.createElement("button");
	save_button.setAttribute("id","save_button");
	save_button.innerHTML="Save";
	var discard_button = document.createElement("button");
	discard_button.setAttribute("class","discard_button");
	discard_button.innerHTML= "Delete";
	var clear_button = document.createElement("button");
	clear_button.setAttribute("class","edit");
	clear_button.innerHTML= "Clear";
	var d2 = document.createElement("div");
	d2.appendChild(save_button);
	d2.appendChild(discard_button);
	d2.appendChild(clear_button);
	
	container.appendChild(times_div);
	container.appendChild(d1);
	container.appendChild(d2);
	new_item_div.appendChild(container);
	
	var img = new Image();
	var canvas;
	if (edit == false)
	{
		canvas_img = new Object();
		canvas_img.position = {"x":0,"y":0};
		canvas_img.width = 100;
	}
	else
	{
		input_img.style.visibility = "hidden";
		canvas = CreateImg(canvas_img.img);
	}

	
	input_img.addEventListener('change', function(evt)
	{
		var file = evt.target.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.addEventListener("load", function () 
		{
			img.src = reader.result;
			canvas_img.position = {"x":0,"y":0};
			canvas_img.width = 100;
			canvas = CreateImg(img);
			container.appendChild(d2);
			input_img.style.visibility = "hidden";
		}, false);	
	});
	
	save_button.addEventListener("click",function()
	{
		
		if(typeof canvas_img === 'undefined' || typeof canvas_img.img === 'undefined' )
		{
			myDropdown.classList.remove("show");
			import_export.setAttribute("class","button");
			add_annotation_button.setAttribute("class","button");
			add_title_button.setAttribute("class","button");
			if(typeof canvas !== 'undefined' && canvas!=null)
			{
				canvas.remove();
			}
			container.remove();
		}
		else
		{
			var start = ReadableTimeToSeconds(stime.value);
			var end = ReadableTimeToSeconds(etime.value);
			if(start < end && start >= 0 && end<=video.duration)
			{
				canvas_img.start_time = start;
				canvas_img.end_time = end;
				var index = InsertIndex(canvas_img,canvas_array,0,canvas_array.length - 1);
				annot_ol.insertBefore(CreateAnnotationListRow(index,start,end,"","Image"),annot_ol.childNodes[index]);
				UpdateIndexes(annot_ol,0);
				canvas_img.type = "img";
				canvas_img.show = false;
				canvas_img.mouseover = false;
				canvas_array.splice(index,0,canvas_img);
				canvas_img = undefined;
				canvas.remove();
				ReDraw();
				PlayCanvas();
				add_annotation_button.setAttribute("class","button");
				container.remove();
			}
		}
	});
	
	discard_button.addEventListener("click",function()
	{
		myDropdown.classList.remove("show");
		import_export.setAttribute("class","button");
		add_annotation_button.setAttribute("class","button");
		add_title_button.setAttribute("class","button");
		if(typeof canvas !== 'undefined' && canvas!==null)
		{
			canvas.remove();
		}
		container.remove();
	});
	
	clear_button.addEventListener("click",function()
	{
		canvas.remove();
		canvas_img = new Object();
		input_img.value="";
		input_img.style.visibility = "visible";
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

function CreateAnnotationListRow(index,start_time,end_time,text,type)
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
	edit_button.setAttribute("class","edit");
	edit_button.innerHTML="Edit";
	tools.appendChild(edit_button);
	tools.appendChild(delete_button);
	
	var type_span = document.createElement("span");
	type_span.innerHTML = CapitalizeFirstLetter(type);
	
	d.appendChild(index_container);
	d.appendChild(times_container);
	container.appendChild(d);
	container.appendChild(type_span);
	var show = false;
	if(text != "")
	{
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
		container.appendChild(text_div);
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
	}
	else
	{
		container.addEventListener("click", function(e)
		{
			if(show == false)
			{
				container.classList.remove("fixed_height");
				container.appendChild(tools);
				show = true;
			}
			else
			{
				container.classList.add("fixed_height");
				tools.remove();
				show = false;
			}
		});
	}

	delete_button.addEventListener("click",function()
	{
		canvas_array.splice(container.getElementsByClassName("index_container")[0].innerHTML-1,1);
		ReDraw();
		container.remove();
		UpdateIndexes(annot_ol,0);
	});
	
	edit_button.addEventListener("click",function()
	{
		if(new_item_div.innerHTML=="")
		{
			var index = container.getElementsByClassName("index_container")[0].innerHTML-1;
			if(canvas_array[index].type == "note" || canvas_array[index].type == "label")
			{
				canvas_note = new Object();
				canvas_note = canvas_array[index];
				paint = canvas_array[index].paint;
				CreateNoteOrLabelDiv(canvas_array[index].start_time,canvas_array[index].end_time,canvas_array[index].type,true);
				new_item_div.getElementsByTagName("textarea")[0].value = canvas_array[index].text;
					
			}
			else if(canvas_array[index].type == "title")
			{
				title_note = canvas_array[index];
				title_paint = canvas_array[index].paint;
				CreateTitleDiv(canvas_array[index].start_time,canvas_array[index].end_time,true);
				new_item_div.getElementsByTagName("textarea")[0].value = canvas_array[index].text;
			}
			else if(canvas_array[index].type == "polygon")
			{
				canvas_polygon = new Object();
				canvas_polygon = canvas_array[index];
				polygon_paint = canvas_array[index].RGBA_COLOR;
				CreatePolygonDiv(canvas_array[index].start_time,canvas_array[index].end_time,true);
			}
			else if(canvas_array[index].type == "img")
			{
				canvas_img = canvas_array[index];
				CreateImgDiv(canvas_array[index].start_time, canvas_array[index].end_time,true);
			}
			canvas_array.splice(index,1);
			ReDraw();
			container.remove();
			UpdateIndexes(annot_ol,0);
		}
		else
		{
			new_item_div.classList.add("highlighted");
			setTimeout(function() { new_item_div.classList.remove("highlighted"); }, 400);
		}
		
	});
	
	return container;
}

function DrawNote(canvas_obj,canvas_note_obj,show_text)
{
	var w = canvas_note_obj.rect[2].x - canvas_note_obj.rect[0].x;
	var h = canvas_note_obj.rect[2].y - canvas_note_obj.rect[0].y;
	if(show_text ==true)
	{
		var tmp_paint = cloneObject(canvas_note_obj.paint);
		tmp_paint.FONT_SIZE = Math.floor(tmp_paint.FONT_SIZE*scale_factor);
		DrawTextBox(canvas_obj,canvas_note_obj.rect[0].x*scale_factor,canvas_note_obj.rect[0].y*scale_factor,w*scale_factor,h*scale_factor,canvas_note_obj.text,tmp_paint);
	}
	else
	{
		DrawTextBox(canvas_obj,canvas_note_obj.rect[0].x*scale_factor,canvas_note_obj.rect[0].y*scale_factor,w*scale_factor,h*scale_factor,"",canvas_note_obj.paint);
	}
}

function ReDraw()
{
	var c = document.querySelectorAll(".play_canvas");
	for(var i=0; i<c.length;i++)
	{
		c[i].remove();
	}
	for(var j = 0; j < canvas_array.length; j++)
	{
		if(typeof canvas_array[j].canvas!== 'undefined')
		{
			canvas_array[j].canvas = undefined;
		}
		canvas_array[j].show =false;
	}
	PlayCanvas();
}

function PlayCanvas()
{
	var time_now = video.currentTime;
	for(var i = 0; i < canvas_array.length; i++)
	{
		if(canvas_array[i].type == "label" && (canvas_array[i].start_time <= time_now && canvas_array[i].end_time >= time_now))
		{
			if(canvas_array[i].canvas==undefined || canvas_array[i].canvas==null)
			{
				var c = document.createElement("canvas");
				c.setAttribute("class","play_canvas");
				var ctx = c.getContext('2d');
				SetStyle(c);
				ResizeCanvas(c);
				document.getElementById("media_player").insertBefore(c,document.getElementById("media_player").lastChild);
				canvas_array[i].canvas = c;
			}
			if(canvas_array[i].mouseover == true)
			{
				var ctx = canvas_array[i].canvas.getContext('2d');
				ctx.clearRect(0,0,canvas_array[i].canvas.width,canvas_array[i].canvas.height);
				DrawNote(canvas_array[i].canvas,canvas_array[i],true)
				canvas_array[i].show = true;
			}
			else
			{
				var ctx = canvas_array[i].canvas.getContext('2d');
				ctx.clearRect(0,0,canvas_array[i].canvas.width,canvas_array[i].canvas.height);
				DrawNote(canvas_array[i].canvas,canvas_array[i],false)
				canvas_array[i].show = true;
			}
		}
		else
		{
			if((canvas_array[i].start_time > time_now || canvas_array[i].end_time < time_now) && canvas_array[i].show==true)
			{
				canvas_array[i].canvas.remove();
				canvas_array[i].canvas = undefined;
				canvas_array[i].show = false;
			}
			if((canvas_array[i].start_time <= time_now && canvas_array[i].end_time >= time_now) && canvas_array[i].show==false)
			{
				var c = document.createElement("canvas");
				var ctx = c.getContext('2d');
				c.setAttribute("class","play_canvas");
				SetStyle(c);
				ResizeCanvas(c);
				if(canvas_array[i].type == "note")
				{
					DrawNote(c,canvas_array[i],true)
				}
				else if(canvas_array[i].type == "title")
				{
					DrawTitle(c,canvas_array[i].text,canvas_array[i].paint);
				}
				else if(canvas_array[i].type == "polygon")
				{
					DrawPolygon(c,canvas_array[i].points,canvas_array[i].RGBA_COLOR);
				}
				else if(canvas_array[i].type == "img")
				{
					DrawImage(c,canvas_array[i]);
				}
				document.getElementById("media_player").insertBefore(c,document.getElementById("media_player").lastChild);
				canvas_array[i].canvas = c;
				canvas_array[i].show = true;
			}
		}
	}
}

function CanvasArrayToString()
{
	var result = new String();
	for(var i=0;i<canvas_array.length;i++)
	{
		var item = new String();
		item += canvas_array[i].start_time +"@" + canvas_array[i].end_time + "@" + canvas_array[i].type + "@";
		if(canvas_array[i].type == "note" || canvas_array[i].type == "label")
		{
			item += canvas_array[i].paint.FONT + "@" + canvas_array[i].paint.FONT_COLOR + "@" + canvas_array[i].paint.FONT_SIZE + "@";
			item += canvas_array[i].paint.RECTANGLE_BACKGROUND_COLOR + "@" + canvas_array[i].paint.RECTANGLE_LINE_COLOR + "@" + canvas_array[i].paint.RECTANGLE_LINE_WIDTH + "@";
			item += canvas_array[i].rect[0].x + "@" + canvas_array[i].rect[0].y + "@";
			item += canvas_array[i].rect[1].x + "@" + canvas_array[i].rect[1].y + "@";
			item += canvas_array[i].rect[2].x + "@" + canvas_array[i].rect[2].y + "@";
			item += canvas_array[i].rect[3].x + "@" + canvas_array[i].rect[3].y + "@";
			item += encodeURIComponent(canvas_array[i].text) +"\n";
		}
		else if(canvas_array[i].type == "title")
		{
			item += canvas_array[i].paint.FONT + "@" + canvas_array[i].paint.FONT_COLOR + "@" + canvas_array[i].paint.FONT_SIZE + "@";
			item += encodeURIComponent(canvas_array[i].text) +"\n";
		}
		else if(canvas_array[i].type == "polygon")
		{
			item += canvas_array[i].points.length + "@";
			for(var j=0; j<canvas_array[i].points.length;j++)
			{
				item += canvas_array[i].points[j].x + "@" + canvas_array[i].points[j].y + "@";
			}
			item += canvas_array[i].RGBA_COLOR + "\n";
		}
		else if(canvas_array[i].type == "img")
		{
			item += canvas_array[i].width.toFixed(2) + "@" + canvas_array[i].position.x + "@" + canvas_array[i].position.y + "@";
			item += canvas_array[i].img.src + "\n";
		}
		result += item;
	}
	return result;
}

function StringToCanvasArray(str)
{
	var lines_arr = str.split("\n");
	var result = new Array();
	for(var i=0; i< lines_arr.length; i++)
	{
		var line = lines_arr[i].split("@");
		if(line.length > 3)
		{
			var canvas_arr_item = new Object();
			canvas_arr_item.start_time = parseFloat(line[0],10);
			canvas_arr_item.end_time = parseFloat(line[1],10);
			canvas_arr_item.type = line[2];
			if(line[2] == "note" || line[2] == "label")
			{
				var canvas_arr_item_paint = new Object();
				canvas_arr_item_paint.FONT = line[3];
				canvas_arr_item_paint.FONT_COLOR = line[4];
				canvas_arr_item_paint.FONT_SIZE = parseInt(line[5],10);
				canvas_arr_item_paint.RECTANGLE_BACKGROUND_COLOR = line[6];
				canvas_arr_item_paint.RECTANGLE_LINE_COLOR = line[7];
				canvas_arr_item_paint.RECTANGLE_LINE_WIDTH = parseInt(line[8],10);
				canvas_arr_item.paint = canvas_arr_item_paint;
				
				canvas_arr_item.rect = new Array();
				canvas_arr_item.rect.push({"x":parseInt(line[9],10), "y":parseInt(line[10],10)});
				canvas_arr_item.rect.push({"x":parseInt(line[11],10), "y":parseInt(line[12],10)});
				canvas_arr_item.rect.push({"x":parseInt(line[13],10), "y":parseInt(line[14],10)});
				canvas_arr_item.rect.push({"x":parseInt(line[15],10), "y":parseInt(line[16],10)});
				canvas_arr_item.text = decodeURIComponent(line[17]);
			}
			else if(line[2] == "title")
			{
				var canvas_arr_item_paint = new Object();
				canvas_arr_item_paint.FONT = line[3];
				canvas_arr_item_paint.FONT_COLOR = line[4];
				canvas_arr_item_paint.FONT_SIZE = parseInt(line[5],10);
				canvas_arr_item.paint = canvas_arr_item_paint;
				canvas_arr_item.text = decodeURIComponent(line[6]);
			}
			else if(line[2] == "polygon")
			{
				var n = parseInt(line[3]);
				canvas_arr_item.points = new Array();
				for(var j=0; j < n; j++)
				{
					canvas_arr_item.points.push({"x":parseInt(line[4+2*j],10) , "y": parseInt(line[5+2*j],10)});
				}
				canvas_arr_item.RGBA_COLOR = line[4+n*2];
			}
			else if(line[2] == "img")
			{
				canvas_arr_item.position = new Object();
				canvas_arr_item.width = parseFloat(line[3],10);
				canvas_arr_item.position.x = parseInt(line[4],10);
				canvas_arr_item.position.y = parseInt(line[5],10);
				var temp_img = new Image();
				temp_img.src = line[6];
				canvas_arr_item.img = temp_img;
			}
			result.push(canvas_arr_item);
		}
	}
	return result;
}

function LoadAnnotationsFromString(str)
{
	canvas_array = StringToCanvasArray(str);
	annot_ol.innerHTML = "";
	for(var i=0;i<canvas_array.length;i++)
	{
		if(canvas_array[i].type == "polygon" || canvas_array[i].type == "img")
		{
			annot_ol.appendChild(CreateAnnotationListRow(i,canvas_array[i].start_time,canvas_array[i].end_time,"",canvas_array[i].type));
		}
		else
		{
			annot_ol.appendChild(CreateAnnotationListRow(i,canvas_array[i].start_time,canvas_array[i].end_time,canvas_array[i].text,canvas_array[i].type));
		}
	}
	ReDraw();
}
