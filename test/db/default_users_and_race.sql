-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Värd: database:3306
-- Tid vid skapande: 26 mars 2024 kl 12:33
-- Serverversion: 10.6.17-MariaDB-1:10.6.17+maria~ubu2004
-- PHP-version: 8.2.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


INSERT INTO `user_info` (`user_id`, `uuid`, `name`, `email`, `phone`, `role`, `pass_hash`, `last_login`) VALUES
(2, '8922dece-eb66-11ee-ae08-0242ac130032', 'Burszan', 'burszan@gmail.com', '+4670012348', 'SYSADMIN', '$2b$10$YovcPzXHqS2R2STMLgQ/n.4wzoKPryz3gJ2cXEmwmqK3pmt8uq2Ky', '2024-03-26 11:46:51'),
(3, '94f9a0ef-eb66-11ee-ae08-0242ac130032', 'Johan', 'johan@gmail.com', '+4670012348', 'USER', '$2b$10$1aZZxzSvJQKpMhxQqFtz0urCPhLQ5N/TlRUNcYBy1M6HMslkYRJae', '2024-03-26 11:47:11'),
(4, 'be39e146-eb66-11ee-ae08-0242ac130032', 'Camilla', 'camilla@gmail.com', '+4670012348', 'USER', '$2b$10$8.uW7qBx4tvx1CndL5jowuqb9/PPLmxDRFDH/LxyCX5.iPTSsIY1a', '2024-03-26 11:48:20'),
(5, 'c770e4e5-eb66-11ee-ae08-0242ac130032', 'Runar', 'runar@gmail.com', '+4670012348', 'USER', '$2b$10$YqPS02JCWZIFthlZWGaEreiIzBin9e9HxNxBXnOFdNNzD8v6tr3cS', '2024-03-26 11:48:35'),
(6, 'cee9d9d9-eb66-11ee-ae08-0242ac130032', 'Alex', 'alex@gmail.com', '+4670012348', 'USER', '$2b$10$7Nhrc2GIUr2sIt1OnB0w6.xwPEaXb6ic0KhaS6/aE2cJR8OC5vrWa', '2024-03-26 11:48:48'),
(7, 'dbe126ab-eb66-11ee-ae08-0242ac130032', 'Dennis', 'dennis@gmail.com', '+4670012348', 'USER', '$2b$10$/XSngKPCZUmAV.x1ztKcRuaWPPrrBdjVNKhYtYwS8i9N/fuzP4hFa', '2024-03-26 11:49:10'),
(8, 'e5fc77fc-eb66-11ee-ae08-0242ac130032', 'Mattias', 'mattias@gmail.com', '+4670012348', 'USER', '$2b$10$JuUsxjls9puU4QSxUIBEAOMk5.zIi/EvnNq37jxYQMhvQ1ThLeRtC', '2024-03-26 11:49:27'),
(9, 'f4461704-eb66-11ee-ae08-0242ac130032', 'Peter', 'peter@gmail.com', '+4670012348', 'USER', '$2b$10$X7w1284er.dbl6Ewo.MBF.fAwVmXF3A4fBTE.mXg3G72eWNb1muUy', '2024-03-26 11:49:51');

INSERT INTO `boat_info` (`boat_id`, `user_id`, `type`, `name`, `sail_number`, `srs_shorthand_no_flying`, `srs_shorthand`, `srs_no_flying`, `srs_default`, `skipper_name`) VALUES
(2, 2, 'Banner 30', 'Hobo', 'SWE48', 2.95, 0.96, 0.97, 0.98, 'Buri'),
(3, 3, 'Ohlsson 26', 'Smulan', '77', 0.699, 0.711, 0.722, 0.755, 'JohanS'),
(4, 4, 'Express', 'Alba', '88', 0.7, 0.711, 0.722, 0.733, 'Camilla'),
(5, 5, 'LM Racer', 'Terrapi', '1', 0.8, 0.811, 0.822, 0.833, 'Runar'),
(6, 6, 'Express', 'Eurobulk', '55', 0.8, 0.811, 0.822, 0.833, 'Alex'),
(7, 7, 'Omega 30', 'Omi', '44', 0.9, 0.911, 0.922, 0.933, 'Dennis'),
(8, 8, 'Elan 33', 'Eli', '33', 0.95, 0.951, 0.952, 0.953, 'Mattias'),
(9, 9, 'Dehler 37', 'Deli', '22', 1, 1.11, 1.22, 1.33, 'Peter');

INSERT INTO `harbor` (`harbor_id`, `harbor_name`, `city`) VALUES
(3, 'Lagunen, Malmö', 'Malmö'),
(2, 'Lomma Hamn', 'Lomma');

INSERT INTO `startline` (`startline_id`, `startline_name`, `harbor_id`, `lon_start_flag`, `lat_start_flag`, `lon_signal_boat`, `lat_signal_boat`, `lon_first_mark`, `lat_first_mark`) VALUES
(2, 'Lomma Hamns Torsdagsrace', 2, 12.66789, 55.1634567, 12.66789, 55.1634567, 12.66789, 55.1634567),
(3, 'Lagunens Onsdagsrace', 3, 12.66789, 55.1634567, 12.66789, 55.1634567, 12.66789, 55.1634567);

