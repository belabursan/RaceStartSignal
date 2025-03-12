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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
