-- VERSION 1.0.0 --
-- Create database for SailRaceSignal --
-- Credit: Bela Bursan<burszan@gmail.com>


-- Create a database using `mysql_database` placeholder
CREATE DATABASE IF NOT EXISTS `MYSQL_DATABASE`;
USE `MYSQL_DATABASE`;


-- Table that holds information about the registered users --
CREATE TABLE IF NOT EXISTS `user_info` (
    `user_id`   INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `email`     VARCHAR(64) UNIQUE NOT NULL,
    `pass_hash` VARCHAR(128) NOT NULL,
    PRIMARY KEY(`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;


-- Table holds the signals --
CREATE TABLE IF NOT EXISTS `signal` (
    `id`            INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `date_time`     DATETIME UNIQUE NOT NULL,
    `group_id`      INTEGER DEFAULT 0,
    `signal_type`   INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
