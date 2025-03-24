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
    $login_info = Array (
        'email' => $email,
        'password' => $password
    );
    $url = "https://172.19.0.70:7443/user/login";
    $ret = httpsPostWithBody($url, $login_info);

    if($ret["response"] !== false) {
        $http = $ret["info"]["http_code"];
        if ($http === 200) {
            $_SESSION['login_token'] = $ret["response"];
            return 'signal.php';
        } else  if ($http === 401) {
            $_SESSION['login_error'] = "Could not login, unauthorized!";
        } else {
            $_SESSION['login_error'] = "Could not login, code: ".$http;
        }
    } else {
        $_SESSION['login_error'] = "Could not register, curl failed!";
    }
    return 'index.php';
}


function site_register($email) : string {
    $data = array('email' => $email);
    $url = "https://172.19.0.70:7443/user?".http_build_query($data);
    $ret = httpsPost($url);
    
    if($ret["response"] !== false) {
        $http = $ret["info"]["http_code"];
        if ($http === 201) {
            return 'index.php';
        } else  if ($http === 409) {
            $_SESSION['register_error'] = "Could not register, user already registered";
        } else {
            $_SESSION['register_error'] = "Could not register, code: ".$http;
        }
    } else {
        $_SESSION['register_error'] = "Could not register, curl failed!";
    }
    return 'register.php';
}

/**
 * Performs a POST 
 * @param url the url to post, can contain parameters
 * @return the response from the server as array or null if curl failed
 * @see: https://www.php.net/manual/en/function.curl-getinfo.php
 */
function httpsPost($url): Array {
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
    return Array('response' => $response, 'info' => $info);
}


/**
 * 
 */
function httpsPostWithBody($url, $postBody) {
    $ch = curl_init();
    curl_setopt_array($ch, array(
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER => array(
            /*'Authorization: '.$authToken,*/
            'Content-Type: application/json'
        ),
        CURLOPT_POSTFIELDS => json_encode($postBody)
    ));
    $response = curl_exec($ch);
    $info = null;
    if($response !== false) {
        $info = curl_getinfo($ch);
    }
    curl_close($ch);
    return Array('response' => $response, 'info' => $info);
}

function getList() {
    $list = "";
    return $list;
}

?>