INSERT INTO `race` (`race_id`, `race_name`, `description`, `start_line`, `race_type`, `race_date`, `race_start_time`, `race_stop_time`, `race_course`, `status`, `wind_direction`, `wind_strength`, `race_set_by`, `admin_lock`) VALUES
(2, 'Onsdagsrace', 'Klubbsegling Lagunen', 3, '5-4-1-0', '2023-03-26', '13:00:00', '14:00:01', 'R1-R6-R7_M', 'FINISHED', 255, 5, 2, NULL),
(3, 'Onsdagsrace', 'Klubbsegling Lagunen', 3, '5-4-1-0', '2023-04-26', '13:00:00', '14:00:01', 'R1-R4-R6_M', 'FINISHED', 215, 6, 2, NULL),
(4, 'Onsdagsrace', 'Klubbsegling Lagunen', 3, '5-4-1-0', '2023-05-26', '13:00:00', '14:00:01', 'R1-R10-R2_M', 'FINISHED', 15, 4, 2, NULL),
(5, 'Onsdagsrace', 'Klubbsegling Lagunen', 3, '5-4-1-0', '2023-06-26', '13:00:00', '14:00:01', 'R1-R11-R6_M', 'FINISHED', 65, 7, 2, NULL),
(6, 'Onsdagsrace', 'Klubbsegling Lagunen', 3, '5-4-1-0', '2023-07-26', '13:00:00', '14:00:01', 'R1-R4-R8_M', 'FINISHED', 61, 6, 2, NULL),
(7, 'Onsdagsrace', 'Klubbsegling Lagunen', 3, '5-4-1-0', '2023-08-26', '13:00:00', '14:00:01', 'R1-R5-R8_M', 'FINISHED', 91, 5, 2, NULL),
(8, 'Onsdagsrace', 'Klubbsegling Lagunen', 3, '5-4-1-0', '2023-09-26', '13:00:00', '14:00:01', 'R1-R7-R8_M', 'STARTED', 91, 5, 2, NULL);

INSERT INTO `season` (`season_id`, `season_name`, `season_description`, `season_start`, `season_end`) VALUES
(2, 'Season 2024', 'Season 2024 Klubbsegling', '2024-03-01', '2024-10-01');

INSERT INTO `season_data` (`season_id`, `race_id`) VALUES
(2, 2),
(2, 3),
(2, 4),
(2, 5),
(2, 6),
(2, 7),
(2, 8);

INSERT INTO `participants` (`participants_id`, `race_id`, `boat_id`, `srs_type`, `boat_start_time`, `boat_stop_time`, `status`) VALUES
(2, 2, 2, 'SRS_DEFAULT', '13:00:09', '13:52:50', 'SNF'),
(3, 2, 3, 'SRS_NO_SPINNAKER', '12:59:07', '13:55:08', 'SNF'),
(4, 2, 4, 'SRS_SHORTHAND', '13:01:01', '13:56:43', 'SNF'),
(5, 2, 5, 'SRS_SHORTHAND_NO_SPINNAKER', '13:05:05', NULL, 'SNF'),
(6, 2, 6, 'SRS_DEFAULT', '12:59:33', '14:44:44', 'SNF'),
(7, 2, 7, 'SRS_NO_SPINNAKER', NULL, NULL, 'JOI'),
(8, 3, 2, 'SRS_DEFAULT', '13:00:04', '13:42:50', 'SNF'),
(9, 3, 3, 'SRS_NO_SPINNAKER', '13:00:07', '13:59:08', 'SNF'),
(10, 3, 4, 'SRS_DEFAULT', '13:00:21', '13:54:41', 'SNF'),
(11, 3, 5, 'SRS_DEFAULT', '13:01:05', '13:58:00', 'SNF'),
(12, 3, 6, 'SRS_NO_SPINNAKER', '13:00:33', '14:00:00', 'SNF'),
(13, 4, 7, 'SRS_SHORTHAND', '13:01:01', '13:52:58', 'SNF'),
(14, 4, 5, 'SRS_DEFAULT', '13:00:09', '13:59:09', 'SNF'),
(15, 4, 4, 'SRS_SHORTHAND', '13:01:01', '13:56:13', 'SNF'),
(16, 5, 9, 'SRS_NO_SPINNAKER', '13:01:01', '13:50:13', 'SNF'),
(17, 5, 2, 'SRS_DEFAULT', '13:01:04', '13:52:50', 'SNF'),
(18, 6, 3, 'SRS_NO_SPINNAKER', '13:00:47', '13:57:08', 'SNF'),
(19, 6, 5, 'SRS_NO_SPINNAKER', '13:01:09', '13:57:09', 'SNF'),
(20, 5, 4, 'SRS_SHORTHAND', '13:01:51', '14:04:44', 'SNF'),
(21, 4, 2, 'SRS_DEFAULT', '13:00:49', '13:50:50', 'SNF'),
(22, 6, 2, 'SRS_NO_SPINNAKER', '13:10:09', '13:53:50', 'SNF');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
