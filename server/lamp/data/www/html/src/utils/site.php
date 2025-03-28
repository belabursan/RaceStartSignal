<?php
include_once "node_intf.php";




/**
 * @brief Checks whether the user is logged in or not
 * @return bool true if user is logged in, false otherwise
 */
function isLoggedIn(): bool {
    try {
        s_start();
        if(isset($_SESSION["isloggedintosignal"]) 
            && $_SESSION["isloggedintosignal"] === true 
            && isset($_SESSION["signal_auth_token"])) {
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
 * Logs in a user. If it fails an error message is stored in the session.
 * @param string email the user identifier
 * @param string password Clean password of the user
 * @return string return page to redirect to
 */
function site_login($email, $password):string  {
    $ret = node_login($email, $password);

    if($ret["response"] !== false) {
        $http = $ret["info"]["http_code"];
        if ($http === 200) {
            // login succeeded, store auth token and return signal page
            $_SESSION['signal_auth_token'] = $ret["response"];
            $_SESSION['isloggedintosignal'] = true;
            return 'signal.php';
        } else  if ($http === 401) {
            $_SESSION['login_error'] = "Could not login, unauthorized!";
        } else {
            $_SESSION['login_error'] = "Could not login, code: $http";
        }
    } else {
        $_SESSION['login_error'] = "Could not login, curl failed!";
    }
    return 'index.php';
}


function site_register($email) : string {
    $ret = node_register($email);
    
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


function addSignal($date_time, $five_min_serie):bool {
    $ret = node_add_signal($date_time, $five_min_serie);
    //var_dump($ret);
    $reason= $ret['response'];
    if($ret["response"] !== false) {
        $http = $ret["info"]["http_code"];
        if ($http === 200) {
            return true;
        } else {
            $_SESSION['signal_error'] = "Could not add signal($reason), code: $http";
        }
    } else {
        $_SESSION['signal_error'] = "Could not add signal, curl failed!";
    }
    return false;     
}


/**
 * Returns all list of signals
 * @return array - list of signals or empty list if db is empty
 */
function site_get_signal_list(): array {
    $list = node_get_signals();
    var_dump($list);
    /*$group_list = [];

    foreach ($list as $key => $value) {
        $group_id = $value['group_id'];
        if (!isset($group_list[$group_id])) {
            $group_list[$group_id] = [];
        }
        $group_list[$group_id][] = $value;
    }
    return $group_list;
    */
    return $list;
}

?>
