// 設定 --------------------------------------------------

var mariadb = require('mariadb/callback');
var con = require('../../config/DBconfig');

const pool = mariadb.createPool(
    {
        port: con.port,  // port號
        host: con.host, // 主機名稱
        user: con.user, // 用戶名稱
        password: con.password, // 資料庫密碼
        database: con.database, // 資料庫名稱
        connectionLimit: con.connectionLimit // 連線限制
    }
);

// 設定  END --------------------------------------------------


// 獲取所有選擇題
const getAllChoiceQues = () => {
    return new Promise(
        (resolve, reject) => {
            pool.getConnection(
                (connError, conn) => {
                    if(connError) {
                        reject(connError);
                    }
                    else {
                        let mysqlbody = `
                            SELECT
                                cr.course_name,
                                t.teacher_name,
                                q.question_id,
                                q.content,
                                q.answer,
                                cqd.option1,
                                cqd.option2,
                                cqd.option3,
                                cqd.option4,
                                cqd.answer_explain,
                                GROUP_CONCAT(DISTINCT cyq.examYear ORDER BY cyq.examYear DESC SEPARATOR ', ') AS years,
                                COUNT(cyq.question_id) AS appearance_count
                            FROM
                                db_course_lib AS cr
                            JOIN
                                db_courseyearques AS cyq ON cr.course_id = cyq.course_id
                            JOIN
                                db_question_lib AS q ON cyq.question_id = q.question_id
                            JOIN
                                db_choiceques_detail AS cqd ON q.question_id = cqd.question_id
                            JOIN
                                db_teacher_lib AS t ON cr.teacher_id = t.teacher_id
                            WHERE
                                q.question_type = '選擇題'
                            GROUP BY
                                q.question_id, cr.course_name, t.teacher_name
                            ORDER BY
                                appearance_count DESC;
                        `
                        conn.query (
                            mysqlbody,
                            (error, result) => {
                                if(error) {
                                    console.log('幹SQL錯誤!!!!!!!!!!!', error);
                                    reject(error);
                                }
                                else {
                                    resolve(result);
                                }
                                conn.release();
                            }
                        )
                    }
                }
            )
        }
    )
}
// 獲取所有簡答題
const getAllShortAnsQues = () => {
    return new Promise(
        (resolve, reject) => {
            pool.getConnection(
                (connError, conn) => {
                    if(connError) {
                        reject(connError);
                    }
                    else {
                        let mysqlbody = `
                            SELECT
                                question_id,
                                content,
                                answer
                            FROM
                                db_question_lib
                            WHERE
                                question_type = '簡答題';
                        `
                        conn.query (
                            mysqlbody,
                            (error, result) => {
                                if(error) {
                                    console.log('幹SQL錯誤!!!!!!!!!!!', error);
                                    reject(error);
                                }
                                else {
                                    resolve(result);
                                }
                                conn.release();
                            }
                        )
                    }
                }
            )
        }
    )
}
// 新增題目
const addQues = (inputValues) => {

    const content = inputValues.content;
    const answer = inputValues.answer;
    const question_type = inputValues.question_type;
    
    return new Promise(
        (resolve, reject) => {
            pool.getConnection(
                (connError, conn) => {
                    if(connError) {
                        reject(connError);
                    }
                    else {
                        let mysqlbody = `
                            INSERT INTO db_question_lib
                                (question_type, content, answer)
                            VALUES
                                ('${question_type}', '${content}', '${answer}');
                        `
                        conn.query (
                            mysqlbody,
                            (error, result) => {
                                if(error) {
                                    console.log('幹SQL錯誤!!!!!!!!!!!', error);
                                    reject(error);
                                }
                                else {
                                    const lastQuestionId = result.insertId;
                                    resolve(lastQuestionId);
                                }
                                conn.release();
                            }
                        )
                    }
                }
            )
        }
    )

}

// 新增選擇題選項
const addChoiceQuesDetail = (inputValues, lastInsertID) => {

    const option1 = inputValues.option1;
    const option2 = inputValues.option2;
    const option3 = inputValues.option3;
    const option4 = inputValues.option4;
    const answer_explain = inputValues.explain;
    
    return new Promise(
        (resolve, reject) => {
            pool.getConnection(
                (connError, conn) => {
                    if(connError) {
                        reject(connError);
                    }
                    else {
                        let mysqlbody = `
                            INSERT INTO db_choiceques_detail
                                (option1, option2, option3, option4, answer_explain, question_id)
                            VALUES
                                ('${option1}', '${option2}', '${option3}', '${option4}', '${answer_explain}', '${lastInsertID}');
                        `
                        conn.query (
                            mysqlbody,
                            (error, result) => {
                                if(error) {
                                    console.log('幹SQL錯誤!!!!!!!!!!!', error);
                                    reject(error);
                                }
                                else {
                                    resolve(result);
                                }
                                conn.release();
                            }
                        )
                    }
                }
            )
        }
    )

}

// 修改題目
const modifyQues = (inputValues) => {

    const question_id = inputValues.question_id;
    const content = inputValues.content;
    const answer = inputValues.answer;

    return new Promise(
        (resolve, reject) => {
            pool.getConnection(
                (connError, conn) => {
                    if(connError) {
                        reject(connError);
                    }
                    else {
                        let mysqlbody = `
                            UPDATE
                                db_question_lib
                            SET
                                content = '${content}',
                                answer = '${answer}'
                            WHERE
                                question_id = ${question_id};
                        `
                        conn.query (
                            mysqlbody,
                            (error, result) => {
                                if(error) {
                                    console.log('幹SQL錯誤!!!!!!!!!!!', error);
                                    reject(error);
                                }
                                else {
                                    resolve(result);
                                }
                                conn.release();
                            }
                        )
                    }
                }
            )
        }
    )

}

