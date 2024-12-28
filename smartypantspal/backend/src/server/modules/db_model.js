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
                console.log(`m:${courseName}`);
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
                        GROUP_CONCAT(DISTINCT cyq.examYear ORDER BY cyq.examYear DESC) AS years,
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
                        cr.course_name = ?
                    GROUP BY
                        q.question_id, cr.course_name, t.teacher_name
                    ORDER BY
                        appearance_count DESC;
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
                        cr.course_name,
                        t.teacher_name,
                        q.question_id,
                        q.content,
                        q.answer,
                        GROUP_CONCAT(DISTINCT cyq.examYear ORDER BY cyq.examYear DESC) AS years,
                        COUNT(cyq.question_id) AS appearance_count
                    FROM
                        db_course_lib AS cr
                    JOIN
                        db_courseyearques AS cyq ON cr.course_id = cyq.course_id
                    JOIN
                        db_question_lib AS q ON cyq.question_id = q.question_id
                    JOIN
                        db_teacher_lib AS t ON cr.teacher_id = t.teacher_id
                    WHERE
                        cr.course_name = ? AND q.question_type = '簡答題'
                    GROUP BY
                        q.question_id, cr.course_name, t.teacher_name
                    ORDER BY
                        appearance_count DESC;
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


const getChoiceQuesByTeacherName = (teacherName) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((connError, conn) => {
            if (connError) {
                reject(connError);
            } else {
                const query = `
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
                        GROUP_CONCAT(DISTINCT cyq.examYear ORDER BY cyq.examYear DESC) AS years,
                        COUNT(cyq.question_id) AS appearance_count
                    FROM
                        db_teacher_lib AS t
                    JOIN
                        db_course_lib AS cr ON t.teacher_id = cr.teacher_id
                    JOIN
                        db_courseyearques AS cyq ON cr.course_id = cyq.course_id
                    JOIN
                        db_question_lib AS q ON cyq.question_id = q.question_id
                    JOIN
                        db_choiceques_detail AS cqd ON q.question_id = cqd.question_id
                    WHERE
                        t.teacher_name = ?
                    GROUP BY
                        q.question_id, cr.course_name, t.teacher_name
                    ORDER BY
                        appearance_count DESC;
                `;
                conn.query(query, [teacherName], (error, result) => {
                    conn.release();
                    if (error) reject(error);
                    else resolve(result);
                });
            }
        });
    });
};


// 簡答題查詢
const getShortAnsQuesByTeacherName = (teacherName) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((connError, conn) => {
            if (connError) {
                reject(connError);
            } else {
                const query = `
                    SELECT
                        cr.course_name,
                        t.teacher_name,
                        q.question_id,
                        q.content,
                        q.answer,
                        GROUP_CONCAT(DISTINCT cyq.examYear ORDER BY cyq.examYear DESC) AS years,
                        COUNT(cyq.question_id) AS appearance_count
                    FROM
                        db_teacher_lib AS t
                    JOIN
                        db_course_lib AS cr ON t.teacher_id = cr.teacher_id
                    JOIN
                        db_courseyearques AS cyq ON cr.course_id = cyq.course_id
                    JOIN
                        db_question_lib AS q ON cyq.question_id = q.question_id
                    WHERE
                        t.teacher_name = ? AND q.question_type = '簡答題'
                    GROUP BY
                        q.question_id, cr.course_name, t.teacher_name
                    ORDER BY
                        appearance_count DESC;
                `;
                conn.query(query, [teacherName], (error, result) => {
                    conn.release();
                    if (error) reject(error);
                    else resolve(result);
                });
            }
        });
    });
};

const getChoiceQuesByYear = (year) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((connError, conn) => {
            if (connError) {
                reject(connError);
            } else {
                const query = `
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
                        GROUP_CONCAT(DISTINCT cyq.examYear ORDER BY cyq.examYear DESC) AS years,
                        COUNT(cyq.question_id) AS appearance_count
                    FROM
                        db_courseyearques AS cyq
                    JOIN
                        db_course_lib AS cr ON cyq.course_id = cr.course_id
                    JOIN
                        db_teacher_lib AS t ON cr.teacher_id = t.teacher_id
                    JOIN
                        db_question_lib AS q ON cyq.question_id = q.question_id
                    JOIN
                        db_choiceques_detail AS cqd ON q.question_id = cqd.question_id
                    WHERE
                        cyq.question_id IN (
                            SELECT DISTINCT question_id
                            FROM db_courseyearques
                            WHERE examYear = ?
                        )
                    GROUP BY
                        q.question_id, cr.course_name, t.teacher_name
                    ORDER BY
                        appearance_count DESC;
                `;
                conn.query(query, [year], (error, result) => {
                    conn.release();
                    if (error) reject(error);
                    else resolve(result);
                });
            }
        });
    });
};

const getShortAnsQuesByYear = (year) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((connError, conn) => {
            if (connError) {
                reject(connError);
            } else {
                const query = `
                    SELECT
                        cr.course_name,
                        t.teacher_name,
                        q.question_id,
                        q.content,
                        q.answer,
                        GROUP_CONCAT(DISTINCT cyq.examYear ORDER BY cyq.examYear DESC) AS years,
                        COUNT(cyq.question_id) AS appearance_count
                    FROM
                        db_courseyearques AS cyq
                    JOIN
                        db_course_lib AS cr ON cyq.course_id = cr.course_id
                    JOIN
                        db_teacher_lib AS t ON cr.teacher_id = t.teacher_id
                    JOIN
                        db_question_lib AS q ON cyq.question_id = q.question_id
                    WHERE
                        cyq.question_id IN (
                            SELECT DISTINCT question_id
                            FROM db_courseyearques
                            WHERE examYear = ?
                        ) AND q.question_type = '簡答題'
                    GROUP BY
                        q.question_id, cr.course_name, t.teacher_name
                    ORDER BY
                        appearance_count DESC;
                `;
                conn.query(query, [year], (error, result) => {
                    conn.release();
                    if (error) reject(error);
                    else resolve(result);
                });
            }
        });
    });
};

