<?php

function addCssLink($link, $extern=false) {
    if ($extern){
        echo "        <link rel=\"stylesheet\" type='text/css' href=\"".$link."\">\n";
    } else {
        echo "        <link rel=\"stylesheet\" type='text/css' href=\"css/".$link.".css\">\n";
    }
}

/**
 * Redirects a page
 * @param mixed page Page to redirect 
 * @param mixed current Set to true to redirect to current page or false to find the page in root dir
 * @return never
 */
function redirectPage($page, $current=false) {
    $host = $_SERVER['HTTP_HOST'];
    $uri = "";
    if($current) {
        $uri = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
    }
    header("Location: https://$host$uri/$page");
    exit;
}

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
 * Resets the info array to inactive
 */
function resetInfo() {
    s_start();
    $_SESSION['info']['message'] = "";
    $_SESSION['info']['type'] = false;
    $_SESSION['info']['id'] = -1;
    s_stop();
}


/**
 * @brief Cleans (unsets) all session parameters used by the page
 */
function cleanSession() {
    s_start();
    unset($_SESSION["loggedin"]);
    unset($_SESSION['user']);
    unset($_SESSION['timeout']);
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
 * @return bool ret true if succeeded, false otherwise
 */
function site_login($email, $password) {
    //return db_login($email, $password);
    true;
}

?>
