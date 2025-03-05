<?php
include_once "site.php";

 
/* Attempt to connect to MySQL database */
try {
    $db = new PDO("mysql:host=" . DB_SERVER . ";dbname=" . DB_NAME, DB_USERNAME, DB_PASSWORD);
    // Set the PDO error mode to exception
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e){
    die("ERROR: Could not connect. " . $e->getMessage());
}

/**
 * Resets the password to the site default
 * @param userid User id for user to change the password for
 * @return true if succeeded, false otherwise
 */
function db_reset_password($userid){
    global $db;
    global $MYC2;
    $ret = false;

    try {
        $query = $db->prepare("UPDATE members SET password=:pass WHERE id=:id;");
        $query->bindParam("pass", $MYC2['pass_default'], PDO::PARAM_STR);
        $query->bindParam("id", $userid, PDO::PARAM_INT);

        if($query->execute()) {
            $ret = true;
        } else {
            setInfoError("Misslyckades (DB-error)");
        }
    } catch(PDOException $e) {
        setInfoError("DB error(1): ".$e->getMessage());
    }
    return $ret;
}

/**
 * Changes the password for a user
 * @param userid Id of the user to change
 * @param oldpass Old password of the user
 * @param newpass Password to set for the user
 * @return ret true if succeeded, false otherwise
 */
function db_changePassword($userid, $oldpass, $newpass) {
    global $db;
    $ret = false;

    try {
        $query = $db->prepare("SELECT * FROM members WHERE id=:id;");
        $query->bindParam("id", $userid, PDO::PARAM_INT);
        $query->execute();
        $result = $query->fetch(PDO::FETCH_ASSOC);

        if (($result) && (password_verify($oldpass, $result['password']))) {
            $newpasshash = password_hash($newpass, PASSWORD_DEFAULT);
            $query = $db->prepare("UPDATE members SET password=:newpasshash WHERE id=:id;");
            $query->bindParam("id", $userid, PDO::PARAM_INT);
            $query->bindParam("newpasshash", $newpasshash, PDO::PARAM_STR);
            if($query->execute()) {
                $ret = true;
            } else {
                setInfoError("Misslyckades");
            }
        } else {
            setInfoError("Fel lösenord!");
        }
    } catch(PDOException $e){
        setInfoError("DB error(2): ".$e->getMessage());
    }
    return $ret;
}

/**
 * Logs in a user
 * @param email the user identifier
 * @param password Clean password of the user
 * @return ret true if succeeded, false otherwise
 */
function db_login($email, $password) {
    global $db;
    $ret = false;

    try {
        $query = $db->prepare("SELECT * FROM members WHERE email=:email;");
        $query->bindParam("email", $email, PDO::PARAM_STR);
        $query->execute();
        $result = $query->fetch(PDO::FETCH_ASSOC);
        if (($result) && (password_verify($password, $result['password']))) {
            s_start();
            $_SESSION['loggedin'] = true;
            $_SESSION['user'] = $result;
            $_SESSION['user']['password'] = "-"; //hide password hash!
            $_SESSION['timeout'] = time();
            s_stop();
            $ret = true;
        } else {
            setInfoError("Fel användarnamn eller lösenord!");
        }
    } catch(PDOException $e){
        setInfoError("DB error(3): ".$e->getMessage());
    }
    return $ret;
}

/**
 * Updates the user info in db
 * @param data Array to set with name, email, phone, address and id.
 * @param update_session Indicates if the session parameters shall be updated with the new values or not(false)
 * @return ret true if succeeded, false otherwise
 */
function db_updateUser(&$data, $update_session=false) {
    global $db;
    $ret = false;

    try {
        $query = $db->prepare("UPDATE members SET name=:name, email=:email, phone=:phone, address=:address, site_role=:site_role, week_length=:week_length WHERE id=:id;");
        $query->bindParam("name", $data['name'], PDO::PARAM_STR);
        $query->bindParam("email", $data['email'], PDO::PARAM_STR);
        $query->bindParam("phone", $data['phone'], PDO::PARAM_STR);
        $query->bindParam("address", $data['address'], PDO::PARAM_STR);
        $query->bindParam("site_role", $data['site_role'], PDO::PARAM_STR);
        $query->bindParam("id", $data['id'], PDO::PARAM_INT);
        $query->bindParam("week_length", $data['week_length'], PDO::PARAM_INT);

        if($query->execute()) {
            if($update_session) {
                s_start();
                $_SESSION['user']['name'] =  $data['name'];
                $_SESSION['user']['email'] =  $data['email'];
                $_SESSION['user']['phone'] =  $data['phone'];
                $_SESSION['user']['address'] =  $data['address'];
                $_SESSION['user']['site_role'] =  $data['site_role'];
                $_SESSION['user']['week_length'] = $data['week_length'];
                s_stop();
            }
            $ret = true;
        } else {
            setInfoError("Misslyckades (DB-error)");
        }
    } catch(PDOException $e){
        if ($e->getCode() == 23000) {
            setInfoError("Email finns redan!", "Välj en annan email adress!");
        } else {
            setInfoError("DB error(4): ".$e->getMessage());
        }
    }
    return $ret;
}

