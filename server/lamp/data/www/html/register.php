<?php
include_once "src/utils/site.php";

if(isLoggedIn() === true && isset($_SERVER['HTTP_HOST'])) {
    $host = $_SERVER['HTTP_HOST'];
    exit(header("Location: https://$host/signal.php", true));
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow" />
    <title>Register Page</title>
    <link rel="stylesheet" type='text/css' href="src/css/register.css">
    <script src="src/scripts/site.js"></script>
</head>

<body onload="fadeOut('error-monitor');">
    <div class="center">
        <div class="register_container">
            <h2>Register as user</h2>
            <form action="src/utils/doregister.php" method="POST">
                <input type="text" pattern="[a-zA-Z0-9@.]+" name="reg_email" placeholder="Email Address" required autofocus /><br />
                <button type="submit" name="register">Register</button>
            </form>
        </div>
    </div>
    <?php 
    if (isset($_SESSION["register_error"])) {
        printError($_SESSION["register_error"]);
        unset($_SESSION["login_error"]);
    }
    printFooter(); ?>
</body>
</html>
