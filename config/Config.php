<?php
	class Config
	{
		private $config;
		
		public function __construct()
		{
			$this->config=parse_ini_file("./config/config.ini", true);
		}
		function GetConfig($section)
		{
			return $this->config[$section];
		}
	}
