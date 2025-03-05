-- VERSION 1.2.0 --
-- Create database for SailRace --
-- Credit: Bela Bursan<burszan@gmail.com>


-- Create a database using `mysql_database` placeholder
CREATE DATABASE IF NOT EXISTS `MYSQL_DATABASE`;
USE `MYSQL_DATABASE`;


-- Table that holds information about the registered users --
CREATE TABLE IF NOT EXISTS `user_info` (
    `user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(40) UNIQUE NOT NULL DEFAULT UUID(),
    `name` VARCHAR(64) NOT NULL,
    `email` VARCHAR(64) UNIQUE NOT NULL,
    `phone` VARCHAR(32),
    `role` ENUM ('USER', 'ADMIN', 'SYSADMIN') DEFAULT "USER",
    `pass_hash` VARCHAR(128) NOT NULL,
    `last_login` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
-- Add a test admin user and a test user --


-- Table that holds information about the registered boats --
CREATE TABLE IF NOT EXISTS `boat_info` (
    `boat_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `type` VARCHAR(64) NOT NULL DEFAULT "unknown" COMMENT 'boat type, e.g.: Express',
    `name` VARCHAR(64) DEFAULT "unknown",
    `sail_number` VARCHAR(16) NOT NULL DEFAULT "0",
    `srs_shorthand_no_flying` FLOAT DEFAULT 0.0 COMMENT 'srs for shorthand without spinnaker',
    `srs_shorthand` FLOAT DEFAULT 0.0 COMMENT 'srs for shorthand with spinnaker',
    `srs_no_flying` FLOAT DEFAULT 0.0 COMMENT 'srs without spinnaker',
    `srs_default` FLOAT DEFAULT 0.0  COMMENT 'srs with spinnaker',
    `skipper_name` VARCHAR(64) NOT NULL DEFAULT "unknown",
    UNIQUE INDEX(`user_id`, `type`, `name`, `sail_number`),
    PRIMARY KEY(`boat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
ALTER TABLE `boat_info` ADD FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE;


-- Table that holds information about harbors --
CREATE TABLE IF NOT EXISTS `harbor` (
    `harbor_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `harbor_name` VARCHAR(64) NOT NULL,
    `city` VARCHAR(32),
    UNIQUE INDEX(`harbor_name`, `city`),
    PRIMARY KEY(`harbor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;


-- Table that holds information about start lines --
CREATE TABLE IF NOT EXISTS `startline` (
    `startline_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `startline_name` VARCHAR(32) NOT NULL DEFAULT "unknown" COMMENT "Can be: startline for J70 race",
    `harbor_id` INTEGER UNSIGNED NOT NULL,
    `lon_start_flag` DOUBLE NOT NULL,
    `lat_start_flag` DOUBLE NOT NULL,
    `lon_signal_boat` DOUBLE NOT NULL,
    `lat_signal_boat` DOUBLE NOT NULL,
    `lon_first_mark` DOUBLE NOT NULL,
    `lat_first_mark` DOUBLE NOT NULL,
    UNIQUE INDEX(`startline_name`, `harbor_id`),
    PRIMARY KEY(`startline_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
ALTER TABLE `startline` ADD FOREIGN KEY (`harbor_id`) REFERENCES `harbor` (`harbor_id`) ON DELETE CASCADE;;


-- Table that holds information about the races --
CREATE TABLE IF NOT EXISTS `race` (
    `race_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `race_name` VARCHAR(64) COMMENT 'e.g. Lagunens Onsdagsrace',
    `description` VARCHAR(255) COMMENT 'more about the race',
    `start_line` INTEGER UNSIGNED NOT NULL,
    `race_type` ENUM ('5-4-1-0', '10-9-1-0') DEFAULT "5-4-1-0" COMMENT 'type can be 5-4-1-0',
    `race_date` DATE NOT NULL DEFAULT CURRENT_DATE,
    `race_start_time` TIME NOT NULL,
    `race_stop_time` TIME NOT NULL,
    `race_course` VARCHAR(64) DEFAULT "not set yet",
    `status` ENUM ('CREATED', 'JOINABLE','COURSE_SET', 'FIVE_MIN', 'FOUR_MIN', 'ONE_MIN', 'STARTED', 'ABORTED', 'FINISHED') DEFAULT "CREATED" COMMENT 'e.g.: if the race will be held',
    `wind_direction` INTEGER COMMENT 'wind direction in degrees (0-359)',
    `wind_strength` INTEGER COMMENT 'wind strength in knots',
    `race_set_by` INTEGER UNSIGNED,
    `admin_lock` INTEGER UNSIGNED,
    UNIQUE INDEX(`start_line`, `race_date`, `race_start_time`),
    PRIMARY KEY(`race_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
ALTER TABLE `race` ADD FOREIGN KEY (`start_line`) REFERENCES `startline` (`startline_id`);
ALTER TABLE `race` ADD FOREIGN KEY (`race_set_by`) REFERENCES `boat_info` (`boat_id`);


-- Table that holds information about participants of a race --
CREATE TABLE IF NOT EXISTS `participants` (
    `participants_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `race_id` INTEGER UNSIGNED NOT NULL,
    `boat_id` INTEGER UNSIGNED NOT NULL,
    `srs_type` ENUM ('SRS_DEFAULT', 'SRS_NO_SPINNAKER', 'SRS_SHORTHAND', 'SRS_SHORTHAND_NO_SPINNAKER') NOT NULL DEFAULT "SRS_DEFAULT" COMMENT 'Same as row names in boat_info table',
    `boat_start_time` TIME,
    `boat_stop_time` TIME,
    `status` ENUM ('DNC', 'DNS', 'OCS', 'ZFP', 'UFD', 'BFD', 'SCP', 'NSC', 'DNF', 'RET', 'RAF', 'DSQ', 'DNE', 'DGM', 'RDG', 'RCG', 'DPI', 'SNF', 'SAF', 'JOI') NOT NULL DEFAULT "DNS" COMMENT 'Default shall be race_status.DNS',
    UNIQUE INDEX(`race_id`, `boat_id`),
    PRIMARY KEY(`participants_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
ALTER TABLE `participants` ADD FOREIGN KEY (`race_id`) REFERENCES `race` (`race_id`);
ALTER TABLE `participants` ADD FOREIGN KEY (`boat_id`) REFERENCES `boat_info` (`boat_id`);


-- Table that holds the result from tha races
CREATE TABLE IF NOT EXISTS `result` (
    `result_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `race_id` INTEGER UNSIGNED NOT NULL,
    `point` INTEGER UNSIGNED NOT NULL,
    `status` ENUM ('DNC', 'DNS', 'OCS', 'ZFP', 'UFD', 'BFD', 'SCP', 'NSC', 'DNF', 'RET', 'RAF', 'DSQ', 'DNE', 'DGM', 'RDG', 'RCG', 'DPI', 'SNF', 'SAF', 'JOI') COMMENT "See enum status in participants table",
    `skipper_name` VARCHAR(64) NOT NULL,
    `boat_name` VARCHAR(64),
    `boat_type` VARCHAR(64),
    `sail_number` VARCHAR(16) NOT NULL DEFAULT "0",
    `elapsed_time` TIME,
    `corrected_time` TIME,
    `time_behind` TIME,
    `srs_used` DOUBLE,
    PRIMARY KEY(`result_id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;


-- Table that holds the result for the whole season
CREATE TABLE IF NOT EXISTS `season` (
    `season_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `season_name` VARCHAR(32) NOT NULL DEFAULT "Season: ?",
    `season_description` VARCHAR(128),
    `season_start` DATE NOT NULL DEFAULT CURRENT_DATE,
    `season_end` DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE INDEX(`season_name`, `season_description`, `season_start`, `season_end`),
    PRIMARY KEY(`season_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;


-- Table that holds the result for the whole season
CREATE TABLE IF NOT EXISTS `season_data` (
    `season_id` INTEGER UNSIGNED NOT NULL,
    `race_id` INTEGER UNSIGNED NOT NULL,
    UNIQUE INDEX(`season_id`, `race_id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
 ALTER TABLE `season_data` ADD FOREIGN KEY (`race_id`) REFERENCES `race` (`race_id`);
 ALTER TABLE `season_data` ADD FOREIGN KEY (`season_id`) REFERENCES `season` (`season_id`);