/**
 * Returns all users from the database
 * @param no_pass Do not show password if set to true
 * @return result Array of users
 */
function db_getAllUsers($no_pass = true) {
    global $db;
    $result = array();

    try {
        $sql = $db->prepare("SELECT id, name, email, share, phone, address, site_role,photo, week_length FROM members ORDER BY share ASC;");
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e){
        setInfoError("DB error(5): ".$e->getMessage());
    }
    if ($no_pass) {
        foreach($result as $r) {
            $r['password'] = "-";
        }
    }
    return $result;
}

/**
 * Removes a user from the database
 * @param userid The id number of the user to remove
 * @return ret true if succeeded, false otherwise
 */
function db_remove_share($userid) {
    global $db;
    $ret = false;
    try {
        $query = $db->prepare("DELETE FROM forum WHERE member=:id; DELETE FROM members WHERE id=:id;");
        $query->bindParam("id", $userid, PDO::PARAM_INT);

        if($query->execute()) {
            $ret = true;
        } else {
            setInfoError("Misslyckades (DB-error)");
        }
    } catch(PDOException $e){
        setInfoError("DB error(6): ".$e->getMessage());
    }
    return $ret;
}

/**
 * Adds a new member to the database
 * @param email The email of the new user
 * @param share The share of the new user
 * @return ret true if succeeded, false otherwise
 */
function db_add_share($email, $share) {
    global $db;
    global $MYC2;
    $ret = false;
    try {
        $query = $db->prepare("INSERT INTO `members` (name, email, share, phone, site_role, password, week_length) VALUES(?, ?, ?, ?, ?, ?, ?);");
        $query->bindParam(1, $MYC2['name_default'], PDO::PARAM_STR);
        $query->bindParam(2, $email, PDO::PARAM_STR);
        $query->bindParam(3, $share, PDO::PARAM_STR);
        $query->bindParam(4, $MYC2['phone_default'], PDO::PARAM_INT);
        $query->bindParam(5, $MYC2['site_role_default'], PDO::PARAM_STR);
        $query->bindParam(6, $MYC2['pass_default'], PDO::PARAM_STR);
        $query->bindParam(7, $MYC2['week_length_default'], PDO::PARAM_INT);

        if($query->execute()) {
            $ret = true;
        } else {
            setInfoError("Misslyckades (DB-error)");
        }
    } catch(PDOException $e){
        if ($e->getCode() == 23000) {
            setInfoError("Email eller andel finns redan!");
        } else {
            setInfoError("DB error(7): ".$e->getMessage());
        }
    }
    return $ret;
}

/**
 * Resets a user in db to its default values
 * @param userid The id number of the user to reset
 * @return ret true if succeeded, false otherwise
 */
function db_resetUser($userid) {
    global $db;
    global $MYC2;
    $ret = false;
    $email = sprintf($MYC2['email_default'], $userid);

    try {
        $query = $db->prepare("UPDATE members SET name=:name, email=:email, phone=:phone, address=:address, site_role=:site_role, password=:pass, photo=:photo, week_length=:week_length WHERE id=:id;");
        $query->bindParam("name", $MYC2['name_default'], PDO::PARAM_STR);
        $query->bindParam("email", $email, PDO::PARAM_STR);
        $query->bindParam("phone", $MYC2['phone_default'], PDO::PARAM_STR);
        $query->bindParam("address", $MYC2['address_default'], PDO::PARAM_STR);
        $query->bindParam("site_role", $MYC2['site_role_default'], PDO::PARAM_STR);
        $query->bindParam("pass", $MYC2['pass_default'], PDO::PARAM_STR);
        $query->bindParam("photo", $MYC2['profile_img_default'], PDO::PARAM_STR);
        $query->bindParam("week_length", $MYC2['week_length_default'], PDO::PARAM_INT);
        $query->bindParam("id", $userid, PDO::PARAM_INT);

        if($query->execute()) {
            $ret = true;
        } else {
            setInfoError("Misslyckades (DB-error)");
        }
    } catch(PDOException $e){
        if ($e->getCode() == 23000) {
            setInfoError("Email finns redan!", "Välj en annan email adress!");
        } else {
            setInfoError("DB error(9): ".$e->getMessage());
        }
    }
    return $ret;
}


