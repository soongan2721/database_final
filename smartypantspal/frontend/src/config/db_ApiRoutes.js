var BaseRoute = "//127.0.0.1:8000"

const db_APIs = {
    db_getAllQuestionAPI: `${BaseRoute}/db_api/db_getAllQuestion`, // 獲取所有題目
    db_addQuestionAPI: `${BaseRoute}/db_api/db_addQuestion`, // 新增題目
    db_modifyQuestionAPI: `${BaseRoute}/db_api/db_modifyQuestion`, // 修改題目
    db_getAllCourseAPI: `${BaseRoute}/db_api/db_getAllCourse`, // 獲取所有課程
    db_getAllTeacherAPI: `${BaseRoute}/db_api/db_getAllTeacher`, // 獲取所有老師

    db_getAllQuestionByCourseNameAPI: `${BaseRoute}/db_api/db_getAllQuestionByCourseName`,
    db_getAllQuestionByTeacherNameAPI: `${BaseRoute}/db_api/db_getAllQuestionByTeacherName`,
    db_getAllQuestionByYearAPI: `${BaseRoute}/db_api/db_getAllQuestionByYear`,
    db_getAllQuestionByTeacherAndYearAPI: `${BaseRoute}/db_api/db_getAllQuestionByTeacherAndYear`,
    db_getAllQuestionByCourseAndYearAPI: `${BaseRoute}/db_api/db_getAllQuestionByCourseAndYear`,
    db_getQuestionsByTeacherAndCourseAPI: `${BaseRoute}/db_api/db_getQuestionsByTeacherAndCourse`,
    
    removeTeacherAPI: `${BaseRoute}/db_api/removeTeacher`,
    addTeacherAPI: `${BaseRoute}/db_api/addTeacher`,
    removeCourseAPI: `${BaseRoute}/db_api/removeCourse`,
    addCourseAPI: `${BaseRoute}/db_api/addCourse`,



}

export default db_APIs;