<?php


/**
 * Starts the session if not already started
 */
function s_start() {
    $s = session_status();
    if ($s !== PHP_SESSION_ACTIVE) {
        @session_start();
    }
}


/**
 * Stops the session if it was started
 */
function s_stop() {
    if (session_status() === PHP_SESSION_ACTIVE) {
        @session_write_close ();
    }
}


/**
 * @brief Cleans (unsets) all session parameters used by the page
 */
function cleanSession() {
    s_start();
    unset($_POST['password']);
    unset($_POST['email']);
    unset($_SESSION);
    s_stop();
    session_destroy();
}

/**
 * Logs in a user
 * @param string email the user identifier
 * @param string password Clean password of the user
 * @return string ret page to redirect to
 */
function site_login($email, $password) {
    //check db_login($email, $password);
    //echo "Logging in...";
    // error page
    $_SESSION['login_error'] = "Wrong email or bad password!";
    return 'index.php';
}

function site_register($email){
    $_SESSION['login_error'] = "Failed to register,try agai later!";
    return 'index.php';
}

?>
