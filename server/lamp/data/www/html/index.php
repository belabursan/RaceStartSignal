<?php
include_once "src/helper/site.php";

    /**
     * @brief Handles the login procedure for a user
     * Called on the login.php
     */
    function handleLogin() {
        $ret = false;

        if (isset($_POST['login']) && !empty($_POST['email']) && !empty($_POST['password'])) {
            if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
                echo "<script>alert('Invalid email format!');</script>";
            } else {
                $ret = site_login($_POST['email'], $_POST['password']);
            }
        }
        if($ret) {
            redirectPage("src/home.php");
        } else {
            cleanSession();
        }

    }
    resetInfo();
    handleLogin();

/*
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $password = $_POST["password"];
    
    // Here you would typically check the credentials against a database
    if ($email == "admin" && $password == "password") {
        echo "<script>alert('Login successful!');</script>";
    } else {
        echo "<script>alert('Invalid email or password');</script>";
    }
}
    */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <?php addCssLink("css/index.css", true);?>
</head>
<body>
    <div class="container">
        <h2>Login</h2>
        <form action="" method="POST">
            <input type="text" pattern="[a-zA-Z0-9@.]+" name="email" placeholder="Email Address" required autofocus /><br/>
            <input type="password" name="password" placeholder="Password" required /><br/>
            <button type="submit" name="login">Login</button>
        </form>
        <a href="register.html">Don't have an account? Register</a>
    </div>
</body>
</html>
