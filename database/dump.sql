-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: bug_tracker_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bugs`
--

DROP TABLE IF EXISTS `bugs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bugs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `priority` enum('LOW','MEDIUM','HIGH') NOT NULL,
  `status` enum('OPEN','IN_PROGRESS','FIXED') DEFAULT 'OPEN',
  `created_by` int NOT NULL,
  `assigned_to` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `bug_screenshot` varchar(255) DEFAULT NULL,
  `bug_video` varchar(255) DEFAULT NULL,
  `code_file` varchar(255) DEFAULT NULL,
  `code_line` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `assigned_to` (`assigned_to`),
  CONSTRAINT `bugs_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bugs_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bugs`
--

LOCK TABLES `bugs` WRITE;
/*!40000 ALTER TABLE `bugs` DISABLE KEYS */;
INSERT INTO `bugs` VALUES (1,'Login button not working','User cannot login after entering valid credentials.','HIGH','FIXED',3,2,'2026-08-27 07:14:49','2026-08-27 07:14:49',NULL,NULL,NULL,NULL),(2,'Database connection bottleneck 1787816788399','High latency in DB connection pool under heavy load.','HIGH','FIXED',3,6,'2026-08-27 07:46:28','2026-08-27 07:46:28',NULL,NULL,NULL,NULL),(3,'search bar','search bar me text show nahi ho raha hai aur search bar par click karne ke bad search bar ka size small ho jaa raha hai','HIGH','FIXED',7,7,'2026-08-27 07:50:10','2026-08-27 07:57:55',NULL,NULL,NULL,NULL),(4,'Checkout total calculation error 1787818241327','Cart total does not update when tax rate changes.','HIGH','FIXED',8,2,'2026-08-27 08:10:41','2026-08-27 08:10:41',NULL,NULL,NULL,NULL),(5,'Fake bug impersonation attempt','Testing if backend ignores body created_by.','MEDIUM','IN_PROGRESS',8,7,'2026-08-27 08:10:41','2026-08-27 08:15:24',NULL,NULL,NULL,NULL),(6,'Text-only UI layout issue','Sidebar alignment shifts on small screens.','LOW','IN_PROGRESS',3,7,'2026-08-27 09:33:08','2026-08-27 09:52:48',NULL,NULL,NULL,NULL),(7,'Video player freeze on full screen toggle','Player freezes when toggling fullscreen rapidly. Screenshot and recording attached.','HIGH','IN_PROGRESS',3,7,'2026-08-27 09:33:08','2026-08-27 09:52:45','/uploads/evidence-1787823188144-831764603.png','/uploads/evidence-1787823188145-400131199.mp4',NULL,NULL),(8,'Login page validation bug','Login form allows empty submit without error banner.','HIGH','IN_PROGRESS',3,2,'2026-08-27 09:39:25','2026-08-27 09:39:25',NULL,NULL,'frontend/src/pages/Login.jsx',42),(9,'Navbar alignment glitch on mobile','Header icons overflow on screens narrower than 400px.','MEDIUM','FIXED',3,2,'2026-08-27 09:47:36','2026-08-27 09:47:36',NULL,NULL,'frontend/src/components/Navbar.jsx',15),(10,'Payment gateway timeout on checkout','Checkout page hangs when selecting credit card.','HIGH','FIXED',3,2,'2026-08-27 09:59:07','2026-08-27 09:59:07',NULL,NULL,'frontend/src/pages/CreateBug.jsx',15),(11,'button not working','button not working','MEDIUM','IN_PROGRESS',9,7,'2026-08-27 10:06:41','2026-08-27 10:07:22','/uploads/evidence-1787825201854-909933414.png',NULL,NULL,NULL),(12,'Dropdown menu overlaps header on resize','When window width is under 600px, navigation dropdown covers the logo.','MEDIUM','FIXED',3,2,'2026-08-27 10:16:48','2026-08-27 10:16:48',NULL,NULL,NULL,NULL),(13,'Profile avatar fails to render','User avatar image broken after upload.','LOW','FIXED',3,2,'2026-08-27 10:41:16','2026-08-27 10:41:16',NULL,NULL,NULL,NULL),(14,'Profile avatar fails to render','User avatar image broken after upload.','LOW','FIXED',3,2,'2026-08-27 10:51:41','2026-08-27 10:51:41',NULL,NULL,NULL,NULL),(15,'MySQL persistent state test issue','Verifying row insertion in MySQL bugs table.','HIGH','FIXED',11,2,'2026-08-27 10:56:19','2026-08-27 10:56:19',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `bugs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','developer','tester') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'System Admin','admin@example.com','$2a$10$5Pi8K7GQrGCJaVCNEy85XuC3sV94mtCJYf2CB3GYHqqQQVy6UJZXa','admin','2026-08-27 07:14:06','2026-08-27 07:14:06'),(2,'Amit','amit@example.com','$2a$10$LoW6V0fkZFAktssVORDwKe5UL9xoxZRktiCtg0zF8OVhnsOCigR6i','developer','2026-08-27 07:14:49','2026-08-27 07:14:49'),(3,'Rahul','rahul@example.com','$2a$10$qY1IcEPRESQAwxgicHGVAOrEASS28mdpH2sXsJ9xN3PmcjhfMfspC','tester','2026-08-27 07:14:49','2026-08-27 07:14:49'),(4,'Ravi','ravi@example.com','$2a$10$Cgncz3Th/PHVIQK.a9D3vehsZxg7w/OdNYpti30Q4gniMxXjk4FSm','developer','2026-08-27 07:14:49','2026-08-27 07:14:49'),(5,'eashan abc','eashan76@gmail.com','$2a$10$w.RUgX33LMeX99uoDJDAMe2b.FU6ZU1Agxa55lf2SZLjCalO.S2Au','developer','2026-08-27 07:28:36','2026-08-27 07:28:36'),(6,'Suresh Dev','dev_1787816788021@example.com','$2a$10$y66GAhKHUM.iQDt8fZIhl.M5yVSsVoxzN5PdkHdMBEuU1d/3Uyr3.','developer','2026-08-27 07:46:28','2026-08-27 07:46:28'),(7,'banti kumar goswami','bk6107310@gmail.com','$2a$10$WbR46MWCKx.TCcWob3P.YO4uJ/Ev0WYKemM4vv749qgN4Tae0HoSm','developer','2026-08-27 07:47:08','2026-08-27 07:47:08'),(8,'Priya Tester','tester_1787818241043@example.com','$2a$10$T2xiaR21xjl.7zG32Vn1aegsFLX26FDMp554Ui2k6VUDIyGcDZxfK','tester','2026-08-27 08:10:41','2026-08-27 08:10:41'),(9,'nikhil kumar','nikhil@12gmail.com','$2a$10$xOmYIBZTvdsTg4CRrfLFPe948fLDDYM78IKJWY1bcKeVFsN2foC1C','tester','2026-08-27 08:12:44','2026-08-27 08:12:44'),(10,'Priya Tester','tester_1787828161606@example.com','$2a$10$AzDEOcxmVlrDprAtY8QkO.hix6LR/ODgQ3jFD1VfMQVXJMDGBoHxa','tester','2026-08-27 10:56:01','2026-08-27 10:56:01'),(11,'Priya Tester','tester_1787828179124@example.com','$2a$10$4tsovdKxLf5DWIsypTcuEebFk6ZJt2hh8nUqTKjOF79uY.ZzwwT2.','tester','2026-08-27 10:56:19','2026-08-27 10:56:19');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-27 16:27:36
