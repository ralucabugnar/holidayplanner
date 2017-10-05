-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 13, 2017 at 04:03 PM
-- Server version: 10.1.25-MariaDB
-- PHP Version: 7.1.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `holidayplanner`
--

-- --------------------------------------------------------

--
-- Table structure for table `freedays`
--

CREATE TABLE `freedays` (
  `id` int(11) NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `days` int(11) NOT NULL,
  `type` varchar(100) NOT NULL,
  `comment` varchar(100) NOT NULL,
  `approved` tinyint(1) NOT NULL,
  `userID` int(11) NOT NULL,
  `approverID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `freedays`
--

INSERT INTO `freedays` (`id`, `isActive`, `startDate`, `endDate`, `days`, `type`, `comment`, `approved`, `userID`, `approverID`) VALUES
(76, 0, '2017-09-18', '2017-09-22', 5, 'Vacation Leave', '', 1, 3, 4),
(77, 0, '2017-09-18', '2017-09-20', 3, 'Sick Leave', '', 1, 3, 4);

-- --------------------------------------------------------

--
-- Table structure for table `legalholidays`
--

CREATE TABLE `legalholidays` (
  `startDate` date NOT NULL,
  `name` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `legalholidays`
--

INSERT INTO `legalholidays` (`startDate`, `name`) VALUES
('2017-01-01', 'Anul nou '),
('2017-01-02', 'A doua zi din anul nou'),
('2017-01-24', 'Ziua unirii'),
('2017-04-17', 'A doua zi de Pasti'),
('2017-05-01', 'Ziua muncii'),
('2017-06-01', 'Ziua copilului'),
('2017-06-05', 'A doua zi de rusalii'),
('2017-07-15', 'Adormirea Maicii Domnului'),
('2017-11-30', 'Sfantul Andrei'),
('2017-12-01', 'Ziua nationala'),
('2017-12-25', 'Craciunul'),
('2017-12-26', 'A doua zi de Craciun');

-- --------------------------------------------------------

--
-- Table structure for table `management`
--

CREATE TABLE `management` (
  `userID` int(11) NOT NULL,
  `managerID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `management`
--

INSERT INTO `management` (`userID`, `managerID`) VALUES
(1, 0),
(3, 4),
(7, 4),
(22, 4),
(23, 4),
(24, 4),
(4, 0),
(35, 4);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(11) NOT NULL,
  `password` varchar(200) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `picture` varchar(100) NOT NULL DEFAULT 'https://avangarde-software.com/wp-content/uploads/2016/11/logo-1.svg',
  `age` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `position` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `startDate` date NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `bonus` int(11) NOT NULL DEFAULT '0',
  `token` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `password`, `isActive`, `picture`, `age`, `name`, `position`, `email`, `phone`, `startDate`, `admin`, `bonus`, `token`) VALUES
