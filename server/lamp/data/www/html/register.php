<?php
include_once "src/utils/site.php";

function handle_register() {
    if (isset($_POST['register']) && !empty($_POST['reg_email'])) {
        unset($_POST['register']);
        if (!filter_var($_POST['reg_email'], FILTER_VALIDATE_EMAIL)) {
            echo "<script>alert('Invalid email format!');</script>";
        } else {
            $host = $_SERVER['HTTP_HOST'];
            $page = site_register($_POST['reg_email']);
            exit(header("Location: http://$host/$page", true));
        }
    }
}
handle_register();

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register Page</title>
    <link rel="stylesheet" type='text/css' href="src/css/register.css">
</head>

<body>
    <div class="center">
        <div class="register_container">
            <h2>Register as user</h2>
            <form action="" method="POST">
                <input type="text" pattern="[a-zA-Z0-9@.]+" name="reg_email" placeholder="Email Address" required autofocus /><br />
                <button type="submit" name="register">Register</button>
            </form>
        </div>
    </div>
</body>

</html>
