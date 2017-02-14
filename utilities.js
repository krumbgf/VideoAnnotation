function RGBAToHex(rgb)
{
	rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(0.\d+|[0 1]|1.0)/i);
	return (rgb && rgb.length === 5) ? {"hex":"#" +
	("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
	("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
	("0" + parseInt(rgb[3],10).toString(16)).slice(-2) ,
	"opacity": parseFloat(rgb[4],10)} : '';
}

function HexToRGBA(hex,opacity)
{
	return "rgba(" + hex.match(/[A-Za-z0-9]{2}/g).map(function(v) { return parseInt(v, 16) }).join(",") + "," + opacity + ")";
}

function OverlapCheck(array,index,start_time,end_time)
{
	if(index-1 >= 0)
	{
		if(array[index-1].end_time > start_time) { return true; }
	}
	if(index < array.length)
	{
		if(end_time > array[index].start_time) { return true; }
	}
	return false;
}

function InsertIndex(value, array, start, end)
{
	if(array.length==0) { return 0; } 
	var m = start + Math.floor((end - start)/2);

	if(value.start_time > array[end].start_time)
	{
		return end+1;
	}

	if(value.start_time < array[start].start_time)
	{
		return start;
	}
	
		if(start >= end)
	{
		return start;
	}

	if(value.start_time < array[m].start_time)
	{
		return InsertIndex(value, array, start, m - 1);
	}
	else
	{
		return InsertIndex(value, array, m+1 , end);	
	}
}

function SecondsIntoReadableTime(seconds)
{

	var hours = seconds / (3600);
	var absoluteHours = Math.floor(hours);
	var h="";
	if (absoluteHours!=0)
	{
		h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;
		h+=":";
	}
	
	var minutes = (hours - absoluteHours) * 60;
	var absoluteMinutes = Math.floor(minutes);
	var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

	var absoluteSeconds = (minutes - absoluteMinutes) * 60;
	absoluteSeconds= absoluteSeconds.toFixed(3);
	var s = absoluteSeconds >= 10 ? absoluteSeconds : '0' + absoluteSeconds;
	return h + m + ':' + s;
}

function SecondsToVTTFormat(seconds)
{

	var hours = seconds / (3600);
	var absoluteHours = Math.floor(hours);
	var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;
	
	var minutes = (hours - absoluteHours) * 60;
	var absoluteMinutes = Math.floor(minutes);
	var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

	var absoluteSeconds = (minutes - absoluteMinutes) * 60;
	absoluteSeconds= absoluteSeconds.toFixed(3);
	var s = absoluteSeconds >= 10 ? absoluteSeconds : '0' + absoluteSeconds;
	return h +':' + m + ':' + s;
}

function SecondsToSRTFormat(seconds)
{
	var hours = seconds / (3600);
	var absoluteHours = Math.floor(hours);
	var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;
	
	var minutes = (hours - absoluteHours) * 60;
	var absoluteMinutes = Math.floor(minutes);
	var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

	var absoluteSeconds = (minutes - absoluteMinutes) * 60;
	absoluteSeconds= absoluteSeconds.toFixed(3);
	var s = absoluteSeconds >= 10 ? absoluteSeconds.toString().replace(".",",") : '0' + absoluteSeconds.toString().replace(".",",");
	return h +':' + m + ':' + s;
}


function ReadableTimeToSeconds(time_string)
{
	var nums = time_string.split(":");
	var result = 0;
	if(nums.length==3)
	{
		result += parseInt(nums[0],10)*3600;
		result += parseInt(nums[1],10)*60;
		result += parseFloat(nums[2],10);
	}
	else if(nums.length==2)
	{
		result += parseInt(nums[0],10)*60;
		result += parseFloat(nums[1],10);
	}
	else { return -1; }
	
	return result;
}

function SRTTimeToSeconds(time_string)
{
	var nums = time_string.split(":");

	var result = 0;
	result += parseInt(nums[0],10)*3600;
	result += parseInt(nums[1],10)*60;
	var split_sec = nums[2].split(",");
	
	result += parseInt(split_sec[0],10);
	result += parseInt(split_sec[1],10)/1000;
	return result;
}

function UpdateIndexes(list, start_index)
{
	var index_containers = list.getElementsByClassName("index_container");
	var i = 0;
	for(i=start_index;i<index_containers.length;i++)
	{
		index_containers[i].firstChild.data = i + 1;
	}
}

function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
 
    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }
 
    return temp;
}

function CapitalizeFirstLetter(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