(1, 'fb131bc57a477c8c9d068f1ee5622ac304195a77164ccc2d75d82dfe1a727ba8d674ed87f96143b2b416aacefb555e3045c356faa23e6d21de72b85822e39fdd', 0, 'https://avangarde-software.com/wp-content/uploads/2016/11/logo-1.svg', 25, 'ion', 'Manager', 'ion@ion', '101010101', '2017-09-01', 1, 2, '239bfc152fb27aaa75a1f768e920aeffba943db18986d0d50768755d91496772'),
(3, 'fb131bc57a477c8c9d068f1ee5622ac304195a77164ccc2d75d82dfe1a727ba8d674ed87f96143b2b416aacefb555e3045c356faa23e6d21de72b85822e39fdd', 1, 'https://avangarde-software.com/wp-content/uploads/2016/11/logo-1.svg', 25, 'maria25', 'Developer', 'maria@maria', '100000000', '2017-03-09', 0, 0, '879e9eb7725e063ba7208c1f16cbec010d884bec1b1acfdb151b5dfdb2334063'),
(4, 'fb131bc57a477c8c9d068f1ee5622ac304195a77164ccc2d75d82dfe1a727ba8d674ed87f96143b2b416aacefb555e3045c356faa23e6d21de72b85822e39fdd', 1, 'https://avangarde-software.com/wp-content/uploads/2016/11/logo-1.svg', 28, 'alexalex', 'Manager', 'alex@alex', '333', '2017-02-09', 1, 0, '23aaa36f1883f6a31d92b40dae02955a473d26c1522f629f480df5ebb657b5aa'),
(7, 'dce4f6e4ef2f02e31c570fb38d19a17318ed79bcf7c3a006c25583c4333c9697c1ed76d51fbbe146497795fac86a9b6af3fadfc0adcd8e3a9407e4d6509f69cd', 1, 'https://avangarde-software.com/wp-content/uploads/2016/11/logo-1.svg', 30, 'andrei', 'Developer', 'andrei@andrei', '10101010101', '2017-03-09', 0, 0, ''),
(10, 'fb131bc57a477c8c9d068f1ee5622ac304195a77164ccc2d75d82dfe1a727ba8d674ed87f96143b2b416aacefb555e3045c356faa23e6d21de72b85822e39fdd', 1, 'https://avangarde-software.com/wp-content/uploads/2016/11/logo-1.svg', 2, 'Avangarde Software', 'admin', 'admin@admin', '1234', '2015-08-01', 2, 0, '568de1ca1c81388476ee2ba66f49fa9ca1bdcf3fee0ef1bc3a145cccb357d371'),
(21, 'dce4f6e4ef2f02e31c570fb38d19a17318ed79bcf7c3a006c25583c4333c9697c1ed76d51fbbe146497795fac86a9b6af3fadfc0adcd8e3a9407e4d6509f69cd', 1, 'https://avangarde-software.com/wp-content/uploads/2016/11/logo-1.svg', 27, 'Ana', 'Developer', 'ana@ana', '12111111', '2017-09-04', 0, 0, ''),
(22, 'dce4f6e4ef2f02e31c570fb38d19a17318ed79bcf7c3a006c25583c4333c9697c1ed76d51fbbe146497795fac86a9b6af3fadfc0adcd8e3a9407e4d6509f69cd', 1, 'https://avangarde-software.com/wp-content/uploads/2016/11/logo-1.svg', 22, 'Ava', 'Developer', 'ava@ava', '123121312131213', '2017-09-05', 0, 0, ''),
(23, 'dce4f6e4ef2f02e31c570fb38d19a17318ed79bcf7c3a006c25583c4333c9697c1ed76d51fbbe146497795fac86a9b6af3fadfc0adcd8e3a9407e4d6509f69cd', 1, 'https://avangarde-software.com/wp-content/uploads/2016/11/logo-1.svg', 28, 'Florin', 'HR', 'florin@florin', '101010101', '2017-09-01', 0, 0, ''),
(24, 'dce4f6e4ef2f02e31c570fb38d19a17318ed79bcf7c3a006c25583c4333c9697c1ed76d51fbbe146497795fac86a9b6af3fadfc0adcd8e3a9407e4d6509f69cd', 1, 'https://avangarde-software.com/wp-content/uploads/2016/11/logo-1.svg', 28, 'andreea', 'Manager', 'andreea@andreea', '100100010001001', '2017-01-09', 1, 0, ''),
(35, 'dce4f6e4ef2f02e31c570fb38d19a17318ed79bcf7c3a006c25583c4333c9697c1ed76d51fbbe146497795fac86a9b6af3fadfc0adcd8e3a9407e4d6509f69cd', 0, 'https://avangarde-software.com/wp-content/uploads/2016/11/logo-1.svg', 20, 'Florina', 'Developer', 'florina@florinaaa', '111', '2017-01-09', 0, 0, '900ca35208b7225b9c0dbdec0866847eca958e04b5c29fad19a84297d954a2a5');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `freedays`
--
ALTER TABLE `freedays`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userID`),
  ADD KEY `approverId` (`approverID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `freedays`
--
ALTER TABLE `freedays`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `freedays`
--
ALTER TABLE `freedays`
  ADD CONSTRAINT `freedays_ibfk_1` FOREIGN KEY (`approverID`) REFERENCES `user` (`userID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
