const PracticeAPI = {
    UpdatePracticeRecordAPI : `${API_BASE}/update_practice_record`,
    UploadPracticeRecordAPI : `${API_BASE}/upload_practice_record`,
    GetPracticeRecordAPI: `${API_BASE}/get_practice_record`,
    GetPracticeQuestionIdAPI: `${API_BASE}/get_practice_question_id`,
    UploadPracticeQuestionAPI: `${API_BASE}/upload_practice_question`,
    GetQuestionInformationAPI: `${API_BASE}/get_question_information`,
    UploadPracticeTableAPI: `${API_BASE}/upload_practice_table`,

    getWeekAPI: `${API_BASE}/get_week`,
    getClassAPI: `${API_BASE}/get_class`,
    CheckStudentTableAPI: `${API_BASE}/check_student_table`,
    GetQuestionAPI: `${API_BASE}/get_question`,
    GetAnswerAPI: `${API_BASE}/get_answer`,
};

const GptAPI = {
    UploadGPTresAPI: `${API_BASE}/upload_gpt_response_table`,


};


const UselessAPI = {
    CatchStudentTableAPI: `${API_BASE}/catch_student_table`,
    UploadstdTableAPI: `${API_BASE}/upload_student_table`,
    GetGPTjudgeAPI: `${API_BASE}/get_gpt_judge`,
};


var sql = `${API_BASE}/sql`


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