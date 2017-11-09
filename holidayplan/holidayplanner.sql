-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 03, 2017 at 04:27 PM
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

-- --------------------------------------------------------

--
-- Table structure for table `legalholidays`
--

CREATE TABLE `legalholidays` (
  `id` int(11) NOT NULL,
  `startDate` text NOT NULL,
  `name` varchar(1000) CHARACTER SET utf8 NOT NULL,
  `type` varchar(100) NOT NULL DEFAULT 'public'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `management`
--

CREATE TABLE `management` (
  `userID` int(11) NOT NULL,
  `managerID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(11) NOT NULL,
  `password` varchar(200) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `picture` text NOT NULL,
  `age` date NOT NULL,
  `name` varchar(100) NOT NULL,
  `position` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `startDate` date NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `avfreedays` int(11) NOT NULL,
  `bonus` int(11) NOT NULL DEFAULT '0',
  `token` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `password`, `isActive`, `picture`, `age`, `name`, `position`, `email`, `phone`, `startDate`, `admin`, `avfreedays`, `bonus`, `token`) VALUES
(1, 'fb131bc57a477c8c9d068f1ee5622ac304195a77164ccc2d75d82dfe1a727ba8d674ed87f96143b2b416aacefb555e3045c356faa23e6d21de72b85822e39fdd', 1, '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', '0000-00-00', 'Avangarde Software', 'admin', 'admin@admin.com', '', '2017-10-19', 2, 26, 0, '6b327cc1596e47b55e59a013c7078084c17a98fd53c51053800cb37d1d3b1232');

-- --------------------------------------------------------

--
-- Table structure for table `yearset`
--

CREATE TABLE `yearset` (
  `yearid` int(11) NOT NULL,
  `year` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
-- Indexes for table `legalholidays`
--
ALTER TABLE `legalholidays`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `yearset`
--
ALTER TABLE `yearset`
  ADD PRIMARY KEY (`yearid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `freedays`
--
ALTER TABLE `freedays`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `legalholidays`
--
ALTER TABLE `legalholidays`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `yearset`
--
ALTER TABLE `yearset`
  MODIFY `yearid` int(11) NOT NULL AUTO_INCREMENT;
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
