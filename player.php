<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Online Video Annotation</title>
	<link href="style/main.css" rel="stylesheet">
	
</head>
<body>
    <div id="main_content">
		<div id="left_side">
			<div id="media_player_container">
				<div id="media_player">
					<video id="video" width=640 height=360 >
					  <source src=<?php echo '"'.$_POST["video_url"].'"';?> type="video/mp4">
					  <track id="tracks" kind="subtitles" label="English" srclang="en" default>
					  Your browser does not support the video tag.
					</video>
				</div>
				<div id="controls_div">
					<input type="range" id="seek_bar" value="0">
					<div id="control_buttons">
						<button class="ctrl_button" type="button" id="play-pause" class="play"></button>
						<button class="ctrl_button" type="button" id="replay" class="play" title="replay"></button>
						<button class="ctrl_button" type="button" id="fb" class="play" title="skip one frame backward"></button>
						<button class="ctrl_button" type="button" id="ff" class="play" title="skip one frame forward"></button>
						<input type="text" id="current_time">
						<input type="text" id="video_len" readonly disabled>
						<button class="ctrl_button" type="button" id="mute" title="Mute/Unmute"></button>
						<span id="off"></span>
						<input type="range" id="volume_bar" min="0" max="1" step="0.1" value="1" title="volume">
						<span id="on"></span>
						<button class="ctrl_button" type="button" id="fullscreen" title="Fullscreen"></button>
					</div>
				</div>
			</div>
			<div id="create_item_menu">
				<div>
					<div class="button" id="add_title_button">Add Title</div>
					<div class="button" id="add_annotation_button">Add Annotation
						<div id="myDropdown" class="dropdown-content">
							<a id="new_note_button">Note</a>
							<a id="new_label_button">Label</a>
							<a id="new_title_button">Title</a>
							<a id="new_polygon_button">Polygon</a>
							<a id="new_img_button">Image</a>
						</div>
					</div>
					<div class="button" id="import_export">Import/Export</div>
				</div>
				<div id="new_item"></div>
			</div>
		</div>
		<div id="right_side">
			<div id="titles_container">
				<ol id="titles_ol"></ol>
			</div>
			<div id="annot_container">
				<ol id="annot_ol"></ol>
			</div>
		</div>
	</div>
	<script>
		var annot_str = new String();
		var subt_str = new String();
		<?php
			if(isset($_POST) && isset($_POST["annot_path"]) && $_POST["annot_path"]!="")
			{
				$lines = file($_POST["annot_path"]);	
				foreach ($lines as $line) 
				{
					echo "annot_str +=".'"'. rtrim($line).'\n";';
				} 
			}
			if(isset($_POST) && isset($_POST["subt_path"])&& $_POST["subt_path"]!="")
			{
				$lines = file($_POST["subt_path"]);
				foreach ($lines as $line) 
				{
					echo "subt_str +=".'"'. rtrim($line).'\n";';
				} 
			}
		?>	
	</script>
	<script src="main.js"></script>
	<script src="player_controls.js"></script>
	<script src="utilities.js"></script>
	<script src="canvas.js"></script>
	<script src="titles.js"></script>
</body>
</html>