/**
 * Updates the user profile img path for a user
 * @param id Id of the user
 * @param img_path path of the image to update to
 * @return ret true if succeeded, false otherwise
 */
function db_saveImgPath($id, $img_path) {
    global $db;
    $ret = false;

    try {
        $query = $db->prepare("UPDATE members SET photo=:img_path WHERE id=:id;");
        $query->bindParam("img_path", $img_path, PDO::PARAM_STR);
        $query->bindParam("id", $id, PDO::PARAM_INT);

        if($query->execute()) {
            $ret = true;
        }
    } catch(PDOException $e){
        setInfoError("DB error(10): ".$e->getMessage());
    }
    return $ret;
}

/**
 * Reads and returns all the lines from the forum table
 * @return result as an array of lines from the forum table, max count is set in config($MYC2)
 */
function db_getAllForumRows() {
    global $db;
    global $MYC2;
    $max = $MYC2['max_forum_rows'];
    $result = array();

    try {
        $sql = $db->prepare("SELECT f.id, f.date, f.member, f.text, f.image, m.name, m.photo FROM forum f JOIN members m ON m.id = member ORDER BY f.date DESC LIMIT $max;");
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e){
        setInfoError("DB error(11): ".$e->getMessage());
    }
    return $result;
}

/**
 * Inserts a row to the forum
 * @param member The member id who adds the row
 * @param text Text to add 
 * @return ret true if succeeded, false otherwise
 */
function db_addForumRow($member, $text) {
    global $db;
    $ret = false;

    $query = $db->prepare("INSERT INTO `forum` (member, text) VALUES($member, '$text');");
    try {
        if($query->execute()) {
            $ret = true;
        }
    } catch(PDOException $e){
        setInfoError("DB error(12): ".$e->getMessage());
    }
    return $ret;
}

/**
 * Deletes a row in forum table based on row id
 * @param forum_id The id of the row to delete
 * @return ret true if succeeded, false otherwise
 */
function db_deleteForumRow($forum_id) {
    global $db;
    $ret = false;

    $query = $db->prepare("DELETE FROM `forum` WHERE id=:forum_id;");
    $query->bindParam("forum_id", $forum_id, PDO::PARAM_INT);
    try {
        if($query->execute()) {
            $ret = true;
        }
    } catch(PDOException $e){
        setInfoError("DB error(13): ".$e->getMessage());
    }
    return $ret;
}

/**
 * Returns weeks from the database based on year
 * @param year Year to fetch
 * @return result Array of weeks
 */
function db_getAllWeeks($year) {
    global $db;
    $result = array();

    try {
        $sql = $db->prepare("SELECT * FROM `week` WHERE year=:year ORDER BY week ASC;");
        $sql->bindParam("year", $year, PDO::PARAM_INT);
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e){
        setInfoError("DB error(14): ".$e->getMessage());
    }
    return $result;
}

/**
 * Inserts a week to the db
 * @param data Array containing the row data
 * @return bool True if succeeded, false otherwise
 */
function db_insertWeek($data) {
    global $db;
    $ret = false;

    try {
        $query = $db->prepare("INSERT INTO week (year, week, sails, notsails, wantsail) VALUES(:year, :week, :sails, :notsails, :wantsail);");
        if($query->execute($data)) {
            $ret = true;
        }
    } catch(PDOException $e){
        setInfoError("DB error(15): ".$e->getMessage());
    }
    return $ret;
}

/**
 * Updates a row with specified values in the week table
 * @param data Array containing teh new data and row id
 * @return bool True if succeeded, false otherwise
 */
function db_updateWeek($data) {
    global $db;
    $ret = false;
    
    try {
        $query = $db->prepare("UPDATE `week` SET  sails=:sails, notsails=:notsails, wantsail=:wantsail WHERE id=:id;");
        if($query->execute($data)) {
            $ret = true;
        }
    } catch(PDOException $e){
        setInfoError("DB error(8): ".$e->getMessage());
    }
    return $ret;
}


/**
 * Returns the emails from all users except user X and user Y
 * @return emails as string array
 */
function db_getAllEmails() {
    global $db;
    $result = array();

    try {
        $sql = $db->prepare("SELECT email FROM members WHERE NOT share = 'X' AND NOT share = 'Y';");
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e){
        setInfoError("DB error(16): ".$e->getMessage());
    }
    return $result;
}
?>
