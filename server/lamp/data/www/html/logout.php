<?php
if(!isset($_SESSION)) 
    { 
        session_start(); 
    } 
include_once "src/utils/site.php";
logout();
$host = $_SERVER['HTTP_HOST'];
exit(header("Location: https://$host/index.php", true));
?>
