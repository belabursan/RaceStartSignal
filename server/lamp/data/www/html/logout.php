<?php
session_start();
unset($_SESSION["isloggedintosignal"]);
unset($_SESSION["signal_auth_token"]);
$host = $_SERVER['HTTP_HOST'];
exit(header("Location: https://$host/index.php", true));
?>
