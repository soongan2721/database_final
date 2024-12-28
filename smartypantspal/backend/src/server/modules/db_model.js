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


















module.exports.getAllChoiceQues = getAllChoiceQues; // 獲取所有選擇題
module.exports.getAllShortAnsQues = getAllShortAnsQues; // 獲取所有簡答題
module.exports.addQues = addQues; // 新增題目
module.exports.addChoiceQuesDetail = addChoiceQuesDetail; // 新增選擇題選項
module.exports.modifyQues = modifyQues; // 修改題目
module.exports.modifyChoiceQuesDetail = modifyChoiceQuesDetail; // 修改選擇題選項