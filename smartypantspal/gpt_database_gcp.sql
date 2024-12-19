-- --------------------------------------------------------
-- 主機:                           127.0.0.1
-- 伺服器版本:                        11.3.2-MariaDB - mariadb.org binary distribution
-- 伺服器作業系統:                      Win64
-- HeidiSQL 版本:                  12.6.0.6765
-- --------------------------------------------------------




DROP DATABASE IF EXISTS `gpt_database`;
CREATE DATABASE `gpt_database`;
USE `gpt_database`;





-- 原gpt_database資料表 --

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

CREATE TABLE IF NOT EXISTS `login` (
	`login_id` int(11) NOT NULL AUTO_INCREMENT,
	`username` text CHARACTER SET utf8mb3 COLLATE utf8mb3_german2_ci DEFAULT NULL,
	`password` text CHARACTER SET utf8mb3 COLLATE utf8mb3_german2_ci DEFAULT NULL,
	`email` text CHARACTER SET utf8mb3 COLLATE utf8mb3_german2_ci DEFAULT NULL,
  	`isboss` text CHARACTER SET utf8mb3 COLLATE utf8mb3_german2_ci DEFAULT NULL,
  	`session_id` text CHARACTER SET utf8mb3 COLLATE utf8mb3_german2_ci DEFAULT NULL,
	PRIMARY KEY (`login_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE IF NOT EXISTS `teach_upload` (
  `file_id` int(11) NOT NULL AUTO_INCREMENT,
  `file_path` text CHARACTER SET utf8mb3 COLLATE utf8mb3_german2_ci NOT NULL,
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- 原gpt_database資料表 END --





-- 教師系統資料表(8/19) --

CREATE TABLE concept_lib
(
	concept_id INT NOT NULL AUTO_INCREMENT,
	concept_name text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
	PRIMARY KEY (concept_id)
);

CREATE TABLE class_lib
(
  class_id INT NOT NULL AUTO_INCREMENT,
  class_name text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (class_id)
);

CREATE TABLE exam_lib
(
  exam_id INT NOT NULL AUTO_INCREMENT,
  exam_type text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  start_time datetime ,
  end_time datetime ,
  week INT ,
  class_id INT NOT NULL,
  PRIMARY KEY (exam_id),
  FOREIGN KEY (class_id) REFERENCES class_lib(class_id)
);

CREATE TABLE question_lib
(
  question_id INT NOT NULL AUTO_INCREMENT,
  exam_type text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  content text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
  question_type text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  answer text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  degree text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  isVerified TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (question_id)
);

CREATE TABLE week_concept
(
  week_concept_id INT NOT NULL AUTO_INCREMENT,
  week INT NOT NULL,
  class_id INT NOT NULL,
  concept_id INT NOT NULL,
  PRIMARY KEY (week_concept_id),
  FOREIGN KEY (class_id) REFERENCES class_lib(class_id) ON DELETE CASCADE,
  FOREIGN KEY (concept_id) REFERENCES concept_lib(concept_id) ON DELETE CASCADE
);

CREATE TABLE choicequestion_detail
(
	detail_id INT NOT NULL AUTO_INCREMENT,
	option1 text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
	option2 text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
	option3 text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
	option4 text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
	answer_explain text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
	question_id INT NOT NULL,
	PRIMARY KEY (detail_id),
	FOREIGN KEY (question_id) REFERENCES question_lib(question_id) ON DELETE CASCADE
);

CREATE TABLE class_student
(
  class_student_id INT NOT NULL AUTO_INCREMENT,
  class_id INT NOT NULL,
  login_id INT NOT NULL,
  PRIMARY KEY (class_student_id),
  FOREIGN KEY (class_id) REFERENCES class_lib(class_id) ON DELETE CASCADE,
  FOREIGN KEY (login_id) REFERENCES login(login_id) ON DELETE CASCADE
);

CREATE TABLE record_lib
(
	record_id INT NOT NULL AUTO_INCREMENT,
	record_date text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
	record_time text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
	`username` text CHARACTER SET utf8mb3 COLLATE utf8mb3_german2_ci DEFAULT NULL ,
	record_action text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
	PRIMARY KEY (record_id)
);

CREATE TABLE registry_lib
(
	registry_id INT NOT NULL AUTO_INCREMENT,
	`username` text CHARACTER SET utf8mb3 COLLATE utf8mb3_german2_ci DEFAULT NULL,
	PRIMARY KEY (registry_id)
);


CREATE TABLE question_concept
(
  question_concept_id INT NOT NULL AUTO_INCREMENT,
  question_id INT NOT NULL,
  concept_id INT NOT NULL,
  PRIMARY KEY (question_concept_id),
  FOREIGN KEY (question_id) REFERENCES question_lib(question_id) ON DELETE CASCADE,
  FOREIGN KEY (concept_id) REFERENCES concept_lib(concept_id) ON DELETE CASCADE
);

-- 教師系統資料表(8/19) END --





-- 練習WU(8/19) --



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


-- 傾印  資料表 gpt_database.practice_week 結構
CREATE TABLE IF NOT EXISTS `practice_week` (
  `week_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `practice_id` int(10) unsigned DEFAULT NULL,
  `week` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`week_id`),
  KEY `FK_practice_week_practice_lib` (`practice_id`),
  CONSTRAINT `FK_practice_week_practice_lib` FOREIGN KEY (`practice_id`) REFERENCES `practice_lib` (`practice_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

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
  CONSTRAINT `FK_practice_answer_practice_lib` FOREIGN KEY (`practice_id`) REFERENCES `practice_lib` (`practice_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT FK_practice_answer_question_lib FOREIGN KEY (question_id) REFERENCES question_lib (question_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=253 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

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

-- 練習WU(8/19) END --




-- 建立資料(原gpt_database) --


REPLACE INTO `login` (`login_id`, `email`, `password`, `username`, `isboss`, `session_id`) VALUES
  (1, NULL, '111111', '7113056119', '管理員', 'NOT Login'),
  (2, NULL, '111111', '7113056145', '管理員', 'NOT Login'),
  (3, NULL, 'zxcvbn', '7113056031', '管理員', 'NOT Login'),
  (6, NULL, 'aidslab', '7113000000', '管理員', 'NOT Login');

-- 建立資料(原gpt_database) END --


-- 建立資料(教師系統)

REPLACE INTO `class_lib` (`class_id`, `class_name`) VALUES
	(1, '電腦視覺');

REPLACE INTO `concept_lib` (`concept_id`, `concept_name`) VALUES
	(1, 'default');


REPLACE INTO `exam_lib` (`exam_id`, `exam_type`, `start_time`, `end_time`, `week`, `class_id`) VALUES
	(1, '練習', '2024-08-23 16:52:29', '2024-09-30 16:52:32', 3, 1),
  (2, '練習', '2024-08-25 15:58:21', '2024-09-30 15:58:23', 4, 1),
  (3, '練習', '2024-08-26 11:44:04', '2024-09-30 11:44:05', 5, 1),
  (4, '練習', '2024-09-05 20:55:28', '2024-09-30 20:55:29', 6, 1),
	(5, '練習', '2024-08-26 11:44:04', '2024-09-30 11:44:05', 7, 1);


-- 建立資料(教師系統) END --  
