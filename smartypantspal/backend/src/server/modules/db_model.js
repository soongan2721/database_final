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
const getChoiceQuesByCourseName = (courseName) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((connError, conn) => {
            if (connError) {
                reject(connError);
            } else {
                console.log(`m:${courseName}`)
                let mysqlbody = `
                    SELECT
                        q.question_id,
                        q.content,
                        q.answer,
                        cqd.option1,
                        cqd.option2,
                        cqd.option3,
                        cqd.option4,
                        cqd.answer_explain
                    FROM
                        db_course_lib AS cr
                    JOIN
                        db_courseyearques AS cyq ON cr.course_id = cyq.course_id
                    JOIN
                        db_question_lib AS q ON cyq.question_id = q.question_id
                    JOIN
                        db_choiceques_detail AS cqd ON q.question_id = cqd.question_id
                    WHERE
                        cr.course_name = ?;
                `;
                conn.query(mysqlbody, [courseName], (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                    conn.release();
                });
            }
        });
    });
};


const getShortAnsQuesByCourseName = (courseName) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((connError, conn) => {
            if (connError) {
                reject(connError);
            } else {
                let mysqlbody = `
                    SELECT
                        q.question_id,
                        q.content,
                        q.answer
                    FROM
                        db_course_lib AS cr
                    JOIN
                        db_courseyearques AS cyq ON cr.course_id = cyq.course_id
                    JOIN
                        db_question_lib AS q ON cyq.question_id = q.question_id
                    WHERE
                        cr.course_name = ? AND q.question_type = '簡答題';
                `;
                conn.query(mysqlbody, [courseName], (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                    conn.release();
                });
            }
        });
    });
};

module.exports.getChoiceQuesByCourseName = getChoiceQuesByCourseName; // 獲取所有選擇題
module.exports.getShortAnsQuesByCourseName = getShortAnsQuesByCourseName; // 獲取所有簡答題
