// var BaseRoute   = "//smartypantspal.com" //for product version
var BaseRoute   = "//127.0.0.1:8000" //for dev and docker version
var loginAPI    = `${BaseRoute}/api/loginn`
var loggedinAPI = `${BaseRoute}/api/login_check`
var CheckNameAPI = `${BaseRoute}/api/check_username`
var CheckStudentTableAPI= BaseRoute + "/api/check_student_table"
var logoutAPI   = BaseRoute + "/api/logout"
var GetQuestionAPI = BaseRoute + "/api/get_question"
var GetAnswerAPI = BaseRoute + "/api/get_answer"
var signupAPI = BaseRoute + "/api/signup"
var GetGPTjudgeAPI = BaseRoute + "/api/get_gpt_judge"
var CatchStudentTableAPI = BaseRoute + "/api/catch_student_table"
var UploadGPTresAPI = BaseRoute + "/api/upload_gpt_response_table"
var UploadstdTableAPI = BaseRoute + "/api/upload_student_table"
var UploadPracticeTableAPI = BaseRoute + "/api//upload_practice_table";
var getPermissionAPI = BaseRoute + "/api/get_permission";
var getWeekAPI = BaseRoute + "/api/get_week";
var getClassAPI = BaseRoute + "/api/get_class";
var UpdatePracticeRecordAPI = BaseRoute + "/api/update_practice_record";
var UploadPracticeRecordAPI = BaseRoute + "/api/upload_practice_record";
var GetPracticeRecordAPI = BaseRoute + '/api/get_practice_record';
var GetPracticeQuestionIdAPI = BaseRoute + '/api/get_practice_question_id';
var UploadPracticeQuestionAPI = BaseRoute + '/api/upload_practice_question';
var GetQuestionInformationAPI = BaseRoute + '/api/get_question_information';
var sql = `${BaseRoute}/api/sql`

// 辰翰 8/4 獲取question_lib所有資料
var GetAllQuestionAPI = BaseRoute + "/api/get_allQuestion"
// 辰翰 8/11 獲取concept_lib所有資料
var GetAllConceptAPI = BaseRoute + "/api/get_allConcept"
// 辰翰 8/13 新增概念
var addConceptAPI = BaseRoute + "/api/add_concept"
// 辰翰 8/13 刪除概念(連帶相關的題目一起刪除)
var removeConceptAPI = BaseRoute + "/api/remove_concept"
// 辰翰 8/13 修改概念
var modifyConceptAPI = BaseRoute + "/api/modify_concept"
// 辰翰 8/16 新增題目
var addQuestionAPI = BaseRoute + "/api/add_question"
// 辰翰 8/17 刪除概念(純刪除概念)
var removeConceptOnlyAPI = BaseRoute + "/api/remove_conceptOnly"
// 辰翰 8/17 刪除題目
var removeQuesAPI = BaseRoute + "/api/remove_question"
// 辰翰 8/17 修改題目
var modifyQuesAPI = BaseRoute + "/api/modify_question"
// 辰翰 8/18 獲取所有課程
var GetAllClassAPI = BaseRoute + "/api/get_allClass"
// 辰翰 8/18 獲取所有週次概念
var GetAllWeekConceptAPI = BaseRoute + "/api/get_allWeekConcept"
// 辰翰 8/18 修改週次概念
var modifyWeekConceptAPI = BaseRoute + "/api/modify_weekConcept"
// 辰翰 8/21 獲取所有學生
var GetAllStudentAPI = BaseRoute + "/api/get_allStudent"
// 辰翰 8/22 獲取所有課程學生
var GetAllClassStudentAPI = BaseRoute + "/api/get_allClassStudent"
// 辰翰 8/23 修改課程學生
var modifyClassStudentAPI = BaseRoute + "/api/modify_classStudent"
// 辰翰 8/23 透過login_id刪除課程學生
var removeStudentByIdFromClassStudentAPI = BaseRoute + "/api/remove_studentByIdFromClassStudent"
// 辰翰 9/2 透過CSV檔新增題目
var addQuestionByCsvAPI = BaseRoute + "/api/add_QuestionByCsv"
// 辰翰 9/2 根據概念名稱獲取概念ID
var GetConceptIdByNameAPI = BaseRoute + "/api/get_ConceptIdByName"
// 辰翰 9/10 新增使用紀錄
var addRecordAPI = BaseRoute + "/api/add_record"
// 辰翰 9/10 獲取所有使用紀錄
var GetAllRecordAPI = BaseRoute + "/api/get_allRecord"
// 羽喬 9/12 變更密碼
var ChangePasswordAPI   = BaseRoute + "/api/ChangePassword"
// 羽喬 9/13 抓舊密碼
var CheckPasswordAPI   = BaseRoute + "/api/CheckPassword"
// 辰翰 9/12 獲取註冊表資料
var GetAllRegistryAPI = BaseRoute + "/api/get_allRegistry"
// 辰翰 9/12 新增學號到註冊表
var addUserToRegistry = BaseRoute + "/api/add_userToRegistry"
// 辰翰 9/12 根據ID刪除註冊表中學號
var removeUserFromRegistryAPI = BaseRoute + "/api/remove_userFromRegistry"
// 辰翰 10/4 輸入一概念集，若其中概念沒有在資料表中則新增
var addConceptIfNotExistAPI = BaseRoute + "/api/add_conceptIfNotExist"
// 辰翰 10/25 輸入0或1，更改題目之驗證狀態
var modifyQuesVerificationAPI= BaseRoute + "/api/modify_quesVerification"
// 嘉盛 11/11 上傳小幫手用戶的query
var UploadUserQueryAPI= BaseRoute + "/api/upload_user_query"
// 嘉盛 11/12 把用戶的query傳給gpt並得到回應
var GetGptResponseAPI= BaseRoute + "/api/get_gpt_response"
// 辰翰 11/18 根據現有題目及選項內容重新生成選項
var optionRegenerateAPI = BaseRoute + "/api/option_regenerate"

