<?php

/**
 * Returns the total url to the node server
 * @param mixed $url to be added to the base url
 * @return string the total url
 */
function getUrl($url):string{
    $base_address= "https://172.19.0.70:7443";
    return "$base_address$url";
}


/**
 * Summary of node_login
 * @param string $email email of the user
 * @param string $password password of the user
 * @return array{info: mixed curl response, response: bool|string}
 * @see: https://www.php.net/manual/en/function.curl-getinfo.php
 */
function node_login($email, $password) {
    $login_info = [
        'email' => $email,
        'password' => $password
    ];
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => getUrl("/user/login"),
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($login_info)
    ]);
    $response = curl_exec($ch);
    $info = null;
    if($response !== false) {
        $info = curl_getinfo($ch);
    }
    curl_close($ch);
    return ['response' => $response, 'info' => $info];
}



/**
 * Registers a user in the node server
 * @param string $email email of the user
 * @return string the response from the server as array or null if curl failed
 * @see: https://www.php.net/manual/en/function.curl-getinfo.php
 */
function node_register($email): Array {
    $url = getUrl("/user?".http_build_query(['email' => $email]));
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


function node_add_signal($date_time, $five_min_serie): mixed {
    $signal = Array (
        'date_time' => $date_time,
        'five_min_serie' => $five_min_serie
    );
    $url = getUrl("/signal");
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
    return ['response' => $response, 'info' => $info];
}

/**
 * Returns a list of signals from the database
 * @throws \Exception in case of curl failure or http code different from 200
 * @return array -List of all signals or empty list if db is empty
 */
function node_get_signals(): array
{
    $list = [];
    $url = getUrl("/signal");
    $ch = curl_init();

    try {
        curl_setopt_array($ch, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                'Authorization: ' . $_SESSION['signal_auth_token']
            )
        ));
        $response = curl_exec($ch);
        if ($response !== false) {
            $info = curl_getinfo($ch);
            if ($info['http_code'] === 200) {
                $list = json_decode($response, true);
            } else {
                throw new Exception("Could not get signal list, code: ", $info['http_code'], null);
            }
        } else {
            throw new Exception("Could not get signal list, curl failed!", -1, null);
        }
    } finally {
        curl_close($ch);
    }
    return $list === null ? [] : $list;
}


?>
