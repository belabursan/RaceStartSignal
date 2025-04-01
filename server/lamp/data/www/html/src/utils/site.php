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
 * Sets a login
 * @param string $token auth token to set
 * @return bool Always true
 */
function setLogin(string $token):bool {
    $_SESSION['signal_auth_token'] = $token;
    $_SESSION['isloggedintosignal'] = true;
    log_i("login set");
    return true;
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

function logout(){
    unset($_POST['password']);
    unset($_POST['email']);
    unset($_SESSION['isloggedintosignal']);
    unset($_SESSION['signal_error']);
    unset($_SESSION['login_error']);
    unset($_SESSION['register_error']);
    unset($_SESSION['signal_auth_token']);
}


/**
 * @brief Cleans (unsets) all session parameters used by the page
 */
function cleanSession() {
    s_start();
    logout();
    s_stop();
    session_destroy();
}

/**
 * Logs in a user. If it fails an error message is stored in the session.
 * @param string email the user identifier
 * @param string password Clean password of the user
 * @return boolean true if login succeded, throws exception otherwise
 */
function site_login($email, $password):bool  {
    if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {     
        throw new Exception("Invalid email format!", -1, null);           
    }
    $ret = node_login($email, $password);
    $message = "Could not login, curl failed (node down?).";
    $code = 555;

    if($ret["response"] !== false) {
        $http = $ret["info"]["http_code"];
        if ($http === 200) {
            // login succeeded, store auth token
            return setLogin($ret["response"]);
        } else  if ($http === 401) {
            $message = "Could not login, unauthorized!";
        } else {
            $message = "Could not login!";
            $code = $http;
        }
    }
    throw new Exception($message, $code, null);
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
            if ($http === 401) {
                logout();
            }
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
    $groups = [];

    foreach($list as $key => $value) {
        $gid = $value["group_id"];
        if (!isset($groups[$gid])) {
            $groups[$gid] = [];
        }
        $sig = ["signal_type" => $value["signal_type"],
                "date_time" => $value["date_time"]];
        array_push($groups[$gid], $sig);
    }
    return $groups;
}


function deleteSignal($group_id):bool {
    $ret = node_delete_signal($group_id);
    if($ret === false) {
        $_SESSION['signal_error'] = "Could not delete signal, curl failed!";
        return false;
    }
    return true;     
}


function sortSignalGroup($signalGroup):array {
    $out = [];
    foreach ($signalGroup as $signal) {

        $out[$signal['signal_type']] = $signal['date_time'];
    }
    return $out;
}

/**
 * @brief Prints the footer on a page
 * Shall be printed after the closing tag of <main>
 */
function printFooter($vers="") {
    $YEAR = date('Y');

    echo "<div class=\"signal-footer\">
        <section>
            <address property=\"email\">
                <span class=\"copy\">&copy;$YEAR <a href=\"mailto:burszan@gmail.com\">buri</a> $vers</span>
            </address>
        </section>
    </div>\n";
}

/**
 * @brief Prints the footer on a page
 * Shall be printed after the closing tag of <main>
 */
function printError($error="") {
    echo "<div class=\"error-footer\">
        <span>
            $error
        </span>
    </div>\n";
}

?>
