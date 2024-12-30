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
                                cr.course_name,
                                t.teacher_name,
                                q.question_id,
                                q.content,
                                q.answer,
                                GROUP_CONCAT(DISTINCT cyq.examYear ORDER BY cyq.examYear DESC SEPARATOR ', ') AS years,
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
                                q.question_type = '簡答題'
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
                                c.course_id,
                                c.course_name,
                                t.teacher_name
                            FROM
                                gpt_database.db_course_lib c
                            JOIN
                                gpt_database.db_teacher_lib t
                            ON
                                c.teacher_id = t.teacher_id
                            ORDER BY
                                c.course_id DESC;
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
                            ORDER BY
                                teacher_id DESC
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

const removeTeacher = (teacher_id) => {
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
                                db_teacher_lib
                            WHERE
                                teacher_id = ${teacher_id};
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

const addTeacher = (teacher_name) => {
    return new Promise(
        (resolve, reject) => {
            pool.getConnection(
                (connError, conn) => {
                    if(connError) {
                        reject(connError);
                    }
                    else {
                        let mysqlbody = `
                            INSERT INTO db_teacher_lib
                                (teacher_name)
                            VALUES
                                ('${teacher_name}');
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

const removeCourse = (course_id) => {
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
                                db_course_lib
                            WHERE
                                course_id = ${course_id};
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

const addCourse = (course_name, teacher_id) => {
    return new Promise(
        (resolve, reject) => {
            pool.getConnection(
                (connError, conn) => {
                    if(connError) {
                        reject(connError);
                    }
                    else {
                        let mysqlbody = `
                            INSERT INTO db_course_lib
                                (course_name, teacher_id)
                            VALUES
                                ('${course_name}', '${teacher_id}');
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


const getQuestionsByTeacherAndCourse = (teacherName, courseName) => {
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
                    LEFT JOIN
                        db_choiceques_detail AS cqd ON q.question_id = cqd.question_id
                    WHERE
                        t.teacher_name = ? AND cr.course_name = ?
                    GROUP BY
                        q.question_id, cr.course_name, t.teacher_name
                    ORDER BY
                        appearance_count DESC;
                `;
                conn.query(query, [teacherName, courseName], (error, result) => {
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
    getAllChoiceQues,
    getAllShortAnsQues,
    addQues,
    addChoiceQuesDetail,
    modifyQues,
    modifyChoiceQuesDetail,
    getAllCourse,
    addCourseYearQues,
    removeCourseYearQuesByQuesID,
    getAllTeacher,
    removeTeacher,
    addTeacher,
    removeCourse,
    addCourse,
    getQuestionsByTeacherAndCourse
};