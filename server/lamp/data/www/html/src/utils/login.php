<?php
include_once "site.php";
?>
<!DOCTYPE html>

<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Page</title>
    </head>
    <body>
        <?php

/**
 * @brief Handles the login procedure for a user
 * Redirected from index.php
 */
function handleLogin(): never
{
    try {
        s_start();
        log_i("Somebody tries to log in...");
        $host = $_SERVER['HTTP_HOST'];
        $page = "index.php";
    
        if (isset($_POST['login']) && !empty($_POST['email']) && !empty($_POST['password'])) {
            try {
                site_login($_POST['email'], $_POST['password']);
                $page = "signal.php";
            } catch (Exception $e) {
                log_e("Error during login: ".$e->getMessage()." code: ".$e->getCode());
                $_SESSION['login_error'] = $e->getMessage();
            }                
        }
        exit(header("Location: https://$host/$page", true));
    } finally {
        unset($_POST['login']);
        unset($_POST['password']);
        unset($_POST['email']);
        s_stop();
    }
}

handleLogin();
        ?>
    </body>
</html>