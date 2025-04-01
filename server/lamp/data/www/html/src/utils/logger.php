<?php

define('I_ERROR', "ERR");
define('I_INFO', "INF");
$ONLY_ERRORS = false;

/**
 * Writes a log message to the logfile defined in the config
 * @param string msg Message to write
 * @param string type Type of the message, can be I_ERROR or I_INFO
 */
function log_all($msg, $type=I_INFO) {
    $now = date("Y-m-d H:i:s");
    $root = $_SERVER['DOCUMENT_ROOT'];
    $logfile = "$root/src/logs/race_signal_php.log";
    error_log("$type($now) - $msg\n", 3, $logfile);
}


/**
 * Writes an info message to the logfile defined in the config
 * @param string msg Message to write
 */
function log_i($msg) {
    global $ONLY_ERRORS;
    if ($ONLY_ERRORS !== true) {
        global $I_INFO;
        log_all($msg, $I_INFO);
    }
}


/**
 * Writes an error message to the logfile defined in the config
 * @param string msg Message to write
 */
function log_e($msg) {
    global $I_ERROR;
    log_all($msg, $I_ERROR);
}

?>