export {
    BaseRoute,
    loginAPI,
    loggedinAPI,
    CheckNameAPI,
    CheckStudentTableAPI,
    logoutAPI,
    GetQuestionAPI,
    GetAnswerAPI,
    signupAPI,
    GetGPTjudgeAPI,
    CatchStudentTableAPI,
    UploadGPTresAPI,
    UploadstdTableAPI,
    UploadPracticeTableAPI,
    getPermissionAPI,
    getWeekAPI,
    getClassAPI,
    UpdatePracticeRecordAPI,
    UploadPracticeRecordAPI,
    GetPracticeRecordAPI,
    GetPracticeQuestionIdAPI,
    UploadPracticeQuestionAPI,
    GetQuestionInformationAPI,
    sql,
    GetAllQuestionAPI, // 辰翰 8/4
    GetAllConceptAPI, // 辰翰 8/11
    addConceptAPI, // 辰翰 8/13
    removeConceptAPI, // 辰翰 8/13
    modifyConceptAPI, // 辰翰 8/13
    addQuestionAPI, // 辰翰 8/16
    removeConceptOnlyAPI, // 辰翰 8/17
    removeQuesAPI, // 辰翰 8/17
    modifyQuesAPI, // 辰翰 8/17
    GetAllClassAPI, // 辰翰 8/18
    GetAllWeekConceptAPI, // 辰翰 8/18
    modifyWeekConceptAPI, // 辰翰 8/18
    GetAllStudentAPI, // 辰翰 8/21
    GetAllClassStudentAPI, // 辰翰 8/22
    modifyClassStudentAPI, // 辰翰 8/23
    removeStudentByIdFromClassStudentAPI, // 辰翰 8/23
    addQuestionByCsvAPI, // 辰翰 9/2
    GetConceptIdByNameAPI, // 辰翰 9/2
    addRecordAPI, // 辰翰 9/10
    GetAllRecordAPI, // 辰翰 9/10
    ChangePasswordAPI,
    CheckPasswordAPI,
    GetAllRegistryAPI, // 辰翰 9/12
    addUserToRegistry, // 辰翰 9/12
    removeUserFromRegistryAPI, // 辰翰 9/12
    addConceptIfNotExistAPI,  // 辰翰 10/5
    modifyQuesVerificationAPI, // 辰翰 10/25
    UploadUserQueryAPI, //嘉盛 11/11
    GetGptResponseAPI, //嘉盛 11/12
    optionRegenerateAPI // 辰翰 11/18
 }