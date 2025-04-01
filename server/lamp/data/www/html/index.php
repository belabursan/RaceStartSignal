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
    <title>Login Page</title>
    <link rel="stylesheet" type='text/css' href="src/css/index.css">
    <script src="src/scripts/site.js"></script>
</head>

<body onload="fadeOut('error-monitor');">
    <div class="headerx">
        <h1>Lagunens Race Signal Page</h1>
        <span class="register_text" >Dont't have an account? <a href="register.php">Register</a></span>
    </div>
    <div class="login_container">
        <form action="src/utils/login.php" method="POST">
            <input type="text" pattern="[a-zA-Z0-9@.]+" name="email" placeholder="Email Address" required autofocus /><br />
            <input type="password" name="password" placeholder="Password" required /><br />
            <button type="submit" name="login">Login</button>
        </form>
    </div>
    
    <?php
        if (isset($_SESSION["login_error"])) {
            printError($_SESSION["login_error"]);
            unset($_SESSION["login_error"]);
        }
        printFooter();
    ?>
</body>
</html>
