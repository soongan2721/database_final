-- --------------------------------------------------------
-- 主機:                           127.0.0.1
-- 伺服器版本:                        11.3.2-MariaDB - mariadb.org binary distribution
-- 伺服器作業系統:                      Win64
-- HeidiSQL 版本:                  12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- 傾印 gpt_database 的資料庫結構
CREATE DATABASE IF NOT EXISTS `gpt_database` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `gpt_database`;

-- 傾印  資料表 gpt_database.choicequestion_detail 結構
CREATE TABLE IF NOT EXISTS `choicequestion_detail` (
  `detail_id` int(11) NOT NULL AUTO_INCREMENT,
  `option1` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `option2` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `option3` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `option4` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `answer_explain` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `question_id` int(11) NOT NULL,
  PRIMARY KEY (`detail_id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `choicequestion_detail_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `question_lib` (`question_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在傾印表格  gpt_database.choicequestion_detail 的資料：~4 rows (近似值)
REPLACE INTO `choicequestion_detail` (`detail_id`, `option1`, `option2`, `option3`, `option4`, `answer_explain`, `question_id`) VALUES
	(1, '1', '2', '3', '4', '因為愛', 1),
	(2, '提取特徵', '減少參數量', '幫助模型收斂', '固定學習率', '所以愛', 2),
	(3, '1', '2', '3', '4', '直到夢想到手', 3),
	(4, '使所有圖像都有相同的解析度', '幫助模型的訓練收斂得更快', '使模型可以只處理黑白圖像', '使所有圖像都有相同的尺寸', '放開手', 4);

-- 傾印  資料表 gpt_database.class_lib 結構
CREATE TABLE IF NOT EXISTS `class_lib` (
  `class_id` int(11) NOT NULL AUTO_INCREMENT,
  `class_name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在傾印表格  gpt_database.class_lib 的資料：~3 rows (近似值)
REPLACE INTO `class_lib` (`class_id`, `class_name`) VALUES
	(1, '電腦視覺'),
	(2, '自然語言處理'),
	(3, '組合語言');

-- 傾印  資料表 gpt_database.class_student 結構
CREATE TABLE IF NOT EXISTS `class_student` (
  `class_student_id` int(11) NOT NULL AUTO_INCREMENT,
  `class_id` int(11) NOT NULL,
  `login_id` int(11) NOT NULL,
  PRIMARY KEY (`class_student_id`),
  KEY `class_id` (`class_id`),
  KEY `login_id` (`login_id`),
  CONSTRAINT `class_student_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `class_lib` (`class_id`) ON DELETE CASCADE,
  CONSTRAINT `class_student_ibfk_2` FOREIGN KEY (`login_id`) REFERENCES `login` (`login_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在傾印表格  gpt_database.class_student 的資料：~4 rows (近似值)
REPLACE INTO `class_student` (`class_student_id`, `class_id`, `login_id`) VALUES
	(1, 1, 1),
	(2, 1, 3),
	(3, 1, 4),
	(4, 2, 4);

-- 傾印  資料表 gpt_database.concept_lib 結構
CREATE TABLE IF NOT EXISTS `concept_lib` (
  `concept_id` int(11) NOT NULL AUTO_INCREMENT,
  `concept_name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`concept_id`),
  UNIQUE KEY `concept_name` (`concept_name`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在傾印表格  gpt_database.concept_lib 的資料：~10 rows (近似值)
REPLACE INTO `concept_lib` (`concept_id`, `concept_name`) VALUES
	(1, 'default'),
	(2, '概念2'),
	(3, '概念3'),
	(4, '概念4'),
	(5, '概念5'),
	(6, '概念6'),
	(7, '概念7'),
	(8, '概念8'),
	(9, '概念9'),
	(10, '概念10');

-- 傾印  資料表 gpt_database.db_choiceques_detail 結構
CREATE TABLE IF NOT EXISTS `db_choiceques_detail` (
  `detail_id` int(11) NOT NULL AUTO_INCREMENT,
  `option1` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `option2` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `option3` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `option4` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `answer_explain` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `question_id` int(11) NOT NULL,
  PRIMARY KEY (`detail_id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `db_choiceques_detail_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `db_question_lib` (`question_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在傾印表格  gpt_database.db_choiceques_detail 的資料：~100 rows (近似值)
REPLACE INTO `db_choiceques_detail` (`detail_id`, `option1`, `option2`, `option3`, `option4`, `answer_explain`, `question_id`) VALUES
	(1, '選項A', '選項B', '選項C', '選項D', '這是第 101 題的解釋。', 101),
	(2, '選項A', '選項B', '選項C', '選項D', '這是第 102 題的解釋。', 102),
	(3, '選項A', '選項B', '選項C', '選項D', '這是第 103 題的解釋。', 103),
	(4, '選項A', '選項B', '選項C', '選項D', '這是第 104 題的解釋。', 104),
	(5, '選項A', '選項B', '選項C', '選項D', '這是第 105 題的解釋。', 105),
	(6, '選項A', '選項B', '選項C', '選項D', '這是第 106 題的解釋。', 106),
	(7, '選項A', '選項B', '選項C', '選項D', '這是第 107 題的解釋。', 107),
	(8, '選項A', '選項B', '選項C', '選項D', '這是第 108 題的解釋。', 108),
	(9, '選項A', '選項B', '選項C', '選項D', '這是第 109 題的解釋。', 109),
	(10, '選項A', '選項B', '選項C', '選項D', '這是第 110 題的解釋。', 110),
	(11, '選項A', '選項B', '選項C', '選項D', '這是第 111 題的解釋。', 111),
	(12, '選項A', '選項B', '選項C', '選項D', '這是第 112 題的解釋。', 112),
	(13, '選項A', '選項B', '選項C', '選項D', '這是第 113 題的解釋。', 113),
	(14, '選項A', '選項B', '選項C', '選項D', '這是第 114 題的解釋。', 114),
	(15, '選項A', '選項B', '選項C', '選項D', '這是第 115 題的解釋。', 115),
	(16, '選項A', '選項B', '選項C', '選項D', '這是第 116 題的解釋。', 116),
	(17, '選項A', '選項B', '選項C', '選項D', '這是第 117 題的解釋。', 117),
	(18, '選項A', '選項B', '選項C', '選項D', '這是第 118 題的解釋。', 118),
	(19, '選項A', '選項B', '選項C', '選項D', '這是第 119 題的解釋。', 119),
	(20, '選項A', '選項B', '選項C', '選項D', '這是第 120 題的解釋。', 120),
	(21, '選項A', '選項B', '選項C', '選項D', '這是第 121 題的解釋。', 121),
	(22, '選項A', '選項B', '選項C', '選項D', '這是第 122 題的解釋。', 122),
	(23, '選項A', '選項B', '選項C', '選項D', '這是第 123 題的解釋。', 123),
	(24, '選項A', '選項B', '選項C', '選項D', '這是第 124 題的解釋。', 124),
	(25, '選項A', '選項B', '選項C', '選項D', '這是第 125 題的解釋。', 125),
	(26, '選項A', '選項B', '選項C', '選項D', '這是第 126 題的解釋。', 126),
	(27, '選項A', '選項B', '選項C', '選項D', '這是第 127 題的解釋。', 127),
	(28, '選項A', '選項B', '選項C', '選項D', '這是第 128 題的解釋。', 128),
	(29, '選項A', '選項B', '選項C', '選項D', '這是第 129 題的解釋。', 129),
	(30, '選項A', '選項B', '選項C', '選項D', '這是第 130 題的解釋。', 130),
	(31, '選項A', '選項B', '選項C', '選項D', '這是第 131 題的解釋。', 131),
	(32, '選項A', '選項B', '選項C', '選項D', '這是第 132 題的解釋。', 132),
	(33, '選項A', '選項B', '選項C', '選項D', '這是第 133 題的解釋。', 133),
	(34, '選項A', '選項B', '選項C', '選項D', '這是第 134 題的解釋。', 134),
	(35, '選項A', '選項B', '選項C', '選項D', '這是第 135 題的解釋。', 135),
	(36, '選項A', '選項B', '選項C', '選項D', '這是第 136 題的解釋。', 136),
	(37, '選項A', '選項B', '選項C', '選項D', '這是第 137 題的解釋。', 137),
	(38, '選項A', '選項B', '選項C', '選項D', '這是第 138 題的解釋。', 138),
	(39, '選項A', '選項B', '選項C', '選項D', '這是第 139 題的解釋。', 139),
	(40, '選項A', '選項B', '選項C', '選項D', '這是第 140 題的解釋。', 140),
	(41, '選項A', '選項B', '選項C', '選項D', '這是第 141 題的解釋。', 141),
	(42, '選項A', '選項B', '選項C', '選項D', '這是第 142 題的解釋。', 142),
	(43, '選項A', '選項B', '選項C', '選項D', '這是第 143 題的解釋。', 143),
	(44, '選項A', '選項B', '選項C', '選項D', '這是第 144 題的解釋。', 144),
	(45, '選項A', '選項B', '選項C', '選項D', '這是第 145 題的解釋。', 145),
	(46, '選項A', '選項B', '選項C', '選項D', '這是第 146 題的解釋。', 146),
	(47, '選項A', '選項B', '選項C', '選項D', '這是第 147 題的解釋。', 147),
	(48, '選項A', '選項B', '選項C', '選項D', '這是第 148 題的解釋。', 148),
	(49, '選項A', '選項B', '選項C', '選項D', '這是第 149 題的解釋。', 149),
	(50, '選項A', '選項B', '選項C', '選項D', '這是第 150 題的解釋。', 150),
	(51, '選項A', '選項B', '選項C', '選項D', '這是第 151 題的解釋。', 151),
	(52, '選項A', '選項B', '選項C', '選項D', '這是第 152 題的解釋。', 152),
	(53, '選項A', '選項B', '選項C', '選項D', '這是第 153 題的解釋。', 153),
	(54, '選項A', '選項B', '選項C', '選項D', '這是第 154 題的解釋。', 154),
	(55, '選項A', '選項B', '選項C', '選項D', '這是第 155 題的解釋。', 155),
	(56, '選項A', '選項B', '選項C', '選項D', '這是第 156 題的解釋。', 156),
	(57, '選項A', '選項B', '選項C', '選項D', '這是第 157 題的解釋。', 157),
	(58, '選項A', '選項B', '選項C', '選項D', '這是第 158 題的解釋。', 158),
	(59, '選項A', '選項B', '選項C', '選項D', '這是第 159 題的解釋。', 159),
	(60, '選項A', '選項B', '選項C', '選項D', '這是第 160 題的解釋。', 160),
	(61, '選項A', '選項B', '選項C', '選項D', '這是第 161 題的解釋。', 161),
	(62, '選項A', '選項B', '選項C', '選項D', '這是第 162 題的解釋。', 162),
	(63, '選項A', '選項B', '選項C', '選項D', '這是第 163 題的解釋。', 163),
	(64, '選項A', '選項B', '選項C', '選項D', '這是第 164 題的解釋。', 164),
	(65, '選項A', '選項B', '選項C', '選項D', '這是第 165 題的解釋。', 165),
	(66, '選項A', '選項B', '選項C', '選項D', '這是第 166 題的解釋。', 166),
	(67, '選項A', '選項B', '選項C', '選項D', '這是第 167 題的解釋。', 167),
	(68, '選項A', '選項B', '選項C', '選項D', '這是第 168 題的解釋。', 168),
	(69, '選項A', '選項B', '選項C', '選項D', '這是第 169 題的解釋。', 169),
	(70, '選項A', '選項B', '選項C', '選項D', '這是第 170 題的解釋。', 170),
	(71, '選項A', '選項B', '選項C', '選項D', '這是第 171 題的解釋。', 171),
	(72, '選項A', '選項B', '選項C', '選項D', '這是第 172 題的解釋。', 172),
	(73, '選項A', '選項B', '選項C', '選項D', '這是第 173 題的解釋。', 173),
	(74, '選項A', '選項B', '選項C', '選項D', '這是第 174 題的解釋。', 174),
	(75, '選項A', '選項B', '選項C', '選項D', '這是第 175 題的解釋。', 175),
	(76, '選項A', '選項B', '選項C', '選項D', '這是第 176 題的解釋。', 176),
	(77, '選項A', '選項B', '選項C', '選項D', '這是第 177 題的解釋。', 177),
	(78, '選項A', '選項B', '選項C', '選項D', '這是第 178 題的解釋。', 178),
	(79, '選項A', '選項B', '選項C', '選項D', '這是第 179 題的解釋。', 179),
	(80, '選項A', '選項B', '選項C', '選項D', '這是第 180 題的解釋。', 180),
	(81, '選項A', '選項B', '選項C', '選項D', '這是第 181 題的解釋。', 181),
	(82, '選項A', '選項B', '選項C', '選項D', '這是第 182 題的解釋。', 182),
	(83, '選項A', '選項B', '選項C', '選項D', '這是第 183 題的解釋。', 183),
	(84, '選項A', '選項B', '選項C', '選項D', '這是第 184 題的解釋。', 184),
	(85, '選項A', '選項B', '選項C', '選項D', '這是第 185 題的解釋。', 185),
	(86, '選項A', '選項B', '選項C', '選項D', '這是第 186 題的解釋。', 186),
	(87, '選項A', '選項B', '選項C', '選項D', '這是第 187 題的解釋。', 187),
	(88, '選項A', '選項B', '選項C', '選項D', '這是第 188 題的解釋。', 188),
	(89, '選項A', '選項B', '選項C', '選項D', '這是第 189 題的解釋。', 189),
	(90, '選項A', '選項B', '選項C', '選項D', '這是第 190 題的解釋。', 190),
	(91, '選項A', '選項B', '選項C', '選項D', '這是第 191 題的解釋。', 191),
	(92, '選項A', '選項B', '選項C', '選項D', '這是第 192 題的解釋。', 192),
	(93, '選項A', '選項B', '選項C', '選項D', '這是第 193 題的解釋。', 193),
	(94, '選項A', '選項B', '選項C', '選項D', '這是第 194 題的解釋。', 194),
	(95, '選項A', '選項B', '選項C', '選項D', '這是第 195 題的解釋。', 195),
	(96, '選項A', '選項B', '選項C', '選項D', '這是第 196 題的解釋。', 196),
	(97, '選項A', '選項B', '選項C', '選項D', '這是第 197 題的解釋。', 197),
	(98, '選項A', '選項B', '選項C', '選項D', '這是第 198 題的解釋。', 198),
	(99, '選項A', '選項B', '選項C', '選項D', '這是第 199 題的解釋。', 199),
	(100, '選項A', '選項B', '選項C', '選項D', '這是第 200 題的解釋。', 200);

-- 傾印  資料表 gpt_database.db_courseyearques 結構
CREATE TABLE IF NOT EXISTS `db_courseyearques` (
  `courseYearQues_id` int(11) NOT NULL AUTO_INCREMENT,
  `examYear` year(4) NOT NULL,
  `question_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  PRIMARY KEY (`courseYearQues_id`),
  KEY `question_id` (`question_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `db_courseyearques_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `db_question_lib` (`question_id`) ON DELETE CASCADE,
  CONSTRAINT `db_courseyearques_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `db_course_lib` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在傾印表格  gpt_database.db_courseyearques 的資料：~200 rows (近似值)
REPLACE INTO `db_courseyearques` (`courseYearQues_id`, `examYear`, `question_id`, `course_id`) VALUES
	(1, '2012', 1, 17),
	(2, '2022', 2, 13),
	(3, '2012', 3, 19),
	(4, '2008', 4, 13),
	(5, '2023', 5, 6),
	(6, '2015', 6, 1),
	(7, '2002', 7, 16),
	(8, '2024', 8, 13),
	(9, '2016', 9, 19),
	(10, '2017', 10, 13),
	(11, '2002', 11, 8),
	(12, '2008', 12, 17),
	(13, '2007', 13, 20),
	(14, '2021', 14, 12),
	(15, '2022', 15, 20),
	(16, '2001', 16, 7),
	(17, '2013', 17, 1),
	(18, '2015', 18, 5),
	(19, '2004', 19, 13),
	(20, '2024', 20, 17),
	(21, '2018', 21, 4),
	(22, '2007', 22, 8),
	(23, '2012', 23, 11),
	(24, '2010', 24, 11),
	(25, '2013', 25, 18),
	(26, '2020', 26, 15),
	(27, '2014', 27, 17),
	(28, '2022', 28, 8),
	(29, '2022', 29, 11),
	(30, '2021', 30, 18),
	(31, '2018', 31, 6),
	(32, '2004', 32, 10),
	(33, '2023', 33, 2),
	(34, '2005', 34, 7),
	(35, '2008', 35, 12),
	(36, '2016', 36, 20),
	(37, '2022', 37, 1),
	(38, '2008', 38, 9),
	(39, '2024', 39, 15),
	(40, '2022', 40, 18),
	(41, '2007', 41, 19),
	(42, '2011', 42, 10),
	(43, '2023', 43, 7),
	(44, '2015', 44, 4),
	(45, '2009', 45, 19),
	(46, '2021', 46, 11),
	(47, '2022', 47, 15),
	(48, '2002', 48, 5),
	(49, '2013', 49, 16),
	(50, '2016', 50, 1),
	(51, '2002', 51, 11),
	(52, '2001', 52, 9),
	(53, '2018', 53, 11),
	(54, '2006', 54, 10),
	(55, '2022', 55, 1),
	(56, '2024', 56, 6),
	(57, '2013', 57, 16),
	(58, '2017', 58, 20),
	(59, '2001', 59, 8),
	(60, '2015', 60, 1),
	(61, '2011', 61, 4),
	(62, '2021', 62, 1),
	(63, '2022', 63, 7),
	(64, '2014', 64, 14),
	(65, '2024', 65, 18),
	(66, '2002', 66, 10),
	(67, '2014', 67, 13),
	(68, '2023', 68, 19),
	(69, '2022', 69, 4),
	(70, '2023', 70, 13),
	(71, '2007', 71, 1),
	(72, '2021', 72, 20),
	(73, '2008', 73, 19),
	(74, '2003', 74, 1),
	(75, '2012', 75, 4),
	(76, '2003', 76, 19),
	(77, '2019', 77, 4),
	(78, '2021', 78, 9),
	(79, '2015', 79, 15),
	(80, '2019', 80, 3),
	(81, '2023', 81, 8),
	(82, '2009', 82, 5),
	(83, '2001', 83, 10),
	(84, '2001', 84, 12),
	(85, '2001', 85, 16),
	(86, '2005', 86, 11),
	(87, '2010', 87, 19),
	(88, '2019', 88, 2),
	(89, '2024', 89, 19),
	(90, '2019', 90, 19),
	(91, '2010', 91, 2),
	(92, '2022', 92, 13),
	(93, '2006', 93, 20),
	(94, '2018', 94, 7),
	(95, '2017', 95, 2),
	(96, '2012', 96, 13),
	(97, '2004', 97, 2),
	(98, '2012', 98, 7),
	(99, '2012', 99, 10),
	(100, '2012', 100, 13),
	(101, '2012', 101, 19),
	(102, '2012', 102, 18),
	(103, '2012', 103, 12),
	(104, '2012', 104, 9),
	(105, '2012', 105, 20),
	(106, '2012', 106, 13),
	(107, '2012', 107, 19),
	(108, '2012', 108, 9),
	(109, '2012', 109, 17),
	(110, '2012', 110, 10),
	(111, '2012', 111, 12),
	(112, '2012', 112, 2),
	(113, '2012', 113, 17),
	(114, '2012', 114, 3),
	(115, '2012', 115, 13),
	(116, '2012', 116, 13),
	(117, '2012', 117, 6),
	(118, '2012', 118, 5),
	(119, '2012', 119, 19),
	(120, '2012', 120, 9),
	(121, '2012', 121, 14),
	(122, '2012', 122, 6),
	(123, '2012', 123, 19),
	(124, '2012', 124, 19),
	(125, '2012', 125, 5),
	(126, '2012', 126, 3),
	(127, '2012', 127, 4),
	(128, '2012', 128, 19),
	(129, '2012', 129, 17),
	(130, '2012', 130, 15),
	(131, '2012', 131, 1),
	(132, '2012', 132, 10),
	(133, '2012', 133, 5),
	(134, '2012', 134, 18),
	(135, '2012', 135, 4),
	(136, '2012', 136, 10),
	(137, '2012', 137, 2),
	(138, '2012', 138, 17),
	(139, '2012', 139, 19),
	(140, '2012', 140, 2),
	(141, '2012', 141, 18),
	(142, '2012', 142, 16),
	(143, '2012', 143, 16),
	(144, '2012', 144, 3),
	(145, '2012', 145, 9),
	(146, '2012', 146, 7),
	(147, '2012', 147, 11),
	(148, '2012', 148, 12),
	(149, '2012', 149, 13),
	(150, '2012', 150, 16),
	(151, '2012', 151, 5),
	(152, '2012', 152, 11),
	(153, '2012', 153, 5),
	(154, '2012', 154, 19),
	(155, '2012', 155, 13),
	(156, '2012', 156, 14),
	(157, '2012', 157, 17),
	(158, '2012', 158, 4),
	(159, '2012', 159, 19),
	(160, '2012', 160, 14),
	(161, '2012', 161, 16),
	(162, '2012', 162, 9),
	(163, '2012', 163, 8),
	(164, '2012', 164, 18),
	(165, '2012', 165, 11),
	(166, '2012', 166, 8),
	(167, '2012', 167, 19),
	(168, '2012', 168, 11),
	(169, '2012', 169, 13),
	(170, '2012', 170, 12),
	(171, '2012', 171, 16),
	(172, '2012', 172, 16),
	(173, '2012', 173, 6),
	(174, '2012', 174, 10),
	(175, '2012', 175, 5),
	(176, '2012', 176, 12),
	(177, '2012', 177, 11),
	(178, '2012', 178, 7),
	(179, '2012', 179, 4),
	(180, '2012', 180, 12),
	(181, '2012', 181, 8),
	(182, '2012', 182, 2),
	(183, '2012', 183, 19),
	(184, '2012', 184, 20),
	(185, '2012', 185, 5),
	(186, '2012', 186, 18),
	(187, '2012', 187, 16),
	(188, '2012', 188, 4),
	(189, '2012', 189, 14),
	(190, '2012', 190, 2),
	(191, '2012', 191, 11),
	(192, '2012', 192, 4),
	(193, '2012', 193, 10),
	(194, '2012', 194, 18),
	(195, '2012', 195, 1),
	(196, '2012', 196, 15),
	(197, '2012', 197, 19),
	(198, '2012', 198, 2),
	(199, '2012', 199, 8),
	(200, '2012', 200, 1);

-- 傾印  資料表 gpt_database.db_course_lib 結構
CREATE TABLE IF NOT EXISTS `db_course_lib` (
  `course_id` int(11) NOT NULL AUTO_INCREMENT,
  `course_name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `teacher_id` int(11) NOT NULL,
  PRIMARY KEY (`course_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `db_course_lib_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `db_teacher_lib` (`teacher_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在傾印表格  gpt_database.db_course_lib 的資料：~20 rows (近似值)
REPLACE INTO `db_course_lib` (`course_id`, `course_name`, `teacher_id`) VALUES
	(1, '數學基礎', 9),
	(2, '高等代數', 6),
	(3, '機率與統計', 3),
	(4, '線性代數', 47),
	(5, '微積分', 19),
	(6, '電路分析', 5),
	(7, '程式設計概論', 48),
	(8, '資料結構', 17),
	(9, '計算機網路', 26),
	(10, '操作系統', 40),
	(11, '人工智慧導論', 41),
	(12, '機器學習', 1),
	(13, '深度學習', 42),
	(14, '資料庫系統', 4),
	(15, '軟體工程', 17),
	(16, '嵌入式系統', 9),
	(17, '信號與系統', 11),
	(18, '控制系統', 4),
	(19, '通訊原理', 9),
	(20, '電磁學', 38);

-- 傾印  資料表 gpt_database.db_question_lib 結構
CREATE TABLE IF NOT EXISTS `db_question_lib` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `question_type` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在傾印表格  gpt_database.db_question_lib 的資料：~200 rows (近似值)
REPLACE INTO `db_question_lib` (`question_id`, `content`, `question_type`, `answer`) VALUES
	(1, '這是第 1 題的問題內容。', '簡答題', '這是簡答題答案'),
	(2, '這是第 2 題的問題內容。', '簡答題', '這是簡答題答案'),
	(3, '這是第 3 題的問題內容。', '簡答題', '這是簡答題答案'),
	(4, '這是第 4 題的問題內容。', '簡答題', '這是簡答題答案'),
	(5, '這是第 5 題的問題內容。', '簡答題', '這是簡答題答案'),
	(6, '這是第 6 題的問題內容。', '簡答題', '這是簡答題答案'),
	(7, '這是第 7 題的問題內容。', '簡答題', '這是簡答題答案'),
	(8, '這是第 8 題的問題內容。', '簡答題', '這是簡答題答案'),
	(9, '這是第 9 題的問題內容。', '簡答題', '這是簡答題答案'),
	(10, '這是第 10 題的問題內容。', '簡答題', '這是簡答題答案'),
	(11, '這是第 11 題的問題內容。', '簡答題', '這是簡答題答案'),
	(12, '這是第 12 題的問題內容。', '簡答題', '這是簡答題答案'),
	(13, '這是第 13 題的問題內容。', '簡答題', '這是簡答題答案'),
	(14, '這是第 14 題的問題內容。', '簡答題', '這是簡答題答案'),
	(15, '這是第 15 題的問題內容。', '簡答題', '這是簡答題答案'),
	(16, '這是第 16 題的問題內容。', '簡答題', '這是簡答題答案'),
	(17, '這是第 17 題的問題內容。', '簡答題', '這是簡答題答案'),
	(18, '這是第 18 題的問題內容。', '簡答題', '這是簡答題答案'),
	(19, '這是第 19 題的問題內容。', '簡答題', '這是簡答題答案'),
	(20, '這是第 20 題的問題內容。', '簡答題', '這是簡答題答案'),
	(21, '這是第 21 題的問題內容。', '簡答題', '這是簡答題答案'),
	(22, '這是第 22 題的問題內容。', '簡答題', '這是簡答題答案'),
	(23, '這是第 23 題的問題內容。', '簡答題', '這是簡答題答案'),
	(24, '這是第 24 題的問題內容。', '簡答題', '這是簡答題答案'),
	(25, '這是第 25 題的問題內容。', '簡答題', '這是簡答題答案'),
	(26, '這是第 26 題的問題內容。', '簡答題', '這是簡答題答案'),
	(27, '這是第 27 題的問題內容。', '簡答題', '這是簡答題答案'),
	(28, '這是第 28 題的問題內容。', '簡答題', '這是簡答題答案'),
	(29, '這是第 29 題的問題內容。', '簡答題', '這是簡答題答案'),
	(30, '這是第 30 題的問題內容。', '簡答題', '這是簡答題答案'),
	(31, '這是第 31 題的問題內容。', '簡答題', '這是簡答題答案'),
	(32, '這是第 32 題的問題內容。', '簡答題', '這是簡答題答案'),
	(33, '這是第 33 題的問題內容。', '簡答題', '這是簡答題答案'),
	(34, '這是第 34 題的問題內容。', '簡答題', '這是簡答題答案'),
	(35, '這是第 35 題的問題內容。', '簡答題', '這是簡答題答案'),
	(36, '這是第 36 題的問題內容。', '簡答題', '這是簡答題答案'),
	(37, '這是第 37 題的問題內容。', '簡答題', '這是簡答題答案'),
	(38, '這是第 38 題的問題內容。', '簡答題', '這是簡答題答案'),
	(39, '這是第 39 題的問題內容。', '簡答題', '這是簡答題答案'),
	(40, '這是第 40 題的問題內容。', '簡答題', '這是簡答題答案'),
	(41, '這是第 41 題的問題內容。', '簡答題', '這是簡答題答案'),
	(42, '這是第 42 題的問題內容。', '簡答題', '這是簡答題答案'),
	(43, '這是第 43 題的問題內容。', '簡答題', '這是簡答題答案'),
	(44, '這是第 44 題的問題內容。', '簡答題', '這是簡答題答案'),
	(45, '這是第 45 題的問題內容。', '簡答題', '這是簡答題答案'),
	(46, '這是第 46 題的問題內容。', '簡答題', '這是簡答題答案'),
	(47, '這是第 47 題的問題內容。', '簡答題', '這是簡答題答案'),
	(48, '這是第 48 題的問題內容。', '簡答題', '這是簡答題答案'),
	(49, '這是第 49 題的問題內容。', '簡答題', '這是簡答題答案'),
	(50, '這是第 50 題的問題內容。', '簡答題', '這是簡答題答案'),
	(51, '這是第 51 題的問題內容。', '簡答題', '這是簡答題答案'),
	(52, '這是第 52 題的問題內容。', '簡答題', '這是簡答題答案'),
	(53, '這是第 53 題的問題內容。', '簡答題', '這是簡答題答案'),
	(54, '這是第 54 題的問題內容。', '簡答題', '這是簡答題答案'),
	(55, '這是第 55 題的問題內容。', '簡答題', '這是簡答題答案'),
	(56, '這是第 56 題的問題內容。', '簡答題', '這是簡答題答案'),
	(57, '這是第 57 題的問題內容。', '簡答題', '這是簡答題答案'),
	(58, '這是第 58 題的問題內容。', '簡答題', '這是簡答題答案'),
	(59, '這是第 59 題的問題內容。', '簡答題', '這是簡答題答案'),
	(60, '這是第 60 題的問題內容。', '簡答題', '這是簡答題答案'),
	(61, '這是第 61 題的問題內容。', '簡答題', '這是簡答題答案'),
	(62, '這是第 62 題的問題內容。', '簡答題', '這是簡答題答案'),
	(63, '這是第 63 題的問題內容。', '簡答題', '這是簡答題答案'),
	(64, '這是第 64 題的問題內容。', '簡答題', '這是簡答題答案'),
	(65, '這是第 65 題的問題內容。', '簡答題', '這是簡答題答案'),
	(66, '這是第 66 題的問題內容。', '簡答題', '這是簡答題答案'),
	(67, '這是第 67 題的問題內容。', '簡答題', '這是簡答題答案'),
	(68, '這是第 68 題的問題內容。', '簡答題', '這是簡答題答案'),
	(69, '這是第 69 題的問題內容。', '簡答題', '這是簡答題答案'),
	(70, '這是第 70 題的問題內容。', '簡答題', '這是簡答題答案'),
	(71, '這是第 71 題的問題內容。', '簡答題', '這是簡答題答案'),
	(72, '這是第 72 題的問題內容。', '簡答題', '這是簡答題答案'),
	(73, '這是第 73 題的問題內容。', '簡答題', '這是簡答題答案'),
	(74, '這是第 74 題的問題內容。', '簡答題', '這是簡答題答案'),
	(75, '這是第 75 題的問題內容。', '簡答題', '這是簡答題答案'),
	(76, '這是第 76 題的問題內容。', '簡答題', '這是簡答題答案'),
	(77, '這是第 77 題的問題內容。', '簡答題', '這是簡答題答案'),
	(78, '這是第 78 題的問題內容。', '簡答題', '這是簡答題答案'),
	(79, '這是第 79 題的問題內容。', '簡答題', '這是簡答題答案'),
	(80, '這是第 80 題的問題內容。', '簡答題', '這是簡答題答案'),
	(81, '這是第 81 題的問題內容。', '簡答題', '這是簡答題答案'),
	(82, '這是第 82 題的問題內容。', '簡答題', '這是簡答題答案'),
	(83, '這是第 83 題的問題內容。', '簡答題', '這是簡答題答案'),
	(84, '這是第 84 題的問題內容。', '簡答題', '這是簡答題答案'),
	(85, '這是第 85 題的問題內容。', '簡答題', '這是簡答題答案'),
	(86, '這是第 86 題的問題內容。', '簡答題', '這是簡答題答案'),
	(87, '這是第 87 題的問題內容。', '簡答題', '這是簡答題答案'),
	(88, '這是第 88 題的問題內容。', '簡答題', '這是簡答題答案'),
	(89, '這是第 89 題的問題內容。', '簡答題', '這是簡答題答案'),
	(90, '這是第 90 題的問題內容。', '簡答題', '這是簡答題答案'),
	(91, '這是第 91 題的問題內容。', '簡答題', '這是簡答題答案'),
	(92, '這是第 92 題的問題內容。', '簡答題', '這是簡答題答案'),
	(93, '這是第 93 題的問題內容。', '簡答題', '這是簡答題答案'),
	(94, '這是第 94 題的問題內容。', '簡答題', '這是簡答題答案'),
	(95, '這是第 95 題的問題內容。', '簡答題', '這是簡答題答案'),
	(96, '這是第 96 題的問題內容。', '簡答題', '這是簡答題答案'),
	(97, '這是第 97 題的問題內容。', '簡答題', '這是簡答題答案'),
	(98, '這是第 98 題的問題內容。', '簡答題', '這是簡答題答案'),
	(99, '這是第 99 題的問題內容。', '簡答題', '這是簡答題答案'),
	(100, '這是第 100 題的問題內容。', '簡答題', '這是簡答題答案'),
	(101, '這是第 101 題的問題內容。', '選擇題', '選項B'),
	(102, '這是第 102 題的問題內容。', '選擇題', '選項C'),
	(103, '這是第 103 題的問題內容。', '選擇題', '選項A'),
	(104, '這是第 104 題的問題內容。', '選擇題', '選項C'),
	(105, '這是第 105 題的問題內容。', '選擇題', '選項B'),
	(106, '這是第 106 題的問題內容。', '選擇題', '選項D'),
	(107, '這是第 107 題的問題內容。', '選擇題', '選項C'),
	(108, '這是第 108 題的問題內容。', '選擇題', '選項C'),
	(109, '這是第 109 題的問題內容。', '選擇題', '選項C'),
	(110, '這是第 110 題的問題內容。', '選擇題', '選項D'),
	(111, '這是第 111 題的問題內容。', '選擇題', '選項D'),
	(112, '這是第 112 題的問題內容。', '選擇題', '選項A'),
	(113, '這是第 113 題的問題內容。', '選擇題', '選項B'),
	(114, '這是第 114 題的問題內容。', '選擇題', '選項C'),
	(115, '這是第 115 題的問題內容。', '選擇題', '選項C'),
	(116, '這是第 116 題的問題內容。', '選擇題', '選項A'),
	(117, '這是第 117 題的問題內容。', '選擇題', '選項C'),
	(118, '這是第 118 題的問題內容。', '選擇題', '選項D'),
	(119, '這是第 119 題的問題內容。', '選擇題', '選項C'),
	(120, '這是第 120 題的問題內容。', '選擇題', '選項B'),
	(121, '這是第 121 題的問題內容。', '選擇題', '選項B'),
	(122, '這是第 122 題的問題內容。', '選擇題', '選項A'),
	(123, '這是第 123 題的問題內容。', '選擇題', '選項B'),
	(124, '這是第 124 題的問題內容。', '選擇題', '選項A'),
	(125, '這是第 125 題的問題內容。', '選擇題', '選項D'),
	(126, '這是第 126 題的問題內容。', '選擇題', '選項C'),
	(127, '這是第 127 題的問題內容。', '選擇題', '選項D'),
	(128, '這是第 128 題的問題內容。', '選擇題', '選項B'),
	(129, '這是第 129 題的問題內容。', '選擇題', '選項A'),
	(130, '這是第 130 題的問題內容。', '選擇題', '選項B'),
	(131, '這是第 131 題的問題內容。', '選擇題', '選項D'),
	(132, '這是第 132 題的問題內容。', '選擇題', '選項D'),
	(133, '這是第 133 題的問題內容。', '選擇題', '選項C'),
	(134, '這是第 134 題的問題內容。', '選擇題', '選項D'),
	(135, '這是第 135 題的問題內容。', '選擇題', '選項C'),
	(136, '這是第 136 題的問題內容。', '選擇題', '選項C'),
	(137, '這是第 137 題的問題內容。', '選擇題', '選項D'),
	(138, '這是第 138 題的問題內容。', '選擇題', '選項C'),
	(139, '這是第 139 題的問題內容。', '選擇題', '選項D'),
	(140, '這是第 140 題的問題內容。', '選擇題', '選項C'),
	(141, '這是第 141 題的問題內容。', '選擇題', '選項A'),
	(142, '這是第 142 題的問題內容。', '選擇題', '選項C'),
	(143, '這是第 143 題的問題內容。', '選擇題', '選項C'),
	(144, '這是第 144 題的問題內容。', '選擇題', '選項B'),
	(145, '這是第 145 題的問題內容。', '選擇題', '選項D'),
	(146, '這是第 146 題的問題內容。', '選擇題', '選項C'),
	(147, '這是第 147 題的問題內容。', '選擇題', '選項A'),
	(148, '這是第 148 題的問題內容。', '選擇題', '選項A'),
	(149, '這是第 149 題的問題內容。', '選擇題', '選項C'),
	(150, '這是第 150 題的問題內容。', '選擇題', '選項A'),
	(151, '這是第 151 題的問題內容。', '選擇題', '選項D'),
	(152, '這是第 152 題的問題內容。', '選擇題', '選項B'),
	(153, '這是第 153 題的問題內容。', '選擇題', '選項B'),
	(154, '這是第 154 題的問題內容。', '選擇題', '選項A'),
	(155, '這是第 155 題的問題內容。', '選擇題', '選項C'),
	(156, '這是第 156 題的問題內容。', '選擇題', '選項C'),
	(157, '這是第 157 題的問題內容。', '選擇題', '選項D'),
	(158, '這是第 158 題的問題內容。', '選擇題', '選項D'),
	(159, '這是第 159 題的問題內容。', '選擇題', '選項A'),
	(160, '這是第 160 題的問題內容。', '選擇題', '選項A'),
	(161, '這是第 161 題的問題內容。', '選擇題', '選項B'),
	(162, '這是第 162 題的問題內容。', '選擇題', '選項B'),
	(163, '這是第 163 題的問題內容。', '選擇題', '選項C'),
	(164, '這是第 164 題的問題內容。', '選擇題', '選項A'),
	(165, '這是第 165 題的問題內容。', '選擇題', '選項C'),
	(166, '這是第 166 題的問題內容。', '選擇題', '選項C'),
	(167, '這是第 167 題的問題內容。', '選擇題', '選項C'),
	(168, '這是第 168 題的問題內容。', '選擇題', '選項B'),
	(169, '這是第 169 題的問題內容。', '選擇題', '選項B'),
	(170, '這是第 170 題的問題內容。', '選擇題', '選項D'),
	(171, '這是第 171 題的問題內容。', '選擇題', '選項B'),
	(172, '這是第 172 題的問題內容。', '選擇題', '選項D'),
	(173, '這是第 173 題的問題內容。', '選擇題', '選項B'),
	(174, '這是第 174 題的問題內容。', '選擇題', '選項B'),
	(175, '這是第 175 題的問題內容。', '選擇題', '選項C'),
	(176, '這是第 176 題的問題內容。', '選擇題', '選項C'),
	(177, '這是第 177 題的問題內容。', '選擇題', '選項B'),
	(178, '這是第 178 題的問題內容。', '選擇題', '選項B'),
	(179, '這是第 179 題的問題內容。', '選擇題', '選項D'),
	(180, '這是第 180 題的問題內容。', '選擇題', '選項D'),
	(181, '這是第 181 題的問題內容。', '選擇題', '選項D'),
	(182, '這是第 182 題的問題內容。', '選擇題', '選項C'),
	(183, '這是第 183 題的問題內容。', '選擇題', '選項C'),
	(184, '這是第 184 題的問題內容。', '選擇題', '選項C'),
	(185, '這是第 185 題的問題內容。', '選擇題', '選項A'),
	(186, '這是第 186 題的問題內容。', '選擇題', '選項A'),
	(187, '這是第 187 題的問題內容。', '選擇題', '選項B'),
	(188, '這是第 188 題的問題內容。', '選擇題', '選項A'),
	(189, '這是第 189 題的問題內容。', '選擇題', '選項C'),
	(190, '這是第 190 題的問題內容。', '選擇題', '選項C'),
	(191, '這是第 191 題的問題內容。', '選擇題', '選項A'),
	(192, '這是第 192 題的問題內容。', '選擇題', '選項B'),
	(193, '這是第 193 題的問題內容。', '選擇題', '選項C'),
	(194, '這是第 194 題的問題內容。', '選擇題', '選項D'),
	(195, '這是第 195 題的問題內容。', '選擇題', '選項A'),
	(196, '這是第 196 題的問題內容。', '選擇題', '選項A'),
	(197, '這是第 197 題的問題內容。', '選擇題', '選項D'),
	(198, '這是第 198 題的問題內容。', '選擇題', '選項A'),
	(199, '這是第 199 題的問題內容。', '選擇題', '選項A'),
	(200, '這是第 200 題的問題內容。', '選擇題', '選項D');

-- 傾印  資料表 gpt_database.db_teacher_lib 結構
CREATE TABLE IF NOT EXISTS `db_teacher_lib` (
  `teacher_id` int(11) NOT NULL AUTO_INCREMENT,
  `teacher_name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`teacher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在傾印表格  gpt_database.db_teacher_lib 的資料：~50 rows (近似值)
REPLACE INTO `db_teacher_lib` (`teacher_id`, `teacher_name`) VALUES
	(1, 'Alice Johnson'),
	(2, 'Bob Smith'),
	(3, 'Charlie Brown'),
	(4, 'David Wilson'),
	(5, 'Eva Thompson'),
	(6, 'Fiona Davis'),
	(7, 'George Miller'),
	(8, 'Hannah Moore'),
	(9, 'Ian Taylor'),
	(10, 'Jane Anderson'),
	(11, 'Kevin Lee'),
	(12, 'Laura Thomas'),
	(13, 'Michael White'),
	(14, 'Nancy Harris'),
	(15, 'Oliver Martin'),
	(16, 'Paul Garcia'),
	(17, 'Quinn Clark'),
	(18, 'Rachel Lewis'),
	(19, 'Steven Young'),
	(20, 'Tina Walker'),
	(21, 'Uma Hall'),
	(22, 'Victor Adams'),
	(23, 'Wendy King'),
	(24, 'Xavier Scott'),
	(25, 'Yvonne Green'),
	(26, 'Zachary Perez'),
	(27, 'Amy Baker'),
	(28, 'Brian Carter'),
	(29, 'Chloe Rogers'),
	(30, 'Daniel Kelly'),
	(31, 'Ella Sanchez'),
	(32, 'Frank Ward'),
	(33, 'Grace Rivera'),
	(34, 'Henry Cox'),
	(35, 'Isla Howard'),
	(36, 'Jack Bailey'),
	(37, 'Karen Murphy'),
	(38, 'Leo Bell'),
	(39, 'Mia Cooper'),
	(40, 'Nathan Reed'),
	(41, 'Olivia Murphy'),
	(42, 'Patrick Russell'),
	(43, 'Sophia Evans'),
	(44, 'Thomas Brooks'),
	(45, 'Victoria James'),
	(46, 'William Campbell'),
	(47, 'Zoey Price'),
	(48, 'Liam Peterson'),
	(49, 'Emma Bennett'),
	(50, 'Mason Hughes');

-- 傾印  資料表 gpt_database.exam_lib 結構
CREATE TABLE IF NOT EXISTS `exam_lib` (
  `exam_id` int(11) NOT NULL AUTO_INCREMENT,
  `exam_type` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `week` int(11) DEFAULT NULL,
  `class_id` int(11) NOT NULL,
  PRIMARY KEY (`exam_id`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `exam_lib_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `class_lib` (`class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在傾印表格  gpt_database.exam_lib 的資料：~5 rows (近似值)
REPLACE INTO `exam_lib` (`exam_id`, `exam_type`, `start_time`, `end_time`, `week`, `class_id`) VALUES
	(1, '練習', '2024-08-23 16:52:29', '2024-09-30 16:52:32', 1, 1),
	(2, '練習', '2024-08-25 15:58:21', '2024-09-30 15:58:23', 2, 1),
	(3, '練習', '2024-08-26 11:44:04', '2024-09-30 11:44:05', 3, 1),
	(4, '練習', '2024-09-05 20:55:28', '2024-09-30 20:55:29', 4, 2),
	(5, '練習', '2024-09-05 20:58:47', '2024-09-30 20:58:48', 16, 3);

-- 傾印  資料表 gpt_database.gpt_judge 結構
CREATE TABLE IF NOT EXISTS `gpt_judge` (
  `gpt_response_id` int(11) NOT NULL AUTO_INCREMENT,
  `class` int(11) unsigned DEFAULT NULL,
  `session_range` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `student` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `short_question` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `short_anwser_question` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `anwser_explain` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gpt_response` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`gpt_response_id`)
) ENGINE=InnoDB AUTO_INCREMENT=260 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- 正在傾印表格  gpt_database.gpt_judge 的資料：~0 rows (近似值)

-- 傾印  資料表 gpt_database.helper_conversation_record 結構
CREATE TABLE IF NOT EXISTS `helper_conversation_record` (
  `conversation_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` text DEFAULT NULL,
  `user_query` text DEFAULT NULL,
  `gpt_response` text DEFAULT NULL,
  `user_query_time` datetime DEFAULT NULL,
  `gpt_response_time` datetime DEFAULT NULL,
  PRIMARY KEY (`conversation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在傾印表格  gpt_database.helper_conversation_record 的資料：~0 rows (近似值)

-- 傾印  資料表 gpt_database.inquiry_lib 結構
CREATE TABLE IF NOT EXISTS `inquiry_lib` (
  `inquiry_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createTime` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `student_isRead` tinyint(1) DEFAULT NULL,
  `admin_isRead` tinyint(1) DEFAULT NULL,
  `login_id` int(11) NOT NULL,
  PRIMARY KEY (`inquiry_id`),
  KEY `login_id` (`login_id`),
  CONSTRAINT `inquiry_lib_ibfk_1` FOREIGN KEY (`login_id`) REFERENCES `login` (`login_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在傾印表格  gpt_database.inquiry_lib 的資料：~0 rows (近似值)

-- 傾印  資料表 gpt_database.inquiry_response 結構
CREATE TABLE IF NOT EXISTS `inquiry_response` (
  `response_id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `responseTime` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL,
  `login_id` int(11) NOT NULL,
  `inquiry_id` int(11) NOT NULL,
  PRIMARY KEY (`response_id`),
  KEY `login_id` (`login_id`),
  KEY `inquiry_id` (`inquiry_id`),
  CONSTRAINT `inquiry_response_ibfk_1` FOREIGN KEY (`login_id`) REFERENCES `login` (`login_id`) ON DELETE CASCADE,
  CONSTRAINT `inquiry_response_ibfk_2` FOREIGN KEY (`inquiry_id`) REFERENCES `inquiry_lib` (`inquiry_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在傾印表格  gpt_database.inquiry_response 的資料：~0 rows (近似值)

-- 傾印  資料表 gpt_database.login 結構
CREATE TABLE IF NOT EXISTS `login` (
  `login_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` text CHARACTER SET utf8mb3 COLLATE utf8mb3_german2_ci DEFAULT NULL,
  `password` text CHARACTER SET utf8mb3 COLLATE utf8mb3_german2_ci DEFAULT NULL,
  `email` text CHARACTER SET utf8mb3 COLLATE utf8mb3_german2_ci DEFAULT NULL,
  `isboss` text CHARACTER SET utf8mb3 COLLATE utf8mb3_german2_ci DEFAULT NULL,
  `session_id` text CHARACTER SET utf8mb3 COLLATE utf8mb3_german2_ci DEFAULT NULL,
  PRIMARY KEY (`login_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- 正在傾印表格  gpt_database.login 的資料：~12 rows (近似值)
REPLACE INTO `login` (`login_id`, `username`, `password`, `email`, `isboss`, `session_id`) VALUES
	(1, '7112056097', '123456', NULL, '使用者', 'NOT Login'),
	(2, '7112000000', '000000', NULL, '使用者', 'NOT Login'),
	(3, '7112056092', 'aa880818', NULL, '使用者', 'NOT Login'),
	(4, '7123456789', '123456', NULL, '使用者', 'NOT Login'),
	(5, '7654132987', '123456', NULL, '使用者', 'NOT Login'),
	(6, '7111111111', '111111', NULL, '使用者', 'NOT Login'),
	(7, '7112056099', '123456', NULL, '使用者', 'NOT Login'),
	(8, '7123456788', '123456', NULL, '使用者', 'NOT Login'),
	(9, '7112054090', '123456', NULL, '使用者', 'NOT Login'),
	(10, '7112054091', '123456', NULL, '使用者', 'NOT Login'),
	(11, '7113056458', '666666', NULL, '使用者', 'NOT Login'),
	(12, '7113056145', '111111', NULL, '管理員', 'NOT Login');

-- 傾印  資料表 gpt_database.practice_answer 結構
CREATE TABLE IF NOT EXISTS `practice_answer` (
  `answer_id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) DEFAULT NULL,
  `student_answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `answer_time` float unsigned DEFAULT NULL,
  `isCorrect` tinyint(3) unsigned DEFAULT NULL,
  `practice_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`answer_id`) USING BTREE,
  KEY `FK_practice_answer_practice_lib` (`practice_id`),
  KEY `FK_practice_answer_question_lib` (`question_id`),
  CONSTRAINT `FK_practice_answer_practice_lib` FOREIGN KEY (`practice_id`) REFERENCES `practice_lib` (`practice_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_practice_answer_question_lib` FOREIGN KEY (`question_id`) REFERENCES `question_lib` (`question_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=253 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- 正在傾印表格  gpt_database.practice_answer 的資料：~0 rows (近似值)

-- 傾印  資料表 gpt_database.practice_lib 結構
CREATE TABLE IF NOT EXISTS `practice_lib` (
  `practice_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `class` int(10) DEFAULT NULL,
  `student` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `score` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'N/A',
  `practice_date` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`practice_id`),
  KEY `FK_practice_lib_class_lib` (`class`),
  CONSTRAINT `FK_practice_lib_class_lib` FOREIGN KEY (`class`) REFERENCES `class_lib` (`class_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- 正在傾印表格  gpt_database.practice_lib 的資料：~0 rows (近似值)

-- 傾印  資料表 gpt_database.practice_question 結構
CREATE TABLE IF NOT EXISTS `practice_question` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `practice_id` int(11) unsigned DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_practice_question_question_lib` (`question_id`),
  KEY `FK_practice_question_practice_lib` (`practice_id`),
  CONSTRAINT `FK_practice_question_practice_lib` FOREIGN KEY (`practice_id`) REFERENCES `practice_lib` (`practice_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_practice_question_question_lib` FOREIGN KEY (`question_id`) REFERENCES `question_lib` (`question_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=352 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- 正在傾印表格  gpt_database.practice_question 的資料：~0 rows (近似值)

-- 傾印  資料表 gpt_database.practice_text_answer 結構
CREATE TABLE IF NOT EXISTS `practice_text_answer` (
  `answer_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `question_id` int(11) DEFAULT NULL,
  `student_answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gpt_answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gpt_explain` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `answer_time` float DEFAULT NULL,
  `practice_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`answer_id`),
  KEY `FK_practice_text_answer_practice_lib` (`practice_id`),
  KEY `FK_practice_text_answer_question_lib` (`question_id`),
  CONSTRAINT `FK_practice_text_answer_practice_lib` FOREIGN KEY (`practice_id`) REFERENCES `practice_lib` (`practice_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_practice_text_answer_question_lib` FOREIGN KEY (`question_id`) REFERENCES `question_lib` (`question_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- 正在傾印表格  gpt_database.practice_text_answer 的資料：~0 rows (近似值)

-- 傾印  資料表 gpt_database.practice_week 結構
CREATE TABLE IF NOT EXISTS `practice_week` (
  `week_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `practice_id` int(10) unsigned DEFAULT NULL,
  `week` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`week_id`),
  KEY `FK_practice_week_practice_lib` (`practice_id`),
  CONSTRAINT `FK_practice_week_practice_lib` FOREIGN KEY (`practice_id`) REFERENCES `practice_lib` (`practice_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- 正在傾印表格  gpt_database.practice_week 的資料：~0 rows (近似值)

-- 傾印  資料表 gpt_database.question_concept 結構
CREATE TABLE IF NOT EXISTS `question_concept` (
  `question_concept_id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL,
  `concept_id` int(11) NOT NULL,
  PRIMARY KEY (`question_concept_id`),
  KEY `question_id` (`question_id`),
  KEY `concept_id` (`concept_id`),
  CONSTRAINT `question_concept_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `question_lib` (`question_id`) ON DELETE CASCADE,
  CONSTRAINT `question_concept_ibfk_2` FOREIGN KEY (`concept_id`) REFERENCES `concept_lib` (`concept_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在傾印表格  gpt_database.question_concept 的資料：~7 rows (近似值)
REPLACE INTO `question_concept` (`question_concept_id`, `question_id`, `concept_id`) VALUES
	(1, 1, 2),
	(2, 1, 3),
	(3, 2, 3),
	(4, 3, 5),
	(5, 3, 6),
	(6, 4, 7),
	(7, 5, 7);

-- 傾印  資料表 gpt_database.question_lib 結構
CREATE TABLE IF NOT EXISTS `question_lib` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `exam_type` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `question_type` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `degree` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isVerified` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在傾印表格  gpt_database.question_lib 的資料：~5 rows (近似值)
REPLACE INTO `question_lib` (`question_id`, `exam_type`, `content`, `question_type`, `answer`, `degree`, `isVerified`) VALUES
	(1, '練習', '下列哪一個符合梯度下降的意義?', '選擇題', 'B', '容易', 0),
	(2, '測驗', '下列哪一個符合卷積的意義?', '選擇題', 'A', '容易', 0),
	(3, '測驗', '下列哪一個符合池化的意義?', '選擇題', 'C', '容易', 0),
	(4, '練習', '在電腦視覺中為甚麼做資料正規化?', '選擇題', 'B', '容易', 0),
	(5, '練習', '簡答題測試?', '簡答題', NULL, '普通', 0);

-- 傾印  資料表 gpt_database.record_lib 結構
CREATE TABLE IF NOT EXISTS `record_lib` (
  `record_id` int(11) NOT NULL AUTO_INCREMENT,
  `record_date` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `record_time` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` text CHARACTER SET utf8mb3 COLLATE utf8mb3_german2_ci DEFAULT NULL,
  `record_action` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`record_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在傾印表格  gpt_database.record_lib 的資料：~0 rows (近似值)

-- 傾印  資料表 gpt_database.registry_lib 結構
CREATE TABLE IF NOT EXISTS `registry_lib` (
  `registry_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` text CHARACTER SET utf8mb3 COLLATE utf8mb3_german2_ci DEFAULT NULL,
  PRIMARY KEY (`registry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在傾印表格  gpt_database.registry_lib 的資料：~2 rows (近似值)
REPLACE INTO `registry_lib` (`registry_id`, `username`) VALUES
	(1, '7113056145'),
	(2, '7113056119');

-- 傾印  資料表 gpt_database.teach_upload 結構
CREATE TABLE IF NOT EXISTS `teach_upload` (
  `file_id` int(11) NOT NULL AUTO_INCREMENT,
  `file_path` text CHARACTER SET utf8mb3 COLLATE utf8mb3_german2_ci NOT NULL,
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- 正在傾印表格  gpt_database.teach_upload 的資料：~0 rows (近似值)

-- 傾印  資料表 gpt_database.test_answer 結構
CREATE TABLE IF NOT EXISTS `test_answer` (
  `anwser_id` int(11) NOT NULL AUTO_INCREMENT,
  `class` int(11) unsigned DEFAULT NULL,
  `week` int(11) DEFAULT NULL,
  `degree` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `student` text CHARACTER SET utf8mb3 COLLATE utf8mb3_german2_ci DEFAULT NULL,
  `student_anwser` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `question_id_csv` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `anwser_date` datetime DEFAULT NULL,
  `total_score` int(11) DEFAULT NULL,
  PRIMARY KEY (`anwser_id`)
) ENGINE=InnoDB AUTO_INCREMENT=215 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- 正在傾印表格  gpt_database.test_answer 的資料：~0 rows (近似值)

-- 傾印  資料表 gpt_database.week_concept 結構
CREATE TABLE IF NOT EXISTS `week_concept` (
  `week_concept_id` int(11) NOT NULL AUTO_INCREMENT,
  `week` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `concept_id` int(11) NOT NULL,
  PRIMARY KEY (`week_concept_id`),
  KEY `class_id` (`class_id`),
  KEY `concept_id` (`concept_id`),
  CONSTRAINT `week_concept_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `class_lib` (`class_id`) ON DELETE CASCADE,
  CONSTRAINT `week_concept_ibfk_2` FOREIGN KEY (`concept_id`) REFERENCES `concept_lib` (`concept_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 正在傾印表格  gpt_database.week_concept 的資料：~2 rows (近似值)
REPLACE INTO `week_concept` (`week_concept_id`, `week`, `class_id`, `concept_id`) VALUES
	(1, 1, 1, 2),
	(2, 3, 1, 3);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
