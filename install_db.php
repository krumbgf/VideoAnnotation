<html>
<head>
<title>Creating MySQL Tables</title>
</head>
<body>
<?php
	require_once("./config/Config.php");
	$configObj = new Config();
	$config = $configObj->GetConfig('sql');
	print_r($config);
	$dbhost = $config["host"];
	$dbuser = $config["user"];
	$dbpass = $config["pass"];
	$dbname = $config["database"];
	$tablename = $config["table"];
	$root = $config["root"];
	$root_password = $config["root_pass"];
	
	$dbh = new PDO("mysql:host=$dbhost", $root, $root_password);
	$dbh->exec("CREATE DATABASE $dbname COLLATE utf8_unicode_ci;
                CREATE USER '$dbuser'@'localhost' IDENTIFIED BY '$dbpass';
                GRANT ALL ON $dbname.* TO '$dbuser'@'localhost';
                FLUSH PRIVILEGES;");
 
	
	$db = new PDO("mysql:dbname=$dbname;host=$dbhost", $dbuser, $dbpass );
    $db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
    $sql ="CREATE TABLE $tablename(
	ID INT( 11 ) AUTO_INCREMENT PRIMARY KEY,
	videoURL VARCHAR( 1000 ) NOT NULL, 
	type VARCHAR( 6 ) NOT NULL,
	author VARCHAR ( 100) NOT NULL,
	size INT(11) NOT NULL,
	filename VARCHAR( 150 ) NOT NULL, 
	created_at datetime DEFAULT CURRENT_TIMESTAMP NULL);" ;
	$db->exec($sql);
?>
</body>
</html>