const getChoiceQuesByTeacherAndYear = (teacherName, year) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((connError, conn) => {
            if (connError) {
                reject(connError);
            } else {
                const query = `
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
                        GROUP_CONCAT(DISTINCT cyq.examYear ORDER BY cyq.examYear DESC) AS years,
                        COUNT(cyq.question_id) AS appearance_count
                    FROM
                        db_teacher_lib AS t
                    JOIN
                        db_course_lib AS cr ON t.teacher_id = cr.teacher_id
                    JOIN
                        db_courseyearques AS cyq ON cr.course_id = cyq.course_id
                    JOIN
                        db_question_lib AS q ON cyq.question_id = q.question_id
                    JOIN
                        db_choiceques_detail AS cqd ON q.question_id = cqd.question_id
                    WHERE
                        t.teacher_name = ? AND cyq.question_id IN (
                            SELECT DISTINCT question_id
                            FROM db_courseyearques
                            WHERE examYear = ?
                        )
                    GROUP BY
                        q.question_id, cr.course_name, t.teacher_name
                    ORDER BY
                        appearance_count DESC;
                `;
                conn.query(query, [teacherName, year], (error, result) => {
                    conn.release();
                    if (error) reject(error);
                    else resolve(result);
                });
            }
        });
    });
};

const getShortAnsQuesByTeacherAndYear = (teacherName, year) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((connError, conn) => {
            if (connError) {
                reject(connError);
            } else {
                const query = `
                    SELECT
                        cr.course_name,
                        t.teacher_name,
                        q.question_id,
                        q.content,
                        q.answer,
                        GROUP_CONCAT(DISTINCT cyq.examYear ORDER BY cyq.examYear DESC) AS years,
                        COUNT(cyq.question_id) AS appearance_count
                    FROM
                        db_teacher_lib AS t
                    JOIN
                        db_course_lib AS cr ON t.teacher_id = cr.teacher_id
                    JOIN
                        db_courseyearques AS cyq ON cr.course_id = cyq.course_id
                    JOIN
                        db_question_lib AS q ON cyq.question_id = q.question_id
                    WHERE
                        t.teacher_name = ? AND cyq.question_id IN (
                            SELECT DISTINCT question_id
                            FROM db_courseyearques
                            WHERE examYear = ?
                        ) AND q.question_type = '簡答題'
                    GROUP BY
                        q.question_id, cr.course_name, t.teacher_name
                    ORDER BY
                        appearance_count DESC;
                `;
                conn.query(query, [teacherName, year], (error, result) => {
                    conn.release();
                    if (error) reject(error);
                    else resolve(result);
                });
            }
        });
    });
};

const getChoiceQuesByCourseAndYear = (courseName, Year) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((connError, conn) => {
            if (connError) {
                reject(connError);
            } else {
                const query = `
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
                        COUNT(cyq.examYear) AS occurrences
                    FROM
                        db_course_lib AS cr
                    JOIN
                        db_courseyearques AS cyq ON cr.course_id = cyq.course_id
                    JOIN
                        db_teacher_lib AS t ON cr.teacher_id = t.teacher_id
                    JOIN
                        db_question_lib AS q ON cyq.question_id = q.question_id
                    JOIN
                        db_choiceques_detail AS cqd ON q.question_id = cqd.question_id
                    WHERE
                        cr.course_name = ?
                    GROUP BY
                        q.question_id
                    HAVING FIND_IN_SET(?, GROUP_CONCAT(DISTINCT cyq.examYear)) > 0
                    ORDER BY
                        occurrences DESC;
                `;
                conn.query(query, [courseName, Year], (error, result) => {
                    conn.release();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            }
        });
    });
};







const getShortAnsQuesByCourseAndYear = (courseName, Year) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((connError, conn) => {
            if (connError) {
                reject(connError);
            } else {
                const query = `
                    SELECT
                        cr.course_name,
                        t.teacher_name,
                        q.question_id,
                        q.content,
                        q.answer,
                        GROUP_CONCAT(DISTINCT cyq.examYear ORDER BY cyq.examYear DESC SEPARATOR ', ') AS years,
                        COUNT(cyq.examYear) AS occurrences
                    FROM
                        db_course_lib AS cr
                    JOIN
                        db_courseyearques AS cyq ON cr.course_id = cyq.course_id
                    JOIN
                        db_teacher_lib AS t ON cr.teacher_id = t.teacher_id
                    JOIN
                        db_question_lib AS q ON cyq.question_id = q.question_id
                    WHERE
                        cr.course_name = ? AND q.question_type = '簡答題'
                    GROUP BY
                        q.question_id
                    HAVING FIND_IN_SET(?, GROUP_CONCAT(DISTINCT cyq.examYear)) > 0
                    ORDER BY
                        occurrences DESC;
                `;
                conn.query(query, [courseName, Year], (error, result) => {
                    conn.release();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            }
        });
    });
};






  





module.exports = {
    getChoiceQuesByCourseName,
    getShortAnsQuesByCourseName,
    getChoiceQuesByTeacherName,
    getShortAnsQuesByTeacherName,
    getChoiceQuesByYear,
    getShortAnsQuesByYear,
    getChoiceQuesByTeacherAndYear,
    getShortAnsQuesByTeacherAndYear,
    getChoiceQuesByCourseAndYear,
    getShortAnsQuesByCourseAndYear,
};