// 修改選擇題選項
const modifyChoiceQuesDetail = (inputValues) => {

    const question_id = inputValues.question_id;
    const option1 = inputValues.option1;
    const option2 = inputValues.option2;
    const option3 = inputValues.option3;
    const option4 = inputValues.option4;
    const answer_explain = inputValues.explain;
    
    return new Promise(
        (resolve, reject) => {
            pool.getConnection(
                (connError, conn) => {
                    if(connError) {
                        reject(connError);
                    }
                    else {
                        let mysqlbody = `
                            UPDATE
                                db_choiceques_detail
                            SET
                                option1 = '${option1}',
                                option2 = '${option2}',
                                option3 = '${option3}',
                                option4 = '${option4}',
                                answer_explain = '${answer_explain}'
                            WHERE
                                question_id = ${question_id};
                        `
                        conn.query (
                            mysqlbody,
                            (error, result) => {
                                if(error) {
                                    console.log('幹SQL錯誤!!!!!!!!!!!', error);
                                    reject(error);
                                }
                                else {
                                    resolve(result);
                                }
                                conn.release();
                            }
                        )
                    }
                }
            )
        }
    )

}

// 獲取所有課程
const getAllCourse = () => {
    return new Promise(
        (resolve, reject) => {
            pool.getConnection(
                (connError, conn) => {
                    if(connError) {
                        reject(connError);
                    }
                    else {
                        let mysqlbody = `
                            SELECT
                                *
                            FROM
                                db_course_lib
                        `
                        conn.query (
                            mysqlbody,
                            (error, result) => {
                                if(error) {
                                    console.log('幹SQL錯誤!!!!!!!!!!!', error);
                                    reject(error);
                                }
                                else {
                                    resolve(result);
                                }
                                conn.release();
                            }
                        )
                    }
                }
            )
        }
    )
}

// 新增題目相關的課程年份
const addCourseYearQues = (inputValues, lastInsertID) => {

    const course = inputValues.course;
    const examYear = inputValues.examYear;

    return new Promise(
        (resolve, reject) => {
            pool.getConnection(
                (connError, conn) => {
                    if(connError) {
                        reject(connError);
                    }
                    else {
                        
                        const insertPromises = examYear.map(
                            year => {
                              return new Promise(
                                (insertResolve, insertReject) => {
                    
                                    let insertQuery = `
                                        INSERT INTO db_courseYearQues
                                            (examYear, question_id, course_id)
                                        VALUES
                                            (${year}, ${lastInsertID}, ${course})
                                    `
                    
                                    conn.query(
                                        insertQuery,
                                        (insertError) => {
                                            if (insertError) {
                                                insertReject(insertError);
                                            }
                                            else {
                                                insertResolve();
                                            }
                                        }
                                    );
                    
                                }
                              );
                            }
                        );

                        const handleError = (err) => {
                            conn.rollback(
                                () => {
                                    conn.release();
                                    reject(err);
                                }
                            );
                        };
                    
                        Promise.all(insertPromises)
                            .then(
                                () => {
                                conn.commit(
                                    commitError => {
                                    if (commitError) {
                                        handleError(commitError);
                                    }
                                    else {
                                        console.log('SQL終於成功了喔！');
                                        conn.release();
                                        resolve();
                                    }
                                    }
                                );
                                }
                            )
                            .catch(handleError);











                    }
                }
            )
        }
    )





















    




}

// 刪除該題目相關的課程年份
const removeCourseYearQuesByQuesID = (question_id) => {
    return new Promise(
        (resolve, reject) => {
            pool.getConnection(
                (connError, conn) => {
                    if(connError) {
                        reject(connError);
                    }
                    else {
                        let mysqlbody = `
                            DELETE FROM
                                db_courseYearQues
                            WHERE
                                question_id = ${question_id};
                        `
                        conn.query (
                            mysqlbody,
                            (error, result) => {
                                if(error) {
                                    console.log('幹SQL錯誤!!!!!!!!!!!', error);
                                    reject(error);
                                }
                                else {
                                    resolve(result);
                                }
                                conn.release();
                            }
                        )
                    }
                }
            )
        }
    )
}

const getAllTeacher = () => {
    return new Promise(
        (resolve, reject) => {
            pool.getConnection(
                (connError, conn) => {
                    if(connError) {
                        reject(connError);
                    }
                    else {
                        let mysqlbody = `
                            SELECT
                                *
                            FROM
                                db_teacher_lib
                        `
                        conn.query (
                            mysqlbody,
                            (error, result) => {
                                if(error) {
                                    console.log('幹SQL錯誤!!!!!!!!!!!', error);
                                    reject(error);
                                }
                                else {
                                    resolve(result);
                                }
                                conn.release();
                            }
                        )
                    }
                }
            )
        }
    )
}







module.exports.getAllChoiceQues = getAllChoiceQues; // 獲取所有選擇題
module.exports.getAllShortAnsQues = getAllShortAnsQues; // 獲取所有簡答題
module.exports.addQues = addQues; // 新增題目
module.exports.addChoiceQuesDetail = addChoiceQuesDetail; // 新增選擇題選項
module.exports.modifyQues = modifyQues; // 修改題目
module.exports.modifyChoiceQuesDetail = modifyChoiceQuesDetail; // 修改選擇題選項
module.exports.getAllCourse = getAllCourse; // 獲取所有課程
module.exports.addCourseYearQues = addCourseYearQues; // 新增題目相關的課程年份
module.exports.removeCourseYearQuesByQuesID = removeCourseYearQuesByQuesID; // 刪除該題目相關的課程年份
module.exports.getAllTeacher = getAllTeacher; // 獲取所有老師