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
function site_login($email, $password):string  {
    //check db_login($email, $password);
    //echo "Logging in...";
    // error page
    $_SESSION['login_error'] = "Wrong email or bad password!";
    return 'index.php';
}

function site_register($email) : string {
    $data = array('email' => $email);
    $url = "https://172.19.0.70:7443/user?".http_build_query($data);
    $ret = httpPost($url);
    if ($ret === 201) {
        return 'index.php';
    }
    $_SESSION['register_error'] = "Could not register, code: ".$ret;
    return 'register.php';
}

/**
 * Performs a POST 
 * @param url the url to post
 * @return the http status code
 */
function httpPost($url): int {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false); 
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $http_code;
}

?>
