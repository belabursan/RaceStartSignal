<?php
include_once "src/utils/site.php";
s_start();
logout();
$host = $_SERVER['HTTP_HOST'];
s_stop();
exit(header("Location: https://$host/index.php", true));
?>
