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
	concept_name text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
	PRIMARY KEY (concept_id),
	UNIQUE (concept_name)
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





-- 後臺系統資料表 --

CREATE TABLE inquiry_lib
(
	inquiry_id INT NOT NULL AUTO_INCREMENT,
	title text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
	content text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
	createTime text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
	student_isRead TINYINT(1) DEFAULT NULL,
	admin_isRead TINYINT(1) DEFAULT NULL,

	login_id INT NOT NULL,

	PRIMARY KEY (inquiry_id),
	FOREIGN KEY (login_id) REFERENCES login(login_id) ON DELETE CASCADE
);

CREATE TABLE inquiry_response
(
	response_id INT NOT NULL AUTO_INCREMENT,
	content text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
	responseTime text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
	isAdmin TINYINT(1) DEFAULT NULL, -- 用於檢查該resonpse是管理員還是學生所回
	
	login_id INT NOT NULL,
	inquiry_id INT NOT NULL,

	PRIMARY KEY (response_id),
	FOREIGN KEY (login_id) REFERENCES login(login_id) ON DELETE CASCADE,
	FOREIGN KEY (inquiry_id) REFERENCES inquiry_lib(inquiry_id) ON DELETE CASCADE
);
-- -- 





-- 小幫手 --
CREATE TABLE IF NOT EXISTS `helper_conversation_record` (
  `conversation_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` text DEFAULT NULL,
  `user_query` text DEFAULT NULL,
  `gpt_response` text DEFAULT NULL,
  `user_query_time` datetime DEFAULT NULL,
  `gpt_response_time` datetime DEFAULT NULL,
  PRIMARY KEY (`conversation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- --

-- 資料庫期末資料表 --

CREATE TABLE DB_teacher_lib
(
  teacher_id INT NOT NULL AUTO_INCREMENT,
  teacher_name text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,

  PRIMARY KEY (teacher_id)
);

CREATE TABLE DB_course_lib
(
  course_id INT NOT NULL AUTO_INCREMENT,
  course_name text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
  teacher_id INT NOT NULL,

  PRIMARY KEY (course_id),
  FOREIGN KEY (teacher_id) REFERENCES DB_teacher_lib(teacher_id) ON DELETE CASCADE
);

CREATE TABLE DB_question_lib
(
  question_id INT NOT NULL AUTO_INCREMENT,
  content text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
  question_type text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  answer text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,

  PRIMARY KEY (question_id)
);

CREATE TABLE DB_choiceQues_detail
(
	detail_id INT NOT NULL AUTO_INCREMENT,
	option1 text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
	option2 text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
	option3 text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
	option4 text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
	answer_explain text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
	question_id INT NOT NULL,

	PRIMARY KEY (detail_id),
	FOREIGN KEY (question_id) REFERENCES DB_question_lib(question_id) ON DELETE CASCADE
);

CREATE TABLE DB_courseYearQues
(
  courseYearQues_id INT NOT NULL AUTO_INCREMENT,
  examYear INT NOT NULL,
  question_id INT NOT NULL,
  course_id INT NOT NULL,

  PRIMARY KEY (courseYearQues_id),
  FOREIGN KEY (question_id) REFERENCES DB_question_lib(question_id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES DB_course_lib(course_id) ON DELETE CASCADE
);

-- 資料庫期末資料表 --





-- 建立資料(原gpt_database) --

REPLACE INTO `login` (`login_id`, `email`, `password`, `username`, `isboss`, `session_id`) VALUES
	(1, NULL, '123456', '7112056097', '使用者', 'NOT Login'),
	(2, NULL, '000000', '7112000000', '使用者', 'NOT Login'),
	(3, NULL, 'aa880818', '7112056092', '使用者', 'NOT Login'),
	(4, NULL, '123456', '7123456789', '使用者', 'NOT Login'),
	(5, NULL, '123456', '7654132987', '使用者', 'NOT Login'),
	(6, NULL, '111111', '7111111111', '使用者', 'NOT Login'),
	(7, NULL, '123456', '7112056099', '使用者', 'NOT Login'),
	(8, NULL, '123456', '7123456788', '使用者', 'NOT Login'),
	(9, NULL, '123456', '7112054090', '使用者', 'NOT Login'),
	(10, NULL, '123456', '7112054091', '使用者', 'NOT Login'),
	(11, NULL, '666666', '7113056458', '使用者', 'NOT Login'),
  (12, NULL, '111111', '7113056145', '管理員', 'NOT Login');

-- 建立資料(原gpt_database) END --





-- 建立資料(教師系統)

REPLACE INTO `class_lib` (`class_id`, `class_name`) VALUES
	(1, '電腦視覺'),
	(2, '自然語言處理'),
	(3, '組合語言');

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


REPLACE INTO `week_concept` (`week_concept_id`, `week`, `class_id`, `concept_id`) VALUES
	(1, 1, 1, 2),
	(2, 3, 1, 3);

REPLACE INTO `class_student` (`class_student_id`,  `class_id`, `login_id`) VALUES
	(1, 1, 1),
	(2, 1, 3),
	(3, 1, 4),
	(4, 2, 4);

REPLACE INTO `exam_lib` (`exam_id`, `exam_type`, `start_time`, `end_time`, `week`, `class_id`) VALUES
	(1, '練習', '2024-08-23 16:52:29', '2024-09-30 16:52:32', 1, 1),
    (2, '練習', '2024-08-25 15:58:21', '2024-09-30 15:58:23', 2, 1),
    (3, '練習', '2024-08-26 11:44:04', '2024-09-30 11:44:05', 3, 1),
    (4, '練習', '2024-09-05 20:55:28', '2024-09-30 20:55:29', 4, 2),
    (5, '練習', '2024-09-05 20:58:47', '2024-09-30 20:58:48', 16, 3);

REPLACE INTO `registry_lib` (`registry_id`, `username`) VALUES
	(1, '7113056145'),
	(2, '7113056119');

-- 建立資料(教師系統) END --  




-- 建立資料(題目、選項、答案) --  

REPLACE INTO `question_lib` (`question_id`, `exam_type`, `content`, `question_type`, `answer`, `degree`) VALUES
	(1, '練習', '下列哪一個符合梯度下降的意義?', '選擇題', 'B', '容易'),
	(2, '測驗', '下列哪一個符合卷積的意義?', '選擇題', 'A', '容易'),
	(3, '測驗', '下列哪一個符合池化的意義?', '選擇題', 'C', '容易'),
	(4, '練習', '在電腦視覺中為甚麼做資料正規化?', '選擇題', 'B', '容易'),
	(5, '練習', '簡答題測試?', '簡答題', NULL, '普通');
	-- (6, '測驗', '下列哪一個的意義意義意義??', '選擇題', 'D', '容易', 1),
	-- (7, '練習', '對於Autoencoder的局限性，以下哪一項敘述是正確的？', '選擇題', 'D', '簡單', 4),
	-- (8, '練習', '有關鑑別器網絡（Discriminator Network）的功能，下列哪一項敘述是正確的？', '選擇題', 'B', '簡單', 4),
	-- (9, '練習', '自動編碼器（autoencoders）在機器學習中主要用於什麼目的？', '選擇題', 'C', '簡單', 4),
	-- (10, '練習', '在訓練生成對抗網絡（GANs）時，哪一種現象表明生成器和鑑別器之間的學習進程失衡？', '選擇題', 'C', '普通', 4),
	-- (11, '練習', '在訓練生成對抗網絡（GANs）的過程中，以下哪一項最準確地描述了生成器（Generator）和鑑別器（Discriminator）的交互訓練流程？', '選擇題', 'C', '簡單', 4),
	-- (12, '練習', '特徵金字塔網絡（FPN）的主要目的是什麼？', '選擇題', 'C', '簡單', 5),
	-- (13, '練習', '在視覺轉換器（ViT）中，輸入圖像是如何處理的？', '選擇題', 'C', '簡單', 5),
	-- (14, '練習', 'Transformer 如何使用 self-attention 來處理詞與詞之間的關係？', '選擇題', 'D', '簡單', 5),
	-- (15, '練習', '在基於轉換器（Transformer）的物件偵測模型中，可訓練位置嵌入（Positional Embeddings）的主要功能是什麼？', '選擇題', 'D', '簡單', 5),
	-- (16, '練習', '如果在圖像分類任務中，你更關心局部細節而非整體特徵，你可能更傾向於使用哪種架構？', '選擇題', 'B', '簡單', 5),
	-- (17, '練習', '如何評價物件偵測器的提案質量？', '選擇題', 'B', '簡單', 6),
	-- (18, '練習', '非最大抑制（Non-Maximum Suppression）在物件偵測中的作用是什麼？', '選擇題', 'B', '普通', 6),
	-- (19, '練習', '在物件偵測中，Precision和Recall的定義分別是什麼?', '選擇題', 'C', '簡單', 6),
	-- (20, '練習', 'SSD與Faster R-CNN相比，有什麼主要差異？', '選擇題', 'B', '普通', 6),
	-- (21, '練習', '在 R-CNN 流程中，候選區域生成的方法是什麼？', '選擇題', 'C', '簡單', 6),
	-- (22, '練習', 'SSD (single shot detector) 在物件偵測中的主要創新是什麼？', '選擇題', 'B', '普通', 6),
	-- (23, '練習', '與RCNN系列模型與SSD相比，YOLO (v1) 物件偵測算法主要的優勢是什麼？', '選擇題', 'D', '簡單', 6),
	-- (24, '練習', '如果在非極大值抑制（Non-Maximum Suppression, NMS）中設定較高的交集過聯比（Intersection over Union, IoU）閾值，會有什麼影響？', '選擇題', 'A', '困難', 6),
	-- (25, '練習', 'ResNet模型中的主要創新是什麼？', '選擇題', 'C', '普通', 7),
	-- (26, '練習', 'ResNet中的"Skip Connections"（跳躍式連接）的作用是什麼？', '選擇題', 'D', '普通', 7),
	-- (27, '練習', 'Inception Network之所以被稱為“Inception”是因為它可以同時使用多種不同大小的卷積濾波器。這個特點有助於實現什麼？', '選擇題', 'D', '普通', 7),
	-- (28, '練習', '哪一個模型首次引入了深度可分卷積 (Depthwise Separable Convolution) 的概念？', '選擇題', 'C', '普通', 7),
	-- (29, '練習', '如果一個分類模型的Precision非常高，但Recall非常低，那麼可能是什麼情況？', '選擇題', 'A', '普通', 7),
	-- (30, '練習', '濾波器的權重值是如何訓練得到的？', '選擇題', 'C', '簡單', 7),
	-- (31, '練習', '關於反向傳播算法，以下哪項陳述是正確的？ ', '選擇題', 'B', '簡單', 7),
	-- (32, '練習', 'Dropout 是一種常見的神經網絡訓練技術，其主要目的是什麼？ ', '選擇題', 'C', '簡單', 7),
	-- (33, '練習', '在深層神經網絡中，哪一個問題可能導致權重更新過慢？', '選擇題', 'B', '簡單', 7),
	-- (34, '練習', '什麼是反向傳播（Backward Propagation）？ ', '選擇題', 'A', '簡單', 8),
	-- (35, '練習', 'def __init__(self):          super(Net, self).__init__() \n\n\n\n        self.conv1 = nn.Conv2d(1, 32, 3) \n\n\n\n        self.conv2 = nn.Conv2d(32, 64, 3) \n\n\n\n        self.pool = nn.MaxPool2d(2, 2) \n\n\n\n        self.fc1 = nn.Linear(64 * 12 * 12, 128) \n\n\n\n        self.fc2 = nn.Linear(128, 10) \n\n\n\n該模型的第一個卷積層（Convolutional Layer）使用了多少個卷積核（Filters）？ ', '選擇題', 'B', '簡單', 8),
	-- (36, '練習', '動量（Momentum）的作用是什麼？ ', '選擇題', 'A', '普通', 8),
	-- (37, '練習', '在CNN中，Convolution層的主要目的是什麼？', '選擇題', 'B', '簡單', 9),
	-- (38, '練習', 'CNN中的「全連接層（Fully connected layers）」有什麼特點？', '選擇題', 'B', '簡單', 9),
	-- (39, '練習', '在CNN中，Softmax層通常用於什麼目的？', '選擇題', 'B', '簡單', 9),
	-- (40, '練習', '在CNN中，卷積核（Convolutional kernel）的主要作用是什麼？', '選擇題', 'D', '簡單', 9),
	-- (41, '練習', '在CNN中，什麼是「池化（Pooling）」的主要目的？', '選擇題', 'A', '簡單', 9),
	-- (42, '練習', '在CNN中，「Stride」是指什麼？\n', '選擇題', 'C', '簡單', 9),
	-- (43, '練習', '在CNN中，「Padding」的作用是什麼？', '選擇題', 'C', '簡單', 9),
	-- (44, '練習', '在CNN中，「Kernel（卷積核）」的大小對於模型的性能有什麼影響？', '選擇題', 'A', '簡單', 9),
	-- (45, '練習', '在CNN中，卷積核的大小是一個重要的超參數。較小的卷積核（例如3x3）相對於較大的卷積核(例如7x7)有什麼優勢？', '選擇題', 'C', '簡單', 9),
	-- (46, '練習', '相較於傳統的全連接網路，卷積神經網路 (CNN) 在處理圖像資料時有哪項主要優勢？', '選擇題', 'B', '簡單', 9),
	-- (47, '練習', '在電腦視覺中，以下哪種技術最適合用於圖像分割（將圖像中的物體從背景中分離出來）？\n', '選擇題', 'D', '簡單', 10),
	-- (48, '練習', '在電腦視覺中，以下哪種是激活函數的目的？', '選擇題', 'A', '簡單', 10),
	-- (49, '練習', '資料探索是視覺任務的重要一步，它有助於我們了解資料的特徵和分布。在探索CIFAR10資料集時，通常會執行哪些操作？\n', '選擇題', 'D', '簡單', 10),
	-- (50, '練習', '在開始視覺任務之前，通常需要對資料進行一系列的預處理操作，以確保它們適合輸入到模型中。這些預處理的步驟通常包括哪些什麼？\n', '選擇題', 'A', '簡單', 10),
	-- (51, '練習', '在電腦視覺中，神經網路的輸出層通常包含哪些資訊？', '選擇題', 'C', '簡單', 10),
	-- (52, '練習', '在視覺任務中，為了測試模型的性能，通常會使用測試資料集來評估模型的準確度。測試資料集通常包括哪些特徵？', '選擇題', 'B', '簡單', 10),
	-- (53, '練習', '電腦視覺技術在人工智慧中扮演著「眼」的角色，藉由辨識及處理影像資料所得出的資訊，可以發展更多有價值的應用。請問下列哪一種不為常見電腦視覺技術的應用之一？', '選擇題', 'B', '簡單', 10),
	-- (54, '練習', '在訓練視覺模型時，通常需要執行多次訓練已不斷改進模型性能。在CIFAR10數據集上訓練模型時，通常如何監控模型的訓練進度？', '選擇題', 'B', '簡單', 10),
	-- (55, '練習', '在電腦視覺中，神經網路結構被廣泛用於處理圖像數據。以下哪個選項準確地描述了神經網路結構在圖像處理中的作用？', '選擇題', 'C', '簡單', 10),
	-- (56, '練習', '模型在訓練數據上表現很好，但在測試數據上表現差，這是__所引起的', '簡答題', 'undefined', '簡單', 8),
	-- (57, '練習', '在Gradient descent的中，__為每次看完一筆資料將會更新權重', '簡答題', 'undefined', '普通', 8),
	-- (58, '練習', '__層的主要目的是通過減少特徵圖的空間尺寸來簡化模型，同時保留最重要的特徵。', '簡答題', 'undefined', '簡單', 7);



INSERT INTO `choicequestion_detail` (`detail_id`, `option1`, `option2`, `option3`, `option4`, `answer_explain`, `question_id`) VALUES
	(1, '1', '2', '3', '4', '因為愛', 1),
	(2, '提取特徵', '減少參數量', '幫助模型收斂', '固定學習率', '所以愛', 2),
	(3, '1', '2', '3', '4', '直到夢想到手', 3),
	(4, '使所有圖像都有相同的解析度', '幫助模型的訓練收斂得更快', '使模型可以只處理黑白圖像', '使所有圖像都有相同的尺寸', '放開手', 4);
	-- (5, '1', '2', '3', '4', 'Removing stopwords helps in reducing noise, improving model performance, and enhancing interpretability.', 6),
	-- (6, 'Autoencoders是無損壓縮的 ', '解碼的輸出與原始數據相同 ', 'Autoencoders僅適用於具有相互獨立特徵的數據 ', 'Autoencoders是有損壓縮的，且學習特定領域的表示 ', 'null', 7),
	-- (7, '鑑別器網絡的目的是生成合成樣本 ', '鑑別器網絡的目的是將生成器生成的樣本與真實數據進行區分 ', '鑑別器網絡主要用於壓縮數據表示 ', '鑑別器網絡的功能是對數據進行生成表示 ', 'null', 8),
	-- (8, '分類圖像 ', '增強數據集 ', '數據降維和特徵學習 ', '實時語音識別 ', 'null', 9),
	-- (9, 'ROI pooling', 'Linear Regression', 'Selective Search', 'SVM classification', 'R-CNN 使用 Selective Search 來生成候選區域。', 10),
	-- (10, '首先單獨訓練生成器，然後單獨訓練鑑別器。 ', '同時訓練生成器和鑑別器，但使用不同的數據集。 ', '輪流訓練生成器和鑑別器，每次一個。 ', '生成器和鑑別器使用相同的損失函數同時訓練。 ', '輪流訓練生成器和鑑別器，每次一個。', 11),
	-- (11, '增加模型的大小 ', '提高特徵提取速度 ', '融合多尺度特徵 ', '總結各層次的特徵 ', '融合多尺度特徵', 12),
	-- (12, '通過卷積層對圖像進行分割。 ', '將圖像整體輸入到轉換器中。 ', '將圖像分割成多個固定大小的塊，然後線性投影到嵌入空間。 ', '直接將圖像像素作為輸入。 ', '將圖像分割成多個固定大小的塊，然後線性投影到嵌入空間。', 13),
	-- (13, '對每個詞應用相同的權重 ', '隨機選擇詞之間的關係 ', '使用線性關係 ', '動態調整權重來考慮詞之間的關係 ', '動態調整權重來考慮詞之間的關係', 14),
	-- (14, '減少模型的參數數量。 ', '輔助模型區分前景和背景物件。 ', '增強圖像特徵的局部細節。 ', '在沒有卷積層的情況下編碼像素之間的相對位置關係。 ', '在沒有卷積層的情況下編碼像素之間的相對位置關係。', 15),
	-- (15, 'ViT ', 'CNN ', '兩者差異不大 ', 'RNN ', 'CNN', 16),
	-- (16, '以提案覆蓋的面積大小評估 ', '以提案與真實答案的重疊程度評估 ', '以提案的顏色深淺評估 ', '以提案的形狀評估 ', '通過比較提案與真實答案的重疊程度（例如使用IOU）來評價物件偵測器的提案質量。', 17),
	-- (17, '提高偵測速度 ', '清理重疊的邊界框 ', '增加偵測精度 ', '計算邊界框的大小 ', '非最大抑制（NMS）用於清理重疊的邊界框，以改善偵測結果的清晰度。', 18),
	-- (18, 'Precision是正確偵測物件的比例，Recall是錯過偵測物件的比例 ', 'Precision是錯過偵測物件的比例，Recall是正確偵測物件的比例 ', 'Precision是模型預測正確的機率，Recall是模型找到所有正確物件的表現 ', 'Precision是模型找到所有正確物件的表現，Recall是模型預測正確的機率 ', 'Precision是當模型預測為positive時，正確的機率；Recall是模型在發現所有positive的表現。', 19),
	-- (19, 'SSD更準確 ', 'SSD更快 ', 'SSD使用多階段偵測 ', 'SSD需要更多的訓練數據 ', 'SSD（Single Shot Detectors）比Faster R-CNN更快，但在小物件的偵測上可能不那麼準確。', 20),
	-- (20, 'ROI pooling ', 'Linear Regression ', 'Selective Search ', 'SVM classification ', 'R-CNN 使用 Selective Search 來生成候選區域。', 21),
	-- (21, 'SSD引入了非最大抑制（Non-Maximum Suppression, NMS）來改善物件偵測的精準度。 ', 'SSD使用了一系列不同尺寸和比例的錨盒來同時預測多個邊界框和物件類別。 ', 'SSD為了提高執行速度，省略了物件偵測中常見的特徵提取階段。 ', 'SSD創新性地採用了回歸分析來預測物件邊界框，而不是使用以前的分類方法。 ', 'null', 22),
	-- (22, 'YOLO算法可以適應各種尺寸的圖像，而無需調整算法參數。 ', 'YOLO在偵測精度上優於RCNN系列模型與SSD，特別是在小物件上。 ', 'YOLO的訓練過程比RCNN系列模型與SSD更為簡單，因為它不依賴於預先設定的錨盒。 ', 'YOLO的處理速度非常快，能夠在實時應用中快速預測物件及其分類，這是由於它的結構只需一次遍歷便能對整個圖像進行分析。 ', 'null', 23),
	-- (23, '將產生更多的假陽性，因為較高的IoU閾值會導致更少的邊界框被抑制。 ', '將減少檢測到的物件總數，因為更多重疊的邊界框將會被視為單一物件。 ', '將提高檢測物件的精度，因為只有高度重疊的邊界框才會被抑制。 ', '將不會有任何影響，因為IoU閾值不影響非極大值抑制的效果。 ', 'null', 24),
	-- (24, '使用多層長短記憶網絡（LSTM） ', '引入了注意力機制 ', '使用了跳躍式連接（殘差連接） ', '使用了稀疏矩陣乘法 ', 'ResNet的主要創新是引入了殘差連接，這有助於解決梯度消失的問題，使訓練更深的網絡變得更容易。', 25),
	-- (25, '減少計算量 ', '增加計算量 ', '優化梯度下降 ', '解決梯度消失問題 ', '"Skip Connections"（跳躍式連接）的主要作用是解決梯度消失的問題，使深度網絡的訓練更容易。', 26),
	-- (26, '提高訓練速度 ', '減少模型的大小 ', '增加模型的深度 ', '學習高階和低階特徵的組合 ', 'Inception Network的多尺度卷積操作使其能夠學習高階和低階特徵的組合，有助於提高性能。', 27),
	-- (27, 'VGGNet ', 'ResNet ', 'MobileNet ', 'AlexNet ', '深度可分卷積是在MobileNet中首次引入的，目的是減少計算量和模型大小，同時保持相對高的性能。', 28),
	-- (28, '模型對正例的預測非常準確，但錯過了大部分的正例 ', '模型對正例的預測非常不準確，但錯誤地將許多負例預測為正例 ', '模型對正例的預測非常不準確，但正確地預測了大部分的正例 ', '模型對正例和負例的預測均非常準確 ', '當Precision高而Recall低時，表示模型對正例的預測非常準確，但錯過了很多實際的正例。', 29),
	-- (29, '通過隨機初始化 ', '通過最大池化 ', '通過反向傳播算法 ', '通過平均計算 ', '濾波器的權重值是通過反向傳播算法在訓練過程中學習得到的。', 30),
	-- (30, '反向傳播算法主要是通過前向傳播的方式不斷優化網路參數。 ', '反向傳播算法是通過計算網路輸出與實際目標之間的誤差，然後反向傳遞這個誤差，以調整網路中的參數。 ', '反向傳播算法主要依賴於隨機初始化網路參數來實現網路的訓練。 ', '反向傳播算法是通過增加網路層數來不斷優化網路性能。 ', '反向傳播算法的核心思想是通過計算網路輸出和實際目標之間的誤差，然後反向傳遞這個誤差，通過梯度下降法來調整網路中的參數，以使網路的輸出更接近於實際的目標。 ', 31),
	-- (31, '增加神經網絡的訓練速度 ', '減少神經網絡的訓練成本 ', '防止神經網絡過擬合 ', '增加神經網絡的參數數量 ', 'Dropout 是一種在訓練神經網絡時使用的正則化技術，其通過在每個訓練步驟中隨機關閉一部分神經元，從而減少神經網絡的複雜度和防止過擬合。', 32),
	-- (32, '過度擬合（Overfitting） ', '梯度消失（Vanishing Gradient） ', '權重初始化不當 ', '梯度爆炸（Exploding Gradient） ', '在深層神經網絡中，梯度消失是一個常見的問題，可能導致權重更新過慢。當梯度消失時，梯度的值會變得非常小，使得在反向傳播過程中，權重的更新量變得非常小，從而導致權重更新速度緩慢，網絡訓練困難。 ', 33),
	-- (33, '一種用於在神經網路中更新權重的演算法，透過計算損失函數相對於每個權重的偏微分。 ', '一種用於在神經網路中隨機初始化權重的方法。 ', '一種用於減少神經網路計算量的方法。 ', '一種將輸入數據轉換為輸出數據的數學函數。 ', 'null', 34),
	-- (34, '16', '32', '64', '128', '在上述代碼中，第一個卷積層（Convolutional Layer）使用了 32 個卷積核（Filters）。 ', 35),
	-- (35, '幫助梯度下降在優化過程中穩定並加速收斂。 ', '保證神經網路的所有權重都被初始化為零。 ', '保證梯度下降總是找到全局最優解。 ', '減小模型在訓練過程中的記憶能力。 ', 'null', 36),
	-- (36, '圖像裁剪 ', '特徵提取 ', '圖像增強 ', '顏色轉換 ', 'Convolution層用於提取圖像中的特徵，通過運行卷積操作，它能夠檢測圖像中的不同特徵，例如邊緣、紋理和模式', 37),
	-- (37, '它只處理圖像的一部分 ', '它的每個神經元都與上一層的每個神經元相連 ', '它不需要權重參數 ', '它用於圖像增強 ', '全連接層中的每個神經元都與上一層中的每個神經元相連，這意味著它們之間有大量的權重參數', 38),
	-- (38, '特徵提取 ', '分類問題的輸出 ', '圖像轉換 ', '壓縮圖像尺寸 ', 'Softmax層通常用於多類別分類問題，它將模型的輸出轉換為每個類別的概率分佈', 39),
	-- (39, '用於縮小圖像尺寸 ', '用於旋轉圖像 ', '用於濾除高頻信息 ', '用於提取特徵 ', '卷積核是用於從輸入圖像中提取特徵的過濾器', 40),
	-- (40, '減少圖像尺寸 ', '提高圖像的清晰度 ', '增加圖像的噪點 ', '增加圖像的色彩深度 ', '池化層用於減少圖像的尺寸，通常通過降低分辨率和保留主要特徵來實現', 41),
	-- (41, '卷積核的大小 ', '池化操作的方法 ', '卷積操作中，卷積核移動的步長 ', '激活函數的類型 ', '卷積操作中，卷積核移動的步長', 42),
	-- (42, '增加卷積核的大小 ', '改變激活函數的類型 ', '確保輸出特徵圖的大小不變或避免維度太快縮小 ', '增強網絡的訓練速度 ', '確保輸出特徵圖的大小不變或避免維度太快縮小', 43),
	-- (43, '較大的卷積核會捕捉到更大範圍的空間特徵，但可能會增加計算成本 ', '卷積核的大小與模型性能無關 ', '較大的卷積核總是導致更好的模型性能 ', '較小的卷積核可以加速模型的訓練，但不會忽略任何重要特徵 ', '較大的卷積核會捕捉到更大範圍的空間特徵，但可能會增加計算成本', 44),
	-- (44, '較小的卷積核可以涵蓋較大的覆蓋範圍。 ', '較小的卷積核需要較多的參數。 ', '較小的卷積核通常計算上更快且參數更少。 ', '較小的卷積核僅適用於小型圖像。 ', 'null', 45),
	-- (45, 'CNN的結構允許它自動學習圖像裡的特徵，而全連接網路沒有辦法。 ', '由於卷積操作，CNN通常具有更少的參數，使訓練更加高效。 ', 'CNN需要更多的計算資源。 ', 'CNN只適用於小型圖像資料。 ', '由於卷積操作，CNN通常具有更少的參數，使訓練更加高效。', 46),
	-- (46, '特徵提取', '監督學習', '目標檢測', '像素級分類', 'null', 47),
	-- (47, '使神經網路具有非線性能力', '抑制神經網路的輸出', '增加神經網路的運算速度', '降低神經網路的計算量', 'null', 48),
	-- (48, '計算每個類別的圖像數量', '視覺化一些圖像範例', '驗證數據集的模型標籤是否正確', '所有以上的操作', 'null', 49),
	-- (49, '通過將圖像大小調整為相同尺寸來標準化輸入數據', '刪除所有圖像中的顏色通道（channels），只保留灰階影像', '應用高斯模糊來降低圖像的噪聲', '將所有圖像轉換為文本格式以進行模型訓練', 'null', 50),
	-- (50, '影像的像素值', '影像的尺寸', '影像的類別', '影像的屬性', 'null', 51),
	-- (51, '與訓練數據集相同的圖像和標籤', '未在訓練數據集中出現的新圖像和標籤', '不包含標籤訊息的圖像', '只包含模糊圖像的數據', 'null', 52),
	-- (52, '停車場用的車牌辨識系統', 'Youtube的自動字幕產生器', '無人商店自動結帳', 'iPhone上的Face ID', 'null', 53),
	-- (53, '通過觀察模型在訓練數據上的預測結果。', '通過在每個epoch後計算模型在驗證（或測試）數據上的性能指標，例如準確率。', '通過記錄模型的訓練時間和硬體資源利用率。', '通過觀察模型的輸出層權重的變化。', 'null', 54),
	-- (54, '神經網路結構用於將圖像數據轉換為音頻數據。', '神經網路結構用於識別圖像中的像素強度。', '神經網路結構用於從圖像中提取有用的特徵，並將這些特徵用於例如分類或物體檢測等任務。', '神經網路結構用於壓縮圖像，以減少其存儲空間。', 'null', 55);

REPLACE INTO `question_concept` (`question_concept_id`, `question_id`, `concept_id`) VALUES
	(1, 1, 2),
	(2, 1, 3),
	(3, 2, 3),
	(4, 2, 4),
	(4, 3, 5),
	(5, 3, 6),
	(6, 4, 7),
	(7, 5, 7);

-- 建立資料(題目、選項、答案) END --  





-- 建立資料(後臺系統) --



-- 建立資料(後臺系統) END --





-- 建立資料(資料庫期末) --

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
	(101, '這是第 101 題的問題內容。', '選擇題', 'B'),
	(102, '這是第 102 題的問題內容。', '選擇題', 'C'),
	(103, '這是第 103 題的問題內容。', '選擇題', 'A'),
	(104, '這是第 104 題的問題內容。', '選擇題', 'C'),
	(105, '這是第 105 題的問題內容。', '選擇題', 'B'),
	(106, '這是第 106 題的問題內容。', '選擇題', 'D'),
	(107, '這是第 107 題的問題內容。', '選擇題', 'C'),
	(108, '這是第 108 題的問題內容。', '選擇題', 'C'),
	(109, '這是第 109 題的問題內容。', '選擇題', 'C'),
	(110, '這是第 110 題的問題內容。', '選擇題', 'D'),
	(111, '這是第 111 題的問題內容。', '選擇題', 'D'),
	(112, '這是第 112 題的問題內容。', '選擇題', 'A'),
	(113, '這是第 113 題的問題內容。', '選擇題', 'B'),
	(114, '這是第 114 題的問題內容。', '選擇題', 'C'),
	(115, '這是第 115 題的問題內容。', '選擇題', 'C'),
	(116, '這是第 116 題的問題內容。', '選擇題', 'A'),
	(117, '這是第 117 題的問題內容。', '選擇題', 'C'),
	(118, '這是第 118 題的問題內容。', '選擇題', 'D'),
	(119, '這是第 119 題的問題內容。', '選擇題', 'C'),
	(120, '這是第 120 題的問題內容。', '選擇題', 'B'),
	(121, '這是第 121 題的問題內容。', '選擇題', 'B'),
	(122, '這是第 122 題的問題內容。', '選擇題', 'A'),
	(123, '這是第 123 題的問題內容。', '選擇題', 'B'),
	(124, '這是第 124 題的問題內容。', '選擇題', 'A'),
	(125, '這是第 125 題的問題內容。', '選擇題', 'D'),
	(126, '這是第 126 題的問題內容。', '選擇題', 'C'),
	(127, '這是第 127 題的問題內容。', '選擇題', 'D'),
	(128, '這是第 128 題的問題內容。', '選擇題', 'B'),
	(129, '這是第 129 題的問題內容。', '選擇題', 'A'),
	(130, '這是第 130 題的問題內容。', '選擇題', 'B'),
	(131, '這是第 131 題的問題內容。', '選擇題', 'D'),
	(132, '這是第 132 題的問題內容。', '選擇題', 'D'),
	(133, '這是第 133 題的問題內容。', '選擇題', 'C'),
	(134, '這是第 134 題的問題內容。', '選擇題', 'D'),
	(135, '這是第 135 題的問題內容。', '選擇題', 'C'),
	(136, '這是第 136 題的問題內容。', '選擇題', 'C'),
	(137, '這是第 137 題的問題內容。', '選擇題', 'D'),
	(138, '這是第 138 題的問題內容。', '選擇題', 'C'),
	(139, '這是第 139 題的問題內容。', '選擇題', 'D'),
	(140, '這是第 140 題的問題內容。', '選擇題', 'C'),
	(141, '這是第 141 題的問題內容。', '選擇題', 'A'),
	(142, '這是第 142 題的問題內容。', '選擇題', 'C'),
	(143, '這是第 143 題的問題內容。', '選擇題', 'C'),
	(144, '這是第 144 題的問題內容。', '選擇題', 'B'),
	(145, '這是第 145 題的問題內容。', '選擇題', 'D'),
	(146, '這是第 146 題的問題內容。', '選擇題', 'C'),
	(147, '這是第 147 題的問題內容。', '選擇題', 'A'),
	(148, '這是第 148 題的問題內容。', '選擇題', 'A'),
	(149, '這是第 149 題的問題內容。', '選擇題', 'C'),
	(150, '這是第 150 題的問題內容。', '選擇題', 'A'),
	(151, '這是第 151 題的問題內容。', '選擇題', 'D'),
	(152, '這是第 152 題的問題內容。', '選擇題', 'B'),
	(153, '這是第 153 題的問題內容。', '選擇題', 'B'),
	(154, '這是第 154 題的問題內容。', '選擇題', 'A'),
	(155, '這是第 155 題的問題內容。', '選擇題', 'C'),
	(156, '這是第 156 題的問題內容。', '選擇題', 'C'),
	(157, '這是第 157 題的問題內容。', '選擇題', 'D'),
	(158, '這是第 158 題的問題內容。', '選擇題', 'D'),
	(159, '這是第 159 題的問題內容。', '選擇題', 'A'),
	(160, '這是第 160 題的問題內容。', '選擇題', 'A'),
	(161, '這是第 161 題的問題內容。', '選擇題', 'B'),
	(162, '這是第 162 題的問題內容。', '選擇題', 'B'),
	(163, '這是第 163 題的問題內容。', '選擇題', 'C'),
	(164, '這是第 164 題的問題內容。', '選擇題', 'A'),
	(165, '這是第 165 題的問題內容。', '選擇題', 'C'),
	(166, '這是第 166 題的問題內容。', '選擇題', 'C'),
	(167, '這是第 167 題的問題內容。', '選擇題', 'C'),
	(168, '這是第 168 題的問題內容。', '選擇題', 'B'),
	(169, '這是第 169 題的問題內容。', '選擇題', 'B'),
	(170, '這是第 170 題的問題內容。', '選擇題', 'D'),
	(171, '這是第 171 題的問題內容。', '選擇題', 'B'),
	(172, '這是第 172 題的問題內容。', '選擇題', 'D'),
	(173, '這是第 173 題的問題內容。', '選擇題', 'B'),
	(174, '這是第 174 題的問題內容。', '選擇題', 'B'),
	(175, '這是第 175 題的問題內容。', '選擇題', 'C'),
	(176, '這是第 176 題的問題內容。', '選擇題', 'C'),
	(177, '這是第 177 題的問題內容。', '選擇題', 'B'),
	(178, '這是第 178 題的問題內容。', '選擇題', 'B'),
	(179, '這是第 179 題的問題內容。', '選擇題', 'D'),
	(180, '這是第 180 題的問題內容。', '選擇題', 'D'),
	(181, '這是第 181 題的問題內容。', '選擇題', 'D'),
	(182, '這是第 182 題的問題內容。', '選擇題', 'C'),
	(183, '這是第 183 題的問題內容。', '選擇題', 'C'),
	(184, '這是第 184 題的問題內容。', '選擇題', 'C'),
	(185, '這是第 185 題的問題內容。', '選擇題', 'A'),
	(186, '這是第 186 題的問題內容。', '選擇題', 'A'),
	(187, '這是第 187 題的問題內容。', '選擇題', 'B'),
	(188, '這是第 188 題的問題內容。', '選擇題', 'A'),
	(189, '這是第 189 題的問題內容。', '選擇題', 'C'),
	(190, '這是第 190 題的問題內容。', '選擇題', 'C'),
	(191, '這是第 191 題的問題內容。', '選擇題', 'A'),
	(192, '這是第 192 題的問題內容。', '選擇題', 'B'),
	(193, '這是第 193 題的問題內容。', '選擇題', 'C'),
	(194, '這是第 194 題的問題內容。', '選擇題', 'D'),
	(195, '這是第 195 題的問題內容。', '選擇題', 'A'),
	(196, '這是第 196 題的問題內容。', '選擇題', 'A'),
	(197, '這是第 197 題的問題內容。', '選擇題', 'D'),
	(198, '這是第 198 題的問題內容。', '選擇題', 'A'),
	(199, '這是第 199 題的問題內容。', '選擇題', 'A'),
	(200, '這是第 200 題的問題內容。', '選擇題', 'D');

INSERT INTO `db_choiceques_detail` (`detail_id`, `option1`, `option2`, `option3`, `option4`, `answer_explain`, `question_id`) VALUES
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
REPLACE INTO `db_courseYearQues` (`courseYearQues_id`, `examYear`, `question_id`, `course_id`) VALUES
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

-- 建立資料(資料庫期末) END --