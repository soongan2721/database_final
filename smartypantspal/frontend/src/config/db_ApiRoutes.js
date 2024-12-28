var BaseRoute = "//127.0.0.1:8000"

const db_APIs = {
    db_getAllQuestionAPI: `${BaseRoute}/db_api/db_getAllQuestion`, // 獲取所有題目
    db_addQuestionAPI: `${BaseRoute}/db_api/db_addQuestion`, // 新增題目
    db_modifyQuestionAPI: `${BaseRoute}/db_api/db_modifyQuestion`, // 修改題目
}

export default db_APIs;