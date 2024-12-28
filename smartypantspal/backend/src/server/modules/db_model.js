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
                                db_question_lib.question_id,
                                db_question_lib.content,
                                db_question_lib.answer,
                                db_choiceques_detail.option1,
                                db_choiceques_detail.option2,
                                db_choiceques_detail.option3,
                                db_choiceques_detail.option4,
                                db_choiceques_detail.answer_explain
                            FROM
                                db_question_lib
                            JOIN
                                db_choiceques_detail
                            ON
                                db_question_lib.question_id = db_choiceques_detail.question_id;
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






module.exports.getAllChoiceQues = getAllChoiceQues; // 獲取所有選擇題
module.exports.getAllShortAnsQues = getAllShortAnsQues; // 獲取所有簡答題