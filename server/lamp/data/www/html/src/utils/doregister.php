<?php
include_once "site.php";

function handle_register() {
    try {
        s_start();
        if (isset($_SESSION["register_error"])) {
            unset($_SESSION["register_error"]);
        }
        $page = "register.php";
        $host = $_SERVER['HTTP_HOST'];
        if (isset($_POST['register']) && !empty($_POST['reg_email'])) {
            $epost = $_POST['reg_email'];
            log_i("Somebody tries to register ($epost)...");
            
            try {
                site_register($epost);
                $page = "index.php";
            } catch (Exception $e) {
                log_e("Error during register: ".$e->getMessage()." code: ".$e->getCode());
                $_SESSION['register_error'] = $e->getMessage();
            }
        }
        exit(header("Location: https://$host/$page", true));
    } finally {
        unset($_POST['register']);
        unset($_POST['reg_email']);
        s_stop();
    }
}
handle_register();

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Register Page</title>
    </head>
    <body>
        <h3>This should not be visible, something is very wrong :-)</h3>
    </body>
</html>
