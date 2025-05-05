-- VERSION 2.1.0 --
-- Create database for SailRaceSignal --
-- Credit: Bela Bursan<burszan@gmail.com>


-- Create a database using `mysql_database` placeholder
CREATE DATABASE IF NOT EXISTS `MYSQL_DATABASE`;
USE `MYSQL_DATABASE`;
-- SET GLOBAL wait_timeout = 600;
-- SET GLOBAL interactive_timeout = 600;
SET innodb_lock_wait_timeout=10;


-- Table that holds information about the registered users --
CREATE TABLE IF NOT EXISTS `user_info` (
    `user_id`   INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `email`     VARCHAR(64) UNIQUE NOT NULL,
    `pass_hash` VARCHAR(128) NOT NULL,
    PRIMARY KEY(`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


-- Table holds the signals --
CREATE TABLE IF NOT EXISTS `signals` (
    `id`            INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `date_time`     DATETIME UNIQUE NOT NULL,
    `signal_type`   ENUM('START', 'RACE_5', 'RACE_5Y') NOT NULL DEFAULT 'START',
    `boat_id`       INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `info`          VARCHAR(64) NOT NULL DEFAULT '',
    PRIMARY KEY(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


-- Table that holds the app configuration --
CREATE TABLE IF NOT EXISTS `app_config` (
    `id`            INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `list_changed`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `conf_changed`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `paused`        INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `mute`          INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `abort_running` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `race_start`    TIME NOT NULL DEFAULT '06:59:00',
    `race_end`      TIME NOT NULL DEFAULT '20:16:00',
    PRIMARY KEY(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- Insert default config row --
-- Note: if id number is changed the CONFIG_ID constant value in DbHandler shall be changed too --
INSERT INTO `app_config` (id) VALUES(1);
-- https://stackoverflow.com/questions/2766785/fixing-lock-wait-timeout-exceeded-try-restarting-transaction-for-a-stuck-my
-- https://dev.mysql.com/doc/refman/8.4/en/enum.html#enum-using
