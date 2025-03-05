<?php

define('VERSION', "v2.1");
define('WEB_ROOT', dirname(__FILE__, 3));
define('I_ERROR', "ERR");
define('I_INFO', "INF");

/**
 * Configuration for the site
 */
$MYC2 = array(
    "page_timeout_min" => 40,   //log out after x minutes of inactivity
    "profile_pic_dir" => "db".DIRECTORY_SEPARATOR."profiles",   //where the profile imgs are
    "doc_dir" => "db".DIRECTORY_SEPARATOR."documents",          //where the assosiation documents are
    "boat_dir" => "db".DIRECTORY_SEPARATOR."boat",          //where the boat documents are
    "other_dir" => "db".DIRECTORY_SEPARATOR."other",        //other directory
    "log_file" => "db".DIRECTORY_SEPARATOR."logs".DIRECTORY_SEPARATOR."myc2.log",
    "img_dir" => "images",                                  //where the images are
    "profile_img_default" => "general_user_icon.png",
    "site_role_default" => "user",
    "site_role_admin" => "admin",
    "pass_default" => "$2y$10$9APvgJ0gFkIpRjyAZenfWuNWLIMWxYucvyxd8SP6y6lLTlNatlBDW", //hash for pass 1111
    "address_default" => "Sweden",
    "phone_default" => "0",
    "email_default" => "unused%d@myc2.se", // note that an INT must be passed here...use sprintf
    "name_default" => "change me",
    "week_length_default" => 2,         // how many weeks a member sails by default
    "theo" => "+306936708688",
    "tanasis" => "+306937127473",
    "max_forum_rows" => 300,
    "profile_img_max_size" => 2000000,      //around 2Mb
    "boat_name" => "OceanView",
    "disp_year_zero" => 2016,        // year to count from, here A is 0
    "disp_alg" => array(0, 7, 4, 1, 8, 5, 2, 9, 6, 3),  //used to count the real disp list on home.php
    "disp_list" => array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'),  //disponeringslista
    "disp_list_length" => 5,     //how many rows to show on home.php
    "sail_period_start" => 17,
    "sail_season_start" => 21,
    "sail_season_end" => 40,
    "sail_period_end" => 44,
    "enable_email_notif" => true,       //allow email notification and group mail from admin
    "allow_user_change" => true,         //allow users to change the sailing on "home"
    "verbose" => false              //print info to log
);

/**
 * Database credentials
 */
define('DB_NAME', '5876-myc2db');
if (isset($_SERVER['SERVER_NAME']) && ($_SERVER['SERVER_NAME'] == "myc2.se" || $_SERVER['SERVER_NAME'] == "www.myc2.se")) {
    /* for myc2.se */
    define('DB_SERVER', 'mysql02');
    define('DB_USERNAME', '5876-2ebm6');
    define('DB_PASSWORD', 'Q7gPzPP/Tn');
} else {
    /* locally */
    define('DB_SERVER', 'localhost');
    define('DB_USERNAME', 'root');
    define('DB_PASSWORD', '');
}
?>
