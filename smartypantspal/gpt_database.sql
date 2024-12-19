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