<pre>
<?php
	require_once("./config/Config.php");
	$configObj = new Config();
	$config = $configObj->GetConfig('files');
	$sql_config = $configObj->GetConfig('sql');
	$host = $sql_config["host"];
	$user = $sql_config["user"];
	$pass = $sql_config["pass"];
	$database = $sql_config["database"];
	$tablename = $sql_config["table"];
	
	if(isset($_POST["subt"]))
	{
		$filename = "./".$config["subt_dir"].hash("sha256",$_POST["subt"]);
		if(file_exists($filename)==true && strcmp(file_get_contents($filename),$_POST["subt"])==0)
		{ }
		else
		{
			while(file_exists($filename)==true)
			{
				$filename= $filename.uniqid();
			}
			file_put_contents($filename,$_POST["subt"]);
			$dbh = new PDO("mysql:host=$host;dbname=$database",$user,$pass);
			$dbh->query("SET NAMES utf8");
			$video_src = $_POST["video_src"];
			$subt_size = $_POST["subt_size"];
			$author = $_POST["author"];
			$dbh->exec("INSERT INTO $tablename (videoURL,type,author,size,filename) VALUES ('$video_src','subt','$author','$subt_size','$filename')" );
			$dbh = null;
		}
		$filename = null;
	}
	if(isset($_POST["annot"]))
	{
		$filename = "./".$config["annot_dir"].hash("sha256",$_POST["annot"]);
		if(file_exists($filename)==true && strcmp(file_get_contents($filename),$_POST["annot"])==0)
		{ }
		else
		{
			while(file_exists($filename)==true)
			{
				$filename= $filename.uniqid();
			}
			file_put_contents($filename,$_POST["annot"]);
			$dbh = new PDO("mysql:host=$host;dbname=$database",$user,$pass);
			$dbh->query("SET NAMES utf8");
			$video_src = $_POST["video_src"];
			$annot_size = $_POST["annot_size"];
			$author = $_POST["author"];
			$dbh->exec("INSERT INTO $tablename (videoURL,type,author,size,filename) VALUES ('$video_src','annot','$author','$annot_size','$filename')" );
			$dbh = null;
		}
	}
	header("Location: http://".$config["project_url"].$config["project_root"]."index.php");
	exit();
?>
</pre>
