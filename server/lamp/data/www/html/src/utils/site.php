<?php
include_once "node_intf.php";
include_once "logger.php";


/**
 * @brief Redirects the page to the secure https
 * Shall be placed first in the index.php
 */
function redirectTohttps() {
    if ($_SERVER['HTTPS'] != "on") {
        $redirect = "https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
        header('HTTP/1.1 301 Moved Permanently');
        header("Location: $redirect");
        exit();
    }
}

/**
 * @brief Checks whether the user is logged in or not
 * @return bool true if user is logged in, false otherwise
 */
function isLoggedIn(): bool {
    try {
        s_start();
        if(isset($_SESSION["isloggedintosignal"]) === true
            && $_SESSION["isloggedintosignal"] === true 
            && isset($_SESSION["signal_auth_token"]) === true) {
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
    log_i("Logged out");
}


/**
 * @brief Cleans (unsets) all session parameters used by the page
 */
function cleanSession() {
    s_start();
    logout();
    s_stop();
    session_destroy();
    log_i("Session destroyed");
}

/**
 * Logs in a user. If it fails an error message is stored in the session.
 * @param string email the user identifier
 * @param string password Clean password of the user
 * @return boolean true if login succeded, throws exception otherwise
 */
function site_login($email, $password):bool  {
    if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {     
        throw new Exception("Invalid email format!", -2, null);           
    }
    $ret = node_login($email, $password);
    $message = "Could not login, curl failed (node down?).";
    $code = 555;

    if($ret["response"] !== false) {
        $code = $ret["info"]["http_code"];
        if ($code === 200) {
            // login succeeded, store auth token
            return setLogin($ret["response"]);
        } else  if ($code === 401) {
            $message = "Could not login, unauthorized!";
        } else {
            $message = "Could not login!";
        }
    }
    log_e($message);
    throw new Exception($message, $code, null);
}

/**
 * Registers an email on the server
 * @param string $email
 * @throws \Exception in case of not 200 http error code
 * @return bool if registering succeeded
 */
function site_register(string $email) : bool {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {     
        throw new Exception("Invalid email format!", -2, null);           
    }
    $message = "Could not register, curl failed (node down?).";
    $code = 555;
    $ret = node_register($email);
    
    if($ret["response"] !== false) {
        $code = $ret["info"]["http_code"];
        if ($code === 201) {
            return true;
        } else if ($code === 409) {
            $message = "Could not register, user already registered";
        } else {
            $message = "Could not register, code: $code";
        }
    }
    log_e($message);
    throw new Exception($message, $code, null);
}


/**
 * Adds a signal to the db
 * @param string $date_time date to add the signal for
 * @param bool $five_min_serie true if five min serie should be added too
 * @param bool $yellow_flag true if yellow flag shall be visible, false otherwise
 * @return bool true if addition succeeded, false otherwise
 */
function addSignal($date_time, $five_min_serie, $yellow_flag):bool {
    log_i("adding signal: $date_time");
    $ret = node_add_signal($date_time, $five_min_serie, $yellow_flag);
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
            log_e("Could not add signal($reason), code: $http");
        }
    } else {
        $_SESSION['signal_error'] = "Could not add signal, curl failed!";
        log_e("Could not add signal, curl failed!");
    }
    return false;     
}


/**
 * Returns all list of signals
 * @return array - list of signals or empty list if db is empty
 */
function site_get_signal_list(): array {
    log_i("Getting signal list");

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

/**
 * Deletes a signal group from db
 * @param string $group_id greoup id to delete
 * @return bool true if deletion has succeeded, false otherwise
 */
function deleteSignal($group_id):bool {
    log_i("deleting group $group_id");

    $ret = node_delete_signal($group_id);
    if($ret === false) {
        log_e("Could not delete signal $group_id, curl failed!");
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
function printFooter($vers="v1.0.0") {
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
    echo "<div id=\"error-monitor\" class=\"error-footer\" onclick=\"fadeOut(this.id);\">
        <h3 style=\"background-color: lightcoral;\">
            $error
        </h3>
    </div>\n";
}

?>
