<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Online Video Annotation</title>
	<link href="style/index.css" rel="stylesheet">
	
</head>
<body>
    <div>
		<?php 
		if(isset($_GET) && isset($_GET["video_url"])) 
		{ 
			echo '<div id="media_player"><video id="video" controls><source src="';
			echo $_GET["video_url"];
			echo '" type="video/mp4">Your browser does not support the video tag.</video></div>';	
		}
		?>
		<div id="main_content">
			<?php
				if(isset($_GET) && isset($_GET["video_url"]))
				{
					$subtinDB = false;
					$annotinDB = false;
					$videoUrl = $_GET["video_url"];
					echo '<form id="form1" method="POST" action="./player.php"><input class="readonly" type="text" name="video_url" value="'.$videoUrl.'" readonly><input type="submit" value="Go">';
					require_once("./config/Config.php");
					$configObj = new Config();
					$config = $configObj->GetConfig('sql');
					$host = $config["host"];
					$user = $config["user"];
					$pass = $config["pass"];
					$database = $config["database"];
					$tablename = $config["table"];
					$dbh = new PDO("mysql:host=$host;dbname=$database",$user,$pass);
					$dbh->query("SET NAMES utf8");
					$sth = $dbh->prepare("SELECT videoURL,size,author,created_at,filename from $tablename where videoURL='$videoUrl' AND type='annot'");
					$sth->execute();
					$result = $sth->fetchAll(PDO::FETCH_ASSOC);
					if($result==true)
					{	
						$subtinDB=true;
						echo "<div>Import annotations from database:</div>";
						echo '<input type="radio" name="annot_path" value="" checked>Do not import<br>';
						foreach($result as $row)
						{
							echo '<div><input type="radio" name="annot_path" value="'.$row['filename'].'">Author: '.$row['author'].' Size: '.$row['size'].' Created: '.$row['created_at']."</div>";
						}
					}
					$sth = null;
					$sth = $dbh->prepare("SELECT videoURL,size,author,created_at,filename from $tablename where videoURL='$videoUrl' AND type='subt'");
					$sth->execute();
					$result = $sth->fetchAll(PDO::FETCH_ASSOC);
	
					if($result==true)
					{
						$annotinDB=true;
						echo "<div>Import subtitles from database:</div>";
						echo '<input type="radio" name="subt_path" value="" checked>Do not import<br>';
						foreach($result as $row)
						{
							echo '<div><input type="radio" name="subt_path" value="'.$row['filename'].'">Author: '.$row['author'].' Size: '.$row['size'].' Created: '.$row['created_at']."</div>";
						}
					}
					echo '</form>';
					if($annotinDB == false && $subtinDB == false)
					{
						echo '<script src="index.js"></script>';
					}
				}
				else
				{
					echo '<form id="form0" method="GET" action="#"><input type="text" name="video_url" required="true" placeholder="Insert the URL of your video"><input type="submit" value="Go"></form>';
				}
			?>		
		</div>	
	</div>
</body>
</html>