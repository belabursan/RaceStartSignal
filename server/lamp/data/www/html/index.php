<?php
include_once "src/utils/site.php";

/**
 * @brief Handles the login procedure for a user
 * Called on the login.php
 */
function handleLogin()
{
    s_start();

    if ( isset($_SESSION['login_error'])) {
        echo "<script>alert('". $_SESSION['login_error'] . "');</script>";
        unset($_SESSION['login_error']);
    } else {
        if (isset($_POST['login']) && !empty($_POST['email']) && !empty($_POST['password'])) {
            unset($_POST['login']);
            if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
                echo "<script>alert('Invalid email format!');</script>";
            } else {
                $host = $_SERVER['HTTP_HOST'];
                $page = site_login($_POST['email'], $_POST['password']);
                if ( isset($_SESSION['login_error'])) {
                    echo "<script>alert('". $_SESSION['login_error'] . "');</script>";
                    unset($_SESSION['login_error']);
                } else {
                    $_SESSION['login'] = true;
                    exit(header("Location: https://$host/$page", true));
                }
            }
        }
    }
    s_stop();
}

handleLogin();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <link rel="stylesheet" type='text/css' href="src/css/index.css">
</head>

<body>
    <div class="center">
        <div class="signal_text">Lagunens Race Signal Page</div>
        <br><br>
        <div class="login_container">
            <h2>Login</h2>
            <form action="" method="POST">
                <input type="text" pattern="[a-zA-Z0-9@.]+" name="email" placeholder="Email Address" required autofocus /><br />
                <input type="password" name="password" placeholder="Password" required /><br />
                <button type="submit" name="login">Login</button>
            </form>
            <a href="register.php"><span class="register_text" >Dont't have an account? Register</span></a>
        </div>
    </div>
</body>

</html>
