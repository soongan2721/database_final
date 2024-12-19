var express = require('express');
var router = express.Router();
var articleCtrl = require('../controllers/article.controller');

router.get('/get_question',articleCtrl.articlGetQuestion);
router.post('/upload_student_table',articleCtrl.articleupload_student_table); //更新上傳的TABLE
router.get('/check_student_table',articleCtrl.articleGetStudentTable);//確認是否達過題
router.get('/catch_student_table',articleCtrl.articleCatchStudentTable);//抓取先前答題成績
router.get('/get_answer',articleCtrl.articlGetAnswer);//抓題目的答案
router.post('/upload_gpt_response_table',articleCtrl.gpt_response_table); //更新上傳的TABLE
router.get('/get_gpt_judge',articleCtrl.articlGetGptJudge);//抓題目的答案
router.post('/upload_practice_table', articleCtrl.articlUploadPracticeTable);
router.get('/get_permission', articleCtrl.articleGetPermission);
router.get('/get_week', articleCtrl.articleGetWeek);
router.get('/get_class', articleCtrl.articleGetClass);
router.post('/update_practice_record', articleCtrl.articleUpdatePracticeRecord);
router.get('/get_practice_record', articleCtrl.articleGetPractiecRecord);
router.post('/upload_practice_record', articleCtrl.articleUploadPracticeRecord);
router.get('/get_question_information', articleCtrl.articleGetQuestionInformation);
router.get('/get_practice_question_id', articleCtrl.articleGetPracticeQeuestionId);
router.post('/upload_practice_question', articleCtrl.articleUploadPracticeQuestion);



// 辰翰 8/4 獲取pred_question所有資料
router.get('/get_allQuestion', articleCtrl.articlGetAllQuestion);
// 辰翰 8/11 獲取concept_lib所有資料
router.get('/get_allConcept', articleCtrl.articlGetAllConcept);
// 辰翰 8/13 新增概念
router.get('/add_concept', articleCtrl.articlAddConcept);
// 辰翰 8/13 刪除概念(連帶相關的題目一起刪除)
router.get('/remove_concept', articleCtrl.articlRemoveConcept);
// 辰翰 8/13 修改概念
router.get('/modify_concept', articleCtrl.articlModifyConcept);
// 辰翰 8/16 新增題目
router.get('/add_question', articleCtrl.articlAddQuestion);
// 辰翰 8/17 刪除概念(純刪除概念)
router.get('/remove_conceptOnly', articleCtrl.articlRemoveConceptOnly);
// 辰翰 8/17 刪除題目
router.get('/remove_question', articleCtrl.articlRemoveQuestion);
// 辰翰 8/17 修改題目
router.get('/modify_question', articleCtrl.articlModifyQuestion);
// 辰翰 8/18 獲取所有課程
router.get('/get_allClass', articleCtrl.articlGetAllClass);
// 辰翰 8/18 獲取所有週次概念
router.get('/get_allWeekConcept', articleCtrl.articlGetAllWeekConcept);
// 辰翰 8/18 修改週次概念
router.get('/modify_weekConcept', articleCtrl.articlModifyWeekConcept);
// 辰翰 8/21 獲取所有學生
router.get('/get_allStudent', articleCtrl.articlGetAllStudent);
// 辰翰 8/22 獲取所有課程學生
router.get('/get_allClassStudent', articleCtrl.articlGetAllClassStudent);
// 辰翰 8/23 修改課程學生
router.get('/modify_classStudent', articleCtrl.articlModifyClassStudent);
// 辰翰 8/23 透過login_id刪除課程學生
router.get('/remove_studentByIdFromClassStudent', articleCtrl.articlRemoveStudentByIdFromClassStudent);
// 辰翰 9/2 透過CSV檔新增題目
router.post('/add_QuestionByCsv', articleCtrl.articlAddQuestionByCsv);
// 辰翰 9/2 根據概念名稱獲取概念ID
router.post('/get_ConceptIdByName', articleCtrl.articlGetConceptIdByName);
// 辰翰 9/10 新增使用紀錄
router.get('/add_record', articleCtrl.articlAddRecord);
// 辰翰 9/10 獲取所有使用紀錄
router.get('/get_allRecord', articleCtrl.articlGetAllRecord);

// 羽喬 9/11 更新使用者密碼
router.post('/ChangePassword', articleCtrl.articlChangePassword);
// 羽喬 9/13 抓舊密碼
router.post('/CheckPassword', articleCtrl.articlCheckPassword);

// 辰翰 9/12 獲取註冊表資料
router.get('/get_allRegistry', articleCtrl.articlGetAllRegistry);
// 辰翰 9/12 新增學號到註冊表
router.post('/add_userToRegistry', articleCtrl.articlAddUserToRegistry);
// 辰翰 9/12 根據ID刪除註冊表中學號
router.post('/remove_userFromRegistry', articleCtrl.articlRemoveUserFromRegistry);
// 辰翰 9/12 根據ID刪除註冊表中學號
router.post('/add_conceptIfNotExist', articleCtrl.articlAddConceptIfNotExist);
// 辰翰 10/25 輸入0或1，更改題目之驗證狀態
router.post('/modify_quesVerification', articleCtrl.articlModifyQuesVerification);
// 嘉盛 11/11 上傳小幫手用戶的query
router.post('/upload_user_query', articleCtrl.articlUploadUserQuery);
// 嘉盛 11/12 得到小幫手用戶的query
router.post('/get_user_query', articleCtrl.articlGetUserResponse);
// 嘉盛 11/12 把用戶的query傳給gpt並得到回應
router.post('/get_gpt_response', articleCtrl.articlGetGptResponse);
// 辰翰 11/18 根據現有題目及選項內容重新生成選項
router.post('/option_regenerate', articleCtrl.articlOptionRegenerate);

module.exports = router;