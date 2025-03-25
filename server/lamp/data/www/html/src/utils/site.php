<?php



function getUrl($url):string{
    $base_address= "https://172.19.0.70:7443";
    return "$base_address/$url";
}


/**
 * @brief Checks whether the user is logged in or not
 * @return bool true if user is logged in, false otherwise
 */
function isLoggedIn(): bool {
    try {
        s_start();
        if(isset($_SESSION["isloggedintosignal"]) && $_SESSION["isloggedintosignal"] === true) {
            return true;
        }
        return false;
    }finally {
        s_stop();
    }
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
 * @brief Cleans (unsets) all session parameters used by the page
 */
function cleanSession() {
    s_start();
    unset($_POST['password']);
    unset($_POST['email']);
    unset($_SESSION['login']);
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
    $login_info = [
        'email' => $email,
        'password' => $password
    ];

    $ret = httpsPostLogin(getUrl("user/login"), $login_info);

    if($ret["response"] !== false) {
        $http = $ret["info"]["http_code"];
        if ($http === 200) {
            $_SESSION['signal_auth_token'] = $ret["response"];
            $_SESSION['isloggedintosignal'] = true;
            return 'signal.php';
        } else  if ($http === 401) {
            $_SESSION['login_error'] = "Could not login, unauthorized!";
        } else {
            $_SESSION['login_error'] = "Could not login, code: ".$http;
        }
    } else {
        $_SESSION['login_error'] = "Could not login, curl failed!";
    }
    return 'index.php';
}

/**
 * 
 */
function httpsPostLogin($url, $postBody) {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($postBody)
    ]);
    $response = curl_exec($ch);
    $info = null;
    if($response !== false) {
        $info = curl_getinfo($ch);
    }
    curl_close($ch);
    return ['response' => $response, 'info' => $info];
}


function site_register($email) : string {
    $url = getUrl("user?".http_build_query(['email' => $email]));
    $ret = httpsPostRegister($url);
    
    if($ret["response"] !== false) {
        $http = $ret["info"]["http_code"];
        if ($http === 201) {
            return 'index.php';
        } else if ($http === 409) {
            $_SESSION['register_error'] = "Could not register, user already registered";
        } else {
            $_SESSION['register_error'] = "Could not register, code: $http";
        }
    } else {
        $_SESSION['register_error'] = "Could not register, curl failed!";
    }
    return 'register.php';
}

/**
 * Performs a POST 
 * @param string url the url to post, can contain parameters
 * @return string the response from the server as array or null if curl failed
 * @see: https://www.php.net/manual/en/function.curl-getinfo.php
 */
function httpsPostRegister($url): Array {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false); 
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    $info = null;
    if($response !== false) {
        $info = curl_getinfo($ch);
    }
    curl_close($ch);
    return ['response' => $response, 'info' => $info];
}


function addSignal($signal, $one_min, $four_min, $five_min):bool {
    $signal = Array (
        'id' => 0,
        'group_id' => 0,
        'date_time' => $signal,
        'one_minute' => $one_min,
        'four_minute' => $four_min,
        'five_minute' => $five_min
    );
    $url = getUrl("signal");
    $ch = curl_init();
    curl_setopt_array($ch, array(
        CURLOPT_URL => $url,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER => array(
            'Authorization: '.$_SESSION['signal_auth_token'],
            'Content-Type: application/json'
        ),
        CURLOPT_POSTFIELDS => json_encode($signal)
    ));
    $response = curl_exec($ch);
    $info = null;
    if($response !== false) {
        $info = curl_getinfo($ch);
    }
    curl_close($ch);

    return true;     
}


function getList() {
    $list = "";
    return $list;
}

?>
