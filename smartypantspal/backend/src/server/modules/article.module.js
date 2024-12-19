var mariadb = require('mariadb/callback');
var con = require('../../config/DBconfig');
const { readlink } = require('fs');
const { resolve } = require('path');
// const { exec } = require('child_process'); // product version
const { spawn } = require('child_process'); // dev version
const { log } = require('console');
const pool = mariadb.createPool({
  port: con.port, // 連接阜號
  host: con.host, // 主機名稱 
  user: con.user, // 用戶名稱
  password: con.password, // 資料庫密碼
  database: con.database, // 資料庫名稱
  connectionLimit: con.connectionLimit //連線池限制
});



const GetTestTime = (SearchValues) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => {
      if(connectionError){
        reject(connectionError);
      }
      else{
        let class_id = SearchValues.class_id;
        let week = SearchValues.week;
        let sql = 'SELECT start_time, end_time FROM exam_lib JOIN class_lib on exam_lib.class_id = class_lib.class_id WHERE week in (?) AND exam_lib.class_id = ?';
        conn.query(sql, [week, class_id], (result, error) => {
          if(error){
            reject(error);
          }
          else{
            if(result && result.length > 0){
              let start_time = new Date(result[0].start_time);
              let end_time = new Date(result[0].end_time);
              resolve(result);
            }
            else{
              reject('exam_lib error');
              console.log('exam_lib error');
            }
            conn.release();
          }
        });
      }
    });
  });
}



const GetQuestinFrequency = (username) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => {
      if(connectionError){
        reject(connectionError);
      }
      else{
        let radio_sql = 'SELECT practice_answer.question_id, count(question_id) AS question_frequency \
                         FROM practice_answer JOIN practice_lib ON practice_answer.practice_id = practice_lib.practice_id \
                         WHERE student = ? AND isCorrect = 1 \
                         GROUP BY practice_answer.question_id';
        conn.query(radio_sql, username, (error, result) => {
          if(error){
            console.log(error);
          }
          else{
            let frequency = [];
            if(result && result.length > 0){
              let max = 2;
              result.forEach((question) => {
                if(question.question_frequency >= max){
                  frequency.push(question.question_id);
                }
              });
            }
            resolve(frequency);
            conn.release();
          }
        });
        
      }
    })
  })
}


/*  8/17   */
const GetQuestion = (SearchValues) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => { // 資料庫連線
      if (connectionError) {
        reject(connectionError); // 若連線有問題回傳錯誤
      } 
      else {
        let class_id = SearchValues.class_option;
        let exam_type = SearchValues.type_option;
        let week = SearchValues.class_range;

        console.log(class_id);
        console.log(exam_type);
        console.log(week);
        sql = 'SELECT DISTINCT question_concept.question_id FROM question_concept \
               JOIN week_concept on question_concept.concept_id = week_concept.concept_id \
               JOIN question_lib ON question_concept.question_id = question_lib.question_id \
               WHERE week in (?) AND class_id = ? AND exam_type = ? AND isVerified = 1';
        conn.query(sql, [week, class_id, exam_type], async (error, result) => {
          if(error){
            reject(error);
          }
          else{
            resolve(result);
          }
          conn.release();
        });

      }
    });
  });
};


const GetQuestionDetail = (question_id) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => {
      if(connectionError){
        console.log(connectionError);
        reject(connectionError);
      }
      else{
        let sql = 'SELECT question_id, content, question_type, degree FROM question_lib WHERE question_id in (?)';
        conn.query(sql, [question_id], async(error, result) => {
          if(error){
            console.log(error);
            reject(error);
          }
          else{
            console.log('*******/*/*');
            console.log(result);
            let allQuestion = [];
            if(result && result.length > 0){
              console.log(result.length);
              for (let i = 0; i < result.length; i++){
                let questionInfo = new Object();
                questionInfo.question_id = result[i].question_id;
                questionInfo.question_type = result[i].question_type;
                questionInfo.degree = result[i].degree;
                // questionInfo.start_time = start_time;
                // questionInfo.end_time = end_time;
                questionInfo.content = result[i].content;
                console.log(questionInfo.content);
                if(result[i].question_type == "選擇題"){
                  let options = await new Promise((resolve, reject) => {
                    sql = 'SELECT option1, option2, option3, option4 FROM choicequestion_detail where question_id = ?';
                    conn.query(sql, result[i].question_id, (error, result) => {
                      if(error){
                        reject(error);
                      }
                      else{
                        resolve(result);
                      }
                      conn.release();
                    });
                  });
                  questionInfo.option1 = options[0].option1;
                  questionInfo.option2 = options[0].option2;
                  questionInfo.option3 = options[0].option3;
                  questionInfo.option4 = options[0].option4;
                }
                allQuestion[i] = questionInfo;
                // currentIndex++;
                console.log(i);
              }
            }
            console.log(allQuestion);
            resolve(allQuestion);
          }
          conn.release();
        });
      }
    });
  });
}



/* POST 關鍵字 */
const upload_student_table = (insertValues) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => { // 資料庫連線
      if (connectionError) {
        reject(connectionError); // 若連線有問題回傳錯誤
      } 
      else {
        // 將陣列轉換為字串
        console.log(insertValues);
        const studentAnswersString = insertValues.student_anwser.join(', ');
        const questionIdsString = insertValues.question_id.join(', ');
        let week = parseInt(insertValues.session.substring(7));
        console.log(insertValues);
        let sql = 'INSERT INTO test_answer(class, week, degree, student, student_anwser, question_id_csv, anwser_date, score, total_score) values(?,?,?,?,?,?,?,?,?)';
        conn.query(sql,[insertValues.class, week, insertValues.degree, insertValues.student, studentAnswersString, questionIdsString, insertValues.date, insertValues.score, insertValues.total_score], (error, result) => {
            if (error) {
              console.error('SQL error: ', error); // 寫入資料庫有問題時回傳錯誤
              reject(error);
            } 
            else {
              resolve(result);
            }
            conn.release();
        });
      }
    });
  });
};

const upload_practice_table = (insertValues) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => {
      if(connectionError){
        reject(connectionError);
      }
      else{
        console.log("????????");
        console.log(insertValues);
        insertValues = insertValues.params;     
        //let class_option;
        //let studentId = insertValues.studentId;
        let question_id = insertValues.question_id;
        let student_anwser = insertValues.student_answer;
        let isCorrect = insertValues.isCorrect;
        console.log(student_anwser);
        let answer_time = insertValues.answer_time;
        //let answer_date = insertValues.answer_date;
        let practice_id = insertValues.practice_id;
        sql = "insert into practice_answer(question_id, student_answer, answer_time, practice_id, isCorrect) values(?, ?, ?, ?, ?)";
        conn.query(sql, [question_id, student_anwser, answer_time, practice_id, isCorrect], (error, result) => {
          if(error){
            reject(error);
          }
          else{
            console.log("success");
            resolve(result);
          }
          conn.release();
        });
      }
    });
  });
}


/*  Article GET 取得  */
const GetStudentTable = (SearchValues) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => { // 資料庫連線
      if (connectionError) {
        reject(connectionError); // 若連線有問題回傳錯誤
      } 
      else {
        console.log(typeof SearchValues.type_option);
        let degree = SearchValues.degree;
        let week;
        if(SearchValues.type_option.length > 1){
          week = parseInt(SearchValues.type_option.substring(7));
        }
        else{
          week = parseInt(SearchValues.type_option);
        }
        console.log(SearchValues, degree)
        //test

        let mysqlbody = `SELECT * FROM test_answer where class=? AND week=? AND student=?`
        conn.query(mysqlbody, [SearchValues.class_option, week, SearchValues.student], (error, result) => {  // Article撈取所有欄位的值組
          console.log(result)
          if (error) {
            console.error('SQL error: ', error);
            reject(error); // 寫入資料庫有問題時回傳錯誤
          } else {
            resolve(result); // 撈取成功回傳 JSON 資料
            console.log("搜尋")
          }
          conn.release();
        }
        );
      }
    });
  });
};
/*  Article GET 取得  */
const CatchStudentTable = (SearchValues) => {//history顯示的
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => { // 資料庫連線
      if (connectionError) {
        reject(connectionError); // 若連線有問題回傳錯誤
      } else {
        // let degree = SearchValues.degree
        // console.log(SearchValues,degree)
        //test

        let mysqlbody = `SELECT * FROM test_answer WHERE student=?`
        conn.query(mysqlbody, [SearchValues.student], (error, result) => {  // Article撈取所有欄位的值組
          console.log(result)
          if (error) {
            console.error('SQL error: ', error);
            reject(error); // 寫入資料庫有問題時回傳錯誤
          } 
          else {
            console.log(result[0]);
            //result[0].week = "session" + result[0].week;
            resolve(result); // 撈取成功回傳 JSON 資料
            console.log("搜尋")
          }
          conn.release();
        }
        );
      }
    });
  });
};


const GetAnswer = (SearchValues) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => { 
      if (connectionError) {
        reject(connectionError);
      } 
      else {
        let practice_id = SearchValues.practice_id;
        console.log(practice_id);
        let question_id = SearchValues.question_id;
        console.log(question_id);
        let sql = 'SELECT question_id, question_type, answer FROM question_lib WHERE question_id in (?)';
        conn.query(sql, [question_id], (error, result) => {
          if(error){
            reject(error);
          }
          else{
            let answerInfo;
            if(result && result.length > 0){;
              answerInfo = Promise.all(result.map((question) => {
                return new Promise((resolve, reject) => {
                  if(question.question_type === '選擇題'){
                    let index = question.answer.charCodeAt(0) - 64;
                    index = 'option' + index;
                    console.log(index);
                    sql = `SELECT ${index}, answer_explain FROM choicequestion_detail WHERE question_id = ?`;
                    conn.query(sql, question.question_id, (error, result) => {
                      if(error){
                        reject(error);
                      }
                      else{
                        console.log(result);
                        question.answer = result[0][`${index}`];
                        question.explain = result[0].answer_explain;
                        console.log(question.answer);
                        console.log(question.explain);
                      }
                      resolve(question);
                    });
                  }
                });
              }));
              resolve(answerInfo);
            }
            conn.release();
          }
        });
      }
    });
  });
};


/*  Article GET 取得  */
const GetGptJudge = (SearchValues) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => { // 資料庫連線
      if (connectionError) {
        reject(connectionError); // 若連線有問題回傳錯誤
      }
      else {
        let degree = SearchValues.degree
        console.log(SearchValues, degree)
        //test

        let week = "session" + SearchValues.type_option;
        let mysqlbody = `SELECT * FROM gpt_judge where class=? AND session_range=? AND student=?`
        conn.query(
          mysqlbody,
          [SearchValues.class_option, SearchValues.type_option, SearchValues.student],
          (error, result) => {  // Article撈取所有欄位的值組
            console.log(result)
            if (error) {
              console.error('SQL error: ', error);
              reject(error); // 寫入資料庫有問題時回傳錯誤
            } else {
              resolve(result); // 撈取成功回傳 JSON 資料
              console.log("搜尋")
            }
            conn.release();
          }
        );
      }
    });
  });
};


const GetWeek = (SearchValues) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => {
      if(connectionError){
        reject(connectionError);
      }
      else{
        let weekArray = [];
        let class_id = SearchValues.class_id;
        let exam_type = SearchValues.exam_type;
        console.log(class_id);
        console.log(exam_type);
        let sql = 'SELECT week from exam_lib WHERE class_id = ? AND exam_type = ? ORDER BY week';
        if(class_id && exam_type){
          conn.query(sql, [class_id, exam_type], (error, result) => {
            if(error){
              reject(error);
            }
            else{
              // console.log(result);
              if(result && result.length > 0){
                for(let i = 0; i < result.length; i++){
                  let week = new Object();
                  week.label = "week" + result[i].week;
                  week.value = result[i].week;
                  week.disabled = false;
                  weekArray[i] = week;
                }
                console.log(weekArray);
                resolve(weekArray);
              }
              else{
                reject("沒有周次");
              }
            }
            conn.release();
          });
        }
        else{
          reject("請輸入正確資料");
        }
      }
    })
  })
}

const GetClass = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => {
      if(connectionError){
        reject(connectionError);
      }
      else{
        let classArray = [];
        let sql = 'SELECT * FROM class_lib';
        conn.query(sql, (error, result) => {
          if(error){
            reject(error);
          }
          else{
            if(result && result.length > 0){
              for(let i = 0; i < result.length; i++){
                let course = new Object();
                course.label = result[i].class_name;
                course.value = result[i].class_id;
                classArray[i] = course;
              }
              console.log(classArray);
              resolve(classArray);
            }
            else{
              reject("沒有課程");
            }
          }
          conn.release();
        });
      }
    });
  });
}

const GetPermission = (SearchValues) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => {
      if(connectionError){
        reject(connectionError);
      }
      else{
        let permission = false;
        let userName = SearchValues.username;
        let sql = 'SELECT isboss FROM login WHERE username = ?';
        conn.query(sql, [userName], (error, result) => {
          if(error){
            reject(error);
          }
          else{
            console.log(result);
            if(result && result.length > 0){
              if(result[0].isboss === '管理員'){
                permission = true;
              }
              resolve(permission);
            }
            else{
              resolve("讀取錯誤");
            }
          }
          conn.release();
        });
      }
    });
  });
}


const UpdatePracticeRecord = (insertValues) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => {
      if(connectionError){
        reject(connectionError);
      } 
      else{
        insertValues = insertValues.params;
        let score = insertValues.score;
        let practice_id = insertValues.practice_id;
        let sql = 'UPDATE practice_lib SET score = ? WHERE practice_id = ?';
        conn.query(sql, [score, practice_id], (error, result) => {
          if(error){
            console.log(error);
            reject(error);
          }
          else{
            console.log(result);
            resolve(result);
          }
          conn.release();
        });
      }
    });
  });
}


const UploadPracticeRecord = (insertValues) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => {
      if(connectionError){
        reject(connectionError);
      }
      else{
        let student = insertValues.session.username;
        insertValues = insertValues.body.params;
        let class_id = insertValues.class_option;
        //let score = insertValues.score;
        let date = insertValues.date;
        let week = insertValues.class_range; 
        console.log('****************:' + week);
        let sql = 'INSERT INTO practice_lib(class, student, practice_date) VALUES (?, ?, ?)';
        conn.query(sql, [class_id, student, date], (error, result) => {
          if(error){
            reject(error);
          }
          else{
            let temporaryResult = result;
            console.log('insert success');
            sql = 'INSERT INTO practice_week(practice_id, week) VALUES';
            let placeholders = week.map(() => '(?, ?)').join(', ');
            let values = week.map(week => [result.insertId, week]);
            conn.query(sql + placeholders, values.flat(), (error, result) => {
              if (error) {
                console.log(error);
                reject(error);
              } 
              else {
                console.log('insert successful');
                resolve(temporaryResult);
              }
              conn.release();  
            });

          }
          conn.release();
        })
      }
    });
  });
}


const GetPracticeRecord = (SearchValues) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => {
      if(connectionError){
        reject(connectionError);
      }
      else{
        let student = SearchValues.student;
        //let student_id = SearchValues.session.username;
        let sql = 'SELECT practice_lib.practice_id, class_name, score, practice_date, GROUP_CONCAT(week ORDER BY week ASC) AS weeks FROM practice_lib JOIN practice_week ON practice_lib.practice_id = practice_week.practice_id JOIN class_lib ON practice_lib.class = class_lib.class_id WHERE student = ?  GROUP BY practice_lib.practice_id ';
        conn.query(sql, student, (error, result) => {
          if(error){
            console.log(error);
            reject(error);
          }
          else{
            console.log(result);
            resolve(result);
          }
          conn.release();
        });
      }
    });
  });
}


const GetPracticeQuestionId = (SearchValues) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => {
      if(connectionError){
        reject(connectionError);
      }
      else{
        let practice_id = SearchValues.practice_id;
        let sql = 'SELECT question_id FROM practice_question WHERE practice_id = ?';
        conn.query(sql, practice_id, (error, result) => {
          if(error){
            reject(error);
          }
          else{
            resolve(result);
          }
          conn.release();
        });
      }
    });
  });
}

const UplocadPracticeQuestion = (insertValues) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => {
      if(connectionError){
        reject(connectionError);
      }
      else{
        let insertValue = insertValues.params;
        let practice_id = insertValue.practice_id;
        let questions = insertValue.question_array;
        let placeholders = questions.map(() => '(?, ?)').join(', ');
        let values = questions.map(question => [practice_id, question.question_id]);
        console.log('********************' + values);
        sql = 'INSERT INTO practice_question (practice_id, question_id) VALUES ';
        conn.query(sql + placeholders, values.flat(), (error, result) => {
          if(error){
            reject(error);
          }
          else{
            resolve(result);
          }
          conn.release();
        });
      }
    });
  });
}

const GetQuestionInformation = (SearchValues) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(async (connectionError, conn) => { 
      if (connectionError) {
        reject(connectionError);
      } 
      else {
        let questionId = SearchValues.question; 
        let practice_id = SearchValues.practice_id;
        console.log(questionId);
        console.log(practice_id);
        let [studentAnswer, question, studentTextAnswer] = await Promise.all([
            new Promise((resolve, reject) => {
              let sql = 'SELECT question_id, student_answer FROM practice_answer WHERE question_id in (?) AND practice_id = ?';
              conn.query(sql, [questionId, practice_id], (error, result) => {
                if(error){
                  reject(error);
                }
                else{
                  console.log('enter');
                  resolve(result);
                }
                conn.release();
              });
            }),
            
            new Promise((resolve, reject) => {
              let sql = 'SELECT question_lib.question_id, content, question_type, answer FROM question_lib WHERE question_lib.question_id in (?)';
              conn.query(sql, [questionId], async (error, result) => {
                if(error){
                  reject(error);
                }
                else{
                  console.log('**********')
                  resolve(result);
                }
                conn.release();
              });
            }),

            new Promise((resolve, reject) => {
              let sql = 'SELECT question_id, student_answer FROM practice_text_answer WHERE question_id in (?) AND practice_id = ?';
              conn.query(sql, [questionId, practice_id], (error, result) => {
                if(error){
                  reject(error);
                }
                else{
                  console.log('enter');
                  resolve(result);
                }
                conn.release();
              })
            })
        ]);

        console.log(studentAnswer);
        let choiceId = studentAnswer.map(answer => answer.question_id);
        let textId =  studentTextAnswer.map(answer => answer.question_id);
        console.log('result.length:', question.length);
        let allInformation = [];
        if(question && question.length > 0){
          for (let i = 0; i < question.length; i++){
            let questionInfo = new Object();
            questionInfo.question_id = question[i].question_id;
            questionInfo.question_type = question[i].question_type;
            questionInfo.answer = '';
            questionInfo.student_answer = '';
            questionInfo.content = question[i].content;
            let answer_explain = '';
            if(question[i].question_type === "選擇題"){
              let options = await new Promise((resolve, reject) => {
                sql = 'SELECT option1, option2, option3, option4, answer_explain FROM choicequestion_detail where question_id = ?';
                conn.query(sql, question[i].question_id, (error, result) => {
                  if(error){
                    reject(error);
                  }
                  else{
                    resolve(result);
                  }
                  conn.release();
                });
              });
              
              console.log(options);
              if(options){
                questionInfo.option1 = options[0].option1;
                questionInfo.option2 = options[0].option2;
                questionInfo.option3 = options[0].option3;
                questionInfo.option4 = options[0].option4;
                answer_explain = options[0].answer_explain;
              }
              let index = question[i].answer.charCodeAt(0) - 64;
              index = 'option' + index;
              console.log(index);
              questionInfo.answer = questionInfo[index];
              console.log(questionInfo.answer);
              console.log(index);
              if(choiceId.includes(question[i].question_id)){
                questionInfo.student_answer = studentAnswer[choiceId.indexOf(question[i].question_id)].student_answer;
              }
            }
            else{
              let gpt_response = await new Promise((resolve, reject) => {
                sql = 'SELECT gpt_answer, gpt_explain, answer FROM practice_text_answer JOIN question_lib ON practice_text_answer.question_id = question_lib.question_id where question_lib.question_id = ? AND practice_id = ?';
                conn.query(sql, [question[i].question_id, practice_id], (error, result) => {
                  if(error){
                    reject(error);
                  }
                  else{
                    resolve(result);
                  }
                  conn.release();
                });
              });
              
              if(gpt_response && gpt_response.length > 0){
                questionInfo.answer = gpt_response[0].answer;
                answer_explain = gpt_response[0].gpt_explain;
              }
              if(textId.includes(question[i].question_id)){
                questionInfo.student_answer = studentTextAnswer[textId.indexOf(question[i].question_id)].student_answer;
              }

            }
            
            questionInfo.explain = answer_explain;
            allInformation[i] = questionInfo;
          }
          console.log("allInformation: " + allInformation);
          resolve(allInformation);
        }
        else{
          console.log("no answer");
          resolve(allInformation)
        }
        conn.release();
      }
    });
  });
};



// 辰翰 8/4 獲取question_lib所有資料
const GetAllQuestion = (isVerified) => {

  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connectionError, conn) => {
          if(connectionError) {
            console.log("資料庫錯誤了!\n錯誤內容: ");
            console.log(connectionError);
            reject(connectionError);
          }
          else {

            let result_array = {
              choiceQues_array: [],
              shortAnsQues_array: []
            }

            let remainingQueries = 2;

            const check_queryFinished = () => {

              remainingQueries--;

              // 兩個SQL請求做完後才能呼叫resolve
              if(remainingQueries == 0) {
                // console.log(result_array);
                resolve(result_array);
                conn.release();
              }

            }
            
            // 獲取所有選擇題內容
            let mysqlbody = 
              `
                SELECT
                  question_lib.question_id,
                  question_lib.exam_type,
                  question_lib.question_type, 
                  GROUP_CONCAT(concept_lib.concept_id ORDER BY concept_lib.concept_id SEPARATOR ', ') AS concept_ids,
                  GROUP_CONCAT(concept_lib.concept_name ORDER BY concept_lib.concept_id SEPARATOR ', ') AS concept_names,
                  question_lib.degree,
                  question_lib.content,
                  choicequestion_detail.option1,
                  choicequestion_detail.option2,
                  choicequestion_detail.option3,
                  choicequestion_detail.option4,
                  question_lib.answer,
                  choicequestion_detail.answer_explain
                FROM 
                  question_lib
                JOIN 
                  question_concept ON question_lib.question_id = question_concept.question_id
                JOIN 
                  concept_lib ON question_concept.concept_id = concept_lib.concept_id
                JOIN 
                  choicequestion_detail ON question_lib.question_id = choicequestion_detail.question_id
                WHERE
                  question_lib.question_type = '選擇題' AND
                  question_lib.isVerified = ${isVerified}
                GROUP BY 
                  question_lib.question_id
                ORDER BY
                  question_lib.question_id;
              `
            
            conn.query(
              mysqlbody,
              (error, result) => {
                if(error) {
                  console.log('幹SQL錯誤!!!!!!!!!!!\n錯誤內容: ', error);
                  reject(error);
                  conn.release();
                }
                else {
                  
                  // 把concept_ids與concept_names變成陣列
                  result = result.map(
                    ( { concept_ids, concept_names, ...rest } ) => (
                      {
                        ...rest,
                        concept_ids: concept_ids.split(',').map(id => id.trim()), // 將字串轉換為陣列
                        concept_names: concept_names.split(',').map(name => name.trim()) // 將字串轉換為陣列
                      }
                    )
                  );

                  result_array.choiceQues_array = result;
                  check_queryFinished();

                }
              }
            );

            // 獲取所有簡答題內容
            mysqlbody = 
              `
                SELECT
                  question_lib.question_id,
                  question_lib.exam_type,
                  question_lib.question_type, 
                  GROUP_CONCAT(concept_lib.concept_id ORDER BY concept_lib.concept_id SEPARATOR ', ') AS concept_ids,
                  GROUP_CONCAT(concept_lib.concept_name ORDER BY concept_lib.concept_id SEPARATOR ', ') AS concept_names,
                  question_lib.degree,
                  question_lib.content,
                  question_lib.answer
                FROM 
                  question_lib
                JOIN 
                  question_concept ON question_lib.question_id = question_concept.question_id
                JOIN 
                  concept_lib ON question_concept.concept_id = concept_lib.concept_id
                WHERE
                  question_lib.question_type = '簡答題' AND
                  question_lib.isVerified = ${isVerified}
                GROUP BY 
                  question_lib.question_id
                ORDER BY
                  question_lib.question_id;
              `

            conn.query(
              mysqlbody,
              (error, result) => {
                if(error) {
                  console.log('幹SQL錯誤!!!!!!!!!!!', error);
                  reject(error);
                  conn.release();
                }
                else {

                  // 把concept_ids與concept_names變成陣列
                  result = result.map(
                    ( { concept_ids, concept_names, ...rest } ) => (
                      {
                        ...rest,
                        concept_ids: concept_ids.split(',').map(id => id.trim()), // 將字串轉換為陣列
                        concept_names: concept_names.split(',').map(name => name.trim()) // 將字串轉換為陣列
                      }
                    )
                  );

                  result_array.shortAnsQues_array = result;
                  check_queryFinished();
                }
              }
            );

            
            
            
            

          }
        }
      );
    }
  );
}

// 辰翰 8/11 獲取concept_lib所有資料
const GetAllConcept = () => {
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
                  concept_lib.concept_id,
                  concept_lib.concept_name,
                  COUNT(question_lib.question_id) AS ques_count
              FROM
                  concept_lib
              LEFT JOIN question_concept
                ON concept_lib.concept_id = question_concept.concept_id
              LEFT JOIN question_lib
                ON question_concept.question_id = question_lib.question_id AND question_lib.isVerified = 1
              GROUP BY
                  concept_lib.concept_id,
                  concept_lib.concept_name;
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

// 辰翰 8/13 新增概念
const addConcept = (concept_name) => {

  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {
          if(connError) {
            reject(connError);
          }
          else {
            let mysqlbody = `INSERT INTO concept_lib (concept_name) VALUES ('${concept_name}');`
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

// 辰翰 8/13 刪除概念(連帶相關的題目一起刪除)
const removeConcept = (inputValues) => {

  const concept_id = inputValues.concept_id;

  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {
          if(connError) {
            reject(connError);
          }
          else {

            let mysqlbody = `DELETE FROM concept_lib WHERE concept_id = ${concept_id};`

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

// 辰翰 8/13 修改概念
const modifyConcept = (inputValues) => {

  console.log(inputValues);

  const concept_id = inputValues.concept_id;
  const concept_name = inputValues.concept_name;

  console.log('修改: ' + concept_id);
  console.log("OH MY CONCEPT!?");

  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {
          if(connError) {
            reject(connError);
          }
          else {

            let mysqlbody = `UPDATE concept_lib SET concept_name = '${concept_name}' WHERE concept_id = ${concept_id};`
            console.log(mysqlbody);

            conn.query (
              mysqlbody,
              (error, result) => {
                if(error) {
                  console.log('幹SQL錯誤!!!!!!!!!!!', error);
                  reject(error);
                }
                else {
                  console.log('SQL成功嗎!!!!!!!!!!!!');
                  console.log('結果為:' + result);
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

// 辰翰 8/16 新增題目
const addQuestion = (inputValues) => {

  const question_type = inputValues.question_type;
  const exam_type = inputValues.exam_type;
  const degree = inputValues.degree;
  const content = inputValues.content;
  const option1 = inputValues.option1;
  const option2 = inputValues.option2;
  const option3 = inputValues.option3;
  const option4 = inputValues.option4;
  const answer = inputValues.answer && inputValues.answer.trim() !== '' ? inputValues.answer : '此題未輸入答案';
  const explain = inputValues.explain && inputValues.explain.trim() !== '' ? inputValues.explain : '此題未輸入解釋';

  let concept_ids = inputValues.concept_ids;

  if(!concept_ids) {
    concept_ids = ['1'];
  }

  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {
          if(connError) {
            reject(connError);
          }
          else {

            if(question_type == '選擇題') {

              conn.beginTransaction(
                err => {
                  if(err) {
                    reject(err);
                  }
                  else {

                    let mysqlbody = 
                      `
                        INSERT INTO question_lib (question_type, exam_type, degree, content, answer)
                        VALUES ('${question_type}', '${exam_type}', '${degree}', '${content}', '${answer}');
                      `
                    conn.query (
                      mysqlbody,
                      (error, result) => {
                        if(error) {
                          console.log('幹SQL錯誤！', error);
                          reject(error);
                        }
                        else {

                          const lastQuestionId = result.insertId;

                          mysqlbody = 
                          `
                            INSERT INTO choicequestion_detail (option1, option2, option3, option4, answer_explain, question_id)
                            VALUES ('${option1}', '${option2}', '${option3}', '${option4}', '${explain}', '${lastQuestionId}');
                          `

                          conn.query(
                            mysqlbody, 
                            (error, result) => {

                              if (error) {
                                conn.rollback( // 如果這裡出錯就撤回前一個SQL請求
                                  () => {
                                    reject(error);
                                  }
                                )
                              }

                              else {

                                const insertPromises = concept_ids.map(

                                  concept_id => {
        
                                    return new Promise(
                                      (insertResolve, insertReject) => {
        
                                        let insertQuery = `
                                          INSERT INTO question_concept
                                            (question_id, concept_id)
                                          VALUES
                                            (${lastQuestionId}, ${concept_id})`;
        
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
                        
                      }
                    )

                  }
                }
              )

            }
            else if(question_type == '簡答題') {

              conn.beginTransaction(
                err => {
                  if(err) {
                    reject(err);
                  }
                  else {
                    
                    let mysqlbody = 
                      `
                        INSERT INTO question_lib
                          (question_type, exam_type, degree, content, answer)
                        VALUES
                          ('${question_type}', '${exam_type}', '${degree}', '${content}', '${answer}');
                      `

                    conn.query (
                      mysqlbody,
                      (error, result) => {
                        if(error) {
                          console.log('幹SQL錯誤！', error);
                          reject(error);
                        }
                        else {

                          const lastQuestionId = result.insertId;
                          
                          const insertPromises = concept_ids.map(

                            concept_id => {

                              return new Promise(
                                (insertResolve, insertReject) => {

                                  let insertQuery = `
                                    INSERT INTO question_concept
                                      (question_id, concept_id)
                                    VALUES
                                      (${lastQuestionId}, ${concept_id})`;

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
                }
              )

            }
            

          }
        }
      )
    }
  )

}

// 辰翰 8/17 刪除概念(純刪除概念)
const removeConceptOnly = (inputValues) => {

  const concept_id = inputValues.concept_id;

  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {
          if(connError) {
            reject(connError);
          }
          else {

            conn.beginTransaction(
              err => {
                if(err) {
                  reject(err);
                }
                else {

                  let mysqlbody = 
                    `
                      UPDATE question_lib
                      SET concept_id = 1
                      WHERE concept_id = ${concept_id};
                    `
                  
                  conn.query (
                    mysqlbody,
                    (error, result) => {
                      if(error) {
                        console.log('幹SQL錯誤！', error);
                        reject(error);
                      }
                      else {

                        mysqlbody = `DELETE FROM concept_lib WHERE concept_id = ${concept_id};`

                        conn.query(
                          mysqlbody, 
                          (error, result) => {

                            if (error) {
                              conn.rollback( // 如果這裡出錯就撤回前一個SQL請求
                                () => {
                                  reject(error);
                                }
                              )
                            }

                            else {
                              conn.commit(
                                  (err) => {
                                    if (err) {
                                      conn.rollback(() => {
                                        reject(err);
                                      });
                                    }
                                    else {
                                      console.log('SQL終於成功了喔！');
                                      console.log('結果為:' + result);
                                      resolve(result);
                                    }
                                    conn.release();
                                }
                              );
                            }

                          }
                        )


                        
                        
                      }
                      
                    }
                  )






                }
              }
            )



            
            

            
            
          }
        }
      )
    }
  )

}

// 辰翰 8/17 刪除題目
const removeQuestion = (inputValues) => {

  const selected_ques = inputValues.selected_ques;

  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {

          if(connError) {
            reject(connError);
          }
          else {

            const removePromises = selected_ques.map(

              question_id => {

                return new Promise(
                  (addResolve, addReject) => {

                    let mysqlbody = `
                      DELETE FROM
                        question_lib
                      WHERE
                        question_id = ${question_id};`

                    conn.query(
                      mysqlbody,
                      (removeError) => {
                        if(removeError) {
                          addReject(removeError);
                        }
                        else {
                          addResolve();
                        }
                      }
                    )

                  }
                )

              }

            )
            
            Promise.all(removePromises)
              .then(
                () => {
                  console.log('所選題目刪除成功！')
                  conn.release();
                  resolve();
                }
              )
              .catch(
                (error) => {
                  console.log('錯誤!!!!!!!!!!!!!題目刪除失敗');
                  reject(error);
                }
              )

          }
        }
      )
    }
  )

}

// 辰翰 8/17 修改題目
const modifyQuestion = (inputValues) => {

  const question_id = inputValues.question_id;
  const question_type = inputValues.question_type;
  const exam_type = inputValues.exam_type;
  const degree = inputValues.degree;
  const content = inputValues.content;
  const option1 = inputValues.option1;
  const option2 = inputValues.option2;
  const option3 = inputValues.option3;
  const option4 = inputValues.option4;
  const answer = inputValues.answer && inputValues.answer.trim() !== '' ? inputValues.answer : '此題未輸入答案';
  const explain = inputValues.explain && inputValues.explain.trim() !== '' ? inputValues.explain : '此題未輸入解釋';

  let concept_ids = inputValues.concept_ids;

  if(!concept_ids) {
    concept_ids = ['1'];
  }

  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {
          if(connError) {
            reject(connError);
          }
          else {
            
            if(question_type == '選擇題') {
              conn.beginTransaction(
                err => {
                  if(err) {
                    reject(err);
                  }
                  else {

                    // 寫入question_lib
                    let mysqlbody = 
                      `
                        UPDATE
                          question_lib
                        SET 
                          exam_type = '${exam_type}',
                          degree = '${degree}',
                          content = '${content}',
                          answer = '${answer}'
                        WHERE
                          question_id = ${question_id};
                      `

                      conn.query(
                        mysqlbody,
                        (error, result) => {

                          if(error) {
                            console.log('幹SQL錯誤！', error);
                            reject(error);
                          }
                        
                          else {

                            // 寫入選項
                            mysqlbody = `
                              UPDATE
                                choicequestion_detail
                              SET
                                option1 = '${option1}',
                                option2 = '${option2}',
                                option3 = '${option3}',
                                option4 = '${option4}',
                                answer_explain = '${explain}'
                              WHERE
                                question_id = ${question_id};
                            `

                            conn.query(
                              mysqlbody,
                              (error, result) => {

                                if (error) {
                                  conn.rollback( // 如果這裡出錯就撤回前一個SQL請求
                                    () => {
                                      console.log('幹SQL錯誤！', error);
                                      reject(error);
                                    }
                                  )
                                }

                                else {

                                  // 刪除此題所有概念
                                  mysqlbody = `
                                    DELETE FROM
                                      question_concept
                                    WHERE
                                      question_id = ${question_id};
                                  `

                                  conn.query(
                                    mysqlbody,
                                    (error, result) => {

                                      if (error) {
                                        conn.rollback( // 如果這裡出錯就撤回前一個SQL請求
                                          () => {
                                            reject(error);
                                          }
                                        )
                                      }

                                      else {

                                        // 若輸入概念為空，則不做新增，並且commit delete請求
                                        if(concept_ids == ['1']) {
                                          conn.commit(
                                            (err) => {
                                              if (err) {
                                                conn.rollback(
                                                  () => {
                                                    reject(err);
                                                  }
                                                );
                                              }
                                              else {
                                                console.log('SQL終於成功了喔！');
                                                resolve(result);
                                              }
                                              conn.release();
                                            }
                                          );
                                        }

                                        // 若輸入概念非空
                                        else {
                                          
                                          const insertPromises = concept_ids.map(

                                            concept_id => {
                
                                              return new Promise(
                                                (insertResolve, insertReject) => {
                
                                                  let insertQuery = `
                                                    INSERT INTO question_concept
                                                      (question_id, concept_id)
                                                    VALUES
                                                      (${question_id}, ${concept_id})`;
                
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

                                    }
                                  )

                                }

                              }
                            )

                          }

                        }
                      )

                  }
                }
              )
            }
            
            else if(question_type == '簡答題') {

              console.log('幹簡答題');

              conn.beginTransaction(
                err => {

                  if(err) {
                    reject(err);
                  }

                  else {

                    let mysqlbody = `
                      UPDATE
                        question_lib
                      SET 
                        exam_type = '${exam_type}',
                        degree = '${degree}',
                        content = '${content}',
                        answer = '${answer}'
                      WHERE
                        question_id = ${question_id};
                    `

                    conn.query (
                      mysqlbody,
                      (error, result) => {

                        if(error) {
                          console.log('幹SQL錯誤！', error);
                          reject(error);
                        }

                        else {
                          
                          // 刪除此題所有概念
                          mysqlbody = `
                            DELETE FROM
                              question_concept
                            WHERE
                              question_id = ${question_id};
                          `

                          conn.query(
                            mysqlbody,
                            (error, result) => {

                              if (error) {
                                conn.rollback( // 如果這裡出錯就撤回前一個SQL請求
                                  () => {
                                    reject(error);
                                  }
                                )
                              }

                              else {

                                // 若輸入概念為空，則不做新增，並且commit delete請求
                                if(concept_ids == ['1']) {
                                  conn.commit(
                                    (err) => {
                                      if (err) {
                                        conn.rollback(
                                          () => {
                                            reject(err);
                                          }
                                        );
                                      }
                                      else {
                                        console.log('SQL終於成功了喔！');
                                        resolve(result);
                                      }
                                      conn.release();
                                    }
                                  );
                                }

                                // 若輸入概念非空
                                else {
                                  
                                  const insertPromises = concept_ids.map(

                                    concept_id => {
        
                                      return new Promise(
                                        (insertResolve, insertReject) => {
        
                                          let insertQuery = `
                                            INSERT INTO question_concept
                                              (question_id, concept_id)
                                            VALUES
                                              (${question_id}, ${concept_id})`;
        
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

                            }
                          )

                        }

                      }
                    )

                  }

                }
              )

            }
            
          }
        }
      )
    }
  )

}

// 辰翰 8/18 獲取所有課程
const getAllClass = () => {
  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {
          if(connError) {
            reject(connError);
          }
          else {
            let mysqlbody = `SELECT * FROM class_lib`
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

// 辰翰 8/18 獲取所有週次概念
const getAllWeekConcept = () => {
  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connectionError, conn) => {
          if(connectionError) {
            console.log("資料庫錯誤了!\n錯誤內容: ");
            console.log(connectionError);
            reject(connectionError);
          }
          else {

            let result_class;
            let result_classStudent;

            let result_array = {result_class, result_classStudent}

            let remainingQueries = 2;

            const check_queryFinished = () => {

              remainingQueries--;

              // 兩個SQL請求做完後才能呼叫resolve
              if(remainingQueries == 0) {





                let result_final = result_array.result_class.map(
                  (classItem) => {
                    // 對每個課程建立一個18週資料的陣列
                    let weekTable_data = Array.from(
                      { length: 18 },
                      (_, weekIndex) => {
                        return {
                          week: weekIndex + 1,
                          concepts: []
                        };
                      }
                    );
                    
                    // 填入week_concept中的資料
                    result_array.result_classStudent.forEach(
                      (conceptItem) => {
                        if(conceptItem.class_id === classItem.class_id) {
                          let weekData = weekTable_data[conceptItem.week - 1]; // 找到正確的週次
                          weekData.concepts.push(conceptItem.concept_name);
                        }
                      }
                    );
                  
                    return {
                      class_id: classItem.class_id,
                      class_name: classItem.class_name,
                      weekTable_data: weekTable_data
                    };
                  }
                );
                
                resolve(result_final);
                conn.release();

              }

            }
            
            // 獲取class_lib所有內容
            let mysqlbody = `SELECT * FROM class_lib`
            
            conn.query(
              mysqlbody,
              (error, result) => {
                if(error) {
                  console.log('幹SQL錯誤!!!!!!!!!!!\n錯誤內容: ', error);
                  reject(error);
                  conn.release();
                }
                else {
                  
                  result_array.result_class = result;
                  check_queryFinished();

                }
              }
            );

            // 獲取week_concept所有內容
            mysqlbody = `
              SELECT
                week_concept.week,
                class_lib.class_name,
                class_lib.class_id,
                concept_lib.concept_name
              FROM
                week_concept
              JOIN
                class_lib ON week_concept.class_id = class_lib.class_id
              JOIN
                concept_lib ON week_concept.concept_id = concept_lib.concept_id;`

            conn.query(
              mysqlbody,
              (error, result) => {
                if(error) {
                  console.log('幹SQL錯誤!!!!!!!!!!!', error);
                  reject(error);
                  conn.release();
                }
                else {
                  result_array.result_classStudent = result;
                  check_queryFinished();
                }
              }
            );

            
            
            
            

          }
        }
      );
    }
  );
}

// 辰翰 8/18 修改週次概念
const modifyWeekConcept = (inputValues) => {

  const class_id = inputValues.class_id;
  const week = inputValues.week;
  const concepts = inputValues.concepts;

  console.log(inputValues);
  
  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {
          if (connError) {
            reject(connError);
          }
          else {

            const handleError = (err) => {
              conn.rollback(
                () => {
                  conn.release();
                  reject(err);
                }
              );
            };

            conn.beginTransaction(
              err => {
                if (err) {
                  handleError(err);
                }
                else {

                  let deleteQuery = `DELETE FROM week_concept WHERE week = ${week} AND class_id = ${class_id}`;

                  conn.query(deleteQuery,
                    (error) => {

                      if (error) {
                        handleError(error);
                      }

                      // 若輸入概念非空
                      else if (concepts && concepts.length > 0) {

                        const insertPromises = concepts.map(

                          concept_id => {

                            return new Promise(

                              (insertResolve, insertReject) => {

                                let insertQuery = `INSERT INTO week_concept (week, class_id, concept_id) VALUES (${week}, ${class_id}, ${concept_id})`;

                                conn.query(insertQuery, (insertError) => {
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

                        Promise.all(insertPromises)
                          .then(
                            () => {
                              conn.commit(
                                commitError => {
                                  if (commitError) {
                                    handleError(commitError);
                                  }
                                  else {
                                    console.log('SQL成功執行！');
                                    conn.release();
                                    resolve();
                                  }
                                }
                              );
                            }
                          )
                          .catch(handleError);
                        
                      }

                      // 若輸入概念為空，則不做新增，並且commit deleteQuery
                      else {
                        conn.commit(
                          commitError => {
                            if (commitError) {
                              handleError(commitError);
                            }
                            else {
                              console.log('SQL成功執行！');
                              conn.release();
                              resolve();
                            }
                          }
                        );
                      }

                    }
                  );

                }
              }
            );
          }
        }
      );
    }
  );

}

// 辰翰 8/21 獲取所有學生
const getAllStudent = () => {
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
                login_id,
                username
              FROM login`

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

// 辰翰 8/22 獲取所有課程學生
const getAllClassStudent = (inputValues) => {

  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connectionError, conn) => {
          if(connectionError) {
            console.log("資料庫錯誤了!\n錯誤內容: ");
            console.log(connectionError);
            reject(connectionError);
          }
          else {

            let result_class;
            let result_classStudent;

            let result_array = {result_class, result_classStudent}

            let remainingQueries = 2;

            const check_queryFinished = () => {

              remainingQueries--;
            
              if (remainingQueries == 0) {

                const { result_class, result_classStudent } = result_array;
            
                const result_final = result_class.map(classItem => {
                  // 找到該課程的所有學生 login_id 和 username
                  const students = result_classStudent
                    .filter(student => student.class_id === classItem.class_id)
                    .map(student => ({
                      login_id: student.login_id,
                      username: student.username
                    }));
            
                  // 組裝結果格式
                  return {
                    class_id: classItem.class_id,
                    class_name: classItem.class_name,
                    studentTable_data: students
                  };
                });
            
                console.log(result_final);
            
                resolve(result_final);
                conn.release();

              }
            }
            
            // 獲取class_lib所有內容
            let mysqlbody = `SELECT * FROM class_lib`
            
            conn.query(
              mysqlbody,
              (error, result) => {
                if(error) {
                  console.log('幹SQL錯誤!!!!!!!!!!!\n錯誤內容: ', error);
                  reject(error);
                  conn.release();
                }
                else {
                  
                  result_array.result_class = result;
                  check_queryFinished();

                }
              }
            );

            // 獲取class_student所有內容
            mysqlbody = `
              SELECT
                  class_student.class_id,
                  class_student.login_id,
                  login.username
                FROM 
                  class_student
                JOIN 
                  login ON class_student.login_id = login.login_id;`

            conn.query(
              mysqlbody,
              (error, result) => {
                if(error) {
                  console.log('幹SQL錯誤!!!!!!!!!!!', error);
                  reject(error);
                  conn.release();
                }
                else {
                  result_array.result_classStudent = result;
                  check_queryFinished();
                }
              }
            );

            
            
            
            

          }
        }
      );
    }
  );

}

// 辰翰 8/23 修改課程學生
const modifyClassStudent = (inputValues) => {

  const class_id = inputValues.class_id;
  const selected_student = inputValues.selected_student;

  console.log(inputValues);
  
  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {
          if (connError) {
            reject(connError);
          }
          else {

            const handleError = (err) => {
              conn.rollback(
                () => {
                  conn.release();
                  reject(err);
                }
              );
            };

            conn.beginTransaction(
              err => {
                if (err) {
                  handleError(err);
                }
                else {

                  let deleteQuery = `DELETE FROM class_student WHERE class_id = ${class_id}`;

                  conn.query(deleteQuery,
                    (error) => {

                      if (error) {
                        handleError(error);
                      }

                      // 若輸入概念非空
                      else if (selected_student && selected_student.length > 0) {

                        const insertPromises = selected_student.map(

                          login_id => {

                            return new Promise(

                              (insertResolve, insertReject) => {

                                let insertQuery = `INSERT INTO class_student (class_id, login_id) VALUES (${class_id}, ${login_id})`;

                                conn.query(insertQuery, (insertError) => {
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

                        Promise.all(insertPromises)
                          .then(
                            () => {
                              conn.commit(
                                commitError => {
                                  if (commitError) {
                                    handleError(commitError);
                                  }
                                  else {
                                    conn.release();
                                    resolve();
                                  }
                                }
                              );
                            }
                          )
                          .catch(handleError);
                        
                      }

                      // 若輸入概念為空，則不做新增，並且commit deleteQuery
                      else {
                        conn.commit(
                          commitError => {
                            if (commitError) {
                              handleError(commitError);
                            }
                            else {
                              conn.release();
                              resolve();
                            }
                          }
                        );
                      }

                    }
                  );

                }
              }
            );
          }
        }
      );
    }
  );

}

// 辰翰 8/23 透過login_id刪除課程學生
const removeStudentByIdFromClassStudent = (inputValues) => {

  const selected_students = inputValues.selected_students;
  const class_id = inputValues.class_id;

  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {

          if(connError) {
            reject(connError);
          }
          else {

            const removePromises = selected_students.map(

              login_id => {

                return new Promise(
                  (addResolve, addReject) => {

                    let mysqlbody = `
                      DELETE FROM
                        class_student
                      WHERE
                        class_id = ${class_id} AND
                        login_id = ${login_id};`

                    conn.query(
                      mysqlbody,
                      (removeError) => {
                        if(removeError) {
                          addReject(removeError);
                        }
                        else {
                          addResolve();
                        }
                      }
                    )

                  }
                )

              }

            )
            
            Promise.all(removePromises)
              .then(
                () => {
                  conn.release();
                  resolve();
                }
              )
              .catch(
                (error) => {
                  console.log('錯誤!!!!!!!!!!!!!學生刪除失敗');
                  
                  reject(error);
                }
              )

          }
        }
      )
    }
  )
  
}

// 辰翰 9/2 透過CSV檔新增題目
const addQuestionByCsv = (inputValues) => {

  const question_type = inputValues.params.question_type;
  const selected_questions = inputValues.params.selected_questions;

  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {

          if(connError) {
            reject(connError);
          }
          else {

            if(question_type == '選擇題') {

              const addPromises = selected_questions.map(

                question => {
  
                  return new Promise(
                    (addResolve, addReject) => {
                      
                      conn.beginTransaction(
                        err => {
                          if(err) {
                            addReject(err);
                          }
                          else {
        
                            let mysqlbody = 
                              `
                                INSERT INTO question_lib (question_type, exam_type, degree, content, answer)
                                VALUES ('選擇題', '${question.exam_type}', '${question.degree}', '${question.content}', '${question.answer}');
                              `
                            conn.query (
                              mysqlbody,
                              (error, result) => {
                                
                                if(error) {
                                  conn.rollback( // 如果這裡出錯就撤回前一個SQL請求
                                    () => {
                                      console.log('幹SQL錯誤！', error);
                                      addReject(error);
                                    }
                                  )
                                }

                                else {
        
                                  const lastQuestionId = result.insertId;
        
                                  mysqlbody = 
                                  `
                                    INSERT INTO choicequestion_detail (option1, option2, option3, option4, answer_explain, question_id)
                                    VALUES ('${question.option1}', '${question.option2}', '${question.option3}', '${question.option4}', '${question.answer_explain}', '${lastQuestionId}');
                                  `
                                  
                                  conn.query(
                                    mysqlbody, 
                                    (error, result) => {
        
                                      if (error) {
                                        conn.rollback( // 如果這裡出錯就撤回前一個SQL請求
                                          () => {
                                            console.log('幹SQL錯誤！', error);
                                            addReject(error);
                                          }
                                        )
                                      }
        
                                      else {

                                        const insertPromises = question.concept_ids.map(

                                          concept_id => {
                
                                            return new Promise(
                                              (insertResolve, insertReject) => {
                
                                                let insertQuery = `
                                                  INSERT INTO question_concept
                                                    (question_id, concept_id)
                                                  VALUES
                                                    (${lastQuestionId}, ${concept_id})`;
                
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
                                                    addResolve();
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
                                
                              }
                            )
                            
                          }
                        }
                      )

                    }
                  )
  
                }
  
              )
              
              Promise.all(addPromises)
                .then(
                  () => {
                    conn.release();
                    resolve();
                  }
                )
                .catch(
                  (error) => {
                    console.log('錯誤!!!!!!!!!!!!!CSV匯入失敗');
                    reject(error);
                  }
                )

            }
            else if(question_type == '簡答題') {

              const addPromises = selected_questions.map(

                question => {
  
                  return new Promise(
                    (addResolve, addReject) => {

                      conn.beginTransaction(
                        err => {

                          const handleError = (err) => {
                            conn.rollback(
                              () => {
                                conn.release();
                                addReject(err);
                              }
                            );
                          };

                          if(err) {
                            addReject(err);
                          }
                          else {

                            let mysqlbody = `
                              INSERT INTO question_lib
                                (question_type, exam_type, degree, content, answer)
                              VALUES
                                ('簡答題', '${question.exam_type}', '${question.degree}', '${question.content}', '${question.answer}');
                            `

                            conn.query (
                              mysqlbody,
                              (error, result) => {
                                if(error) {
                                  console.log('幹簡答題CSV匯入錯誤！', error);
                                  conn.release();
                                  addReject(error);
                                }
                                else {

                                  const lastQuestionId = result.insertId;

                                  const insertPromises = question.concept_ids.map(
                                    concept_id => {
                                      return new Promise(
                                        (insertResolve, insertReject) => {
          
                                          let insertQuery = `
                                            INSERT INTO question_concept
                                              (question_id, concept_id)
                                            VALUES
                                              (${lastQuestionId}, ${concept_id})`;
          
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
                                  )

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
                                              addResolve(result);
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
                        }
                      )
                      
                    }
                  )
  
                }
  
              )
              
              Promise.all(addPromises)
                .then(
                  () => {
                    conn.release();
                    resolve();
                  }
                )
                .catch(
                  (error) => {
                    console.log('幹簡答題CSV匯入錯誤！');
                    reject(error);
                  }
                )

            }

          }
        }
      )
    }
  )
  
}

// 辰翰 9/2 根據概念名稱獲取概念ID
const getConceptIdByName = (concept_name) => {
  
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
                concept_id
              FROM
                concept_lib
              WHERE
                concept_name = '${concept_name}';
            `

            conn.query (
              mysqlbody,
              (error, result) => {
                if(error) {
                  console.log('幹SQL錯誤!!!!!!!!!!!', error);
                  reject(error);
                }
                else {
                  resolve(result[0].concept_id);
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

// 辰翰 9/10 新增使用紀錄
const addRecord = (inputValues) => {

  function formatDateTime(date) {

    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);

    let hour = date.getHours();
    const minute = `0${date.getMinutes()}`.slice(-2);
    const second = `0${date.getSeconds()}`.slice(-2);

    const period = hour >= 12 ? '下午' : '上午';

    hour = hour % 12 || 12; // 取除 12 的餘數，若餘數為 0 則為 12
    const formattedHour = `0${hour}`.slice(-2); // 在前面補0且取最後兩位(確保始終以兩位數表示)

    const result = {
        formattedDate: `${year}/${month}/${day}`,
        formattedTime: `${period} ${formattedHour}:${minute}:${second}`
    }

    return result;

  }

  const date = new Date();
  const taipeiTime = new Date(date.toLocaleString( 'en-US', { timeZone: 'Asia/Taipei' } ));
  const formattedDateTime = formatDateTime( taipeiTime );

  const record_date = formattedDateTime.formattedDate;
  const record_time = formattedDateTime.formattedTime;
  const username = inputValues.username;
  const record_action = inputValues.action;

  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {
          if(connError) {
            reject(connError);
          }
          else {
            let mysqlbody = `
              INSERT INTO
                record_lib (record_date, record_time, username, record_action)
              VALUES
                ('${record_date}', '${record_time}', '${username}', '${record_action}');`
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

// 辰翰 9/10 獲取所有使用紀錄
const GetAllRecord = () => {

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
                record_lib
              ORDER BY 
                record_id DESC;`
            
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

// 羽喬 9/13 抓舊密碼
const CheckPassword = (username, password) => {
  // console.log('接收到的用户名: ', username);
  console.log('接收到的密码: ', password);
  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {
          if(connError) {
            reject(connError);
          }
          else {
            let mysqlbody = `SELECT password FROM login WHERE username = ?;`
            conn.query (
              mysqlbody,
              [username],
              (error, result) => {
                if(error) {
                  console.log('幹SQL錯誤!!!!!!!!!!!', error);
                  reject(error);
                }
                else {
                  console.log(result);
                  
                  const dbPassword = result[0].password;
                  const isSamePassword = (dbPassword === password);
                  console.log('dasssssssssssssssssssss');
                  
                  resolve({ isSamePassword:isSamePassword });
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

// 羽喬 9/11 更新使用者密碼
const ChangePassword = (username, newPassword) => {
  console.log('接收到的用户名: ', username);
  console.log('接收到的新密码: ', newPassword);
  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {
          if(connError) {
            reject(connError);
          }
          else {
            let mysqlbody = `UPDATE login SET password = ? WHERE username = ?;`
            conn.query (
              mysqlbody,
              [newPassword, username],
              (error, result) => {
                if(error) {
                  console.log('幹SQL錯誤!!!!!!!!!!!', error);
                  reject(error);
                }
                else {
                  // console.log(result)
                  resolve({result:true});
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

// 辰翰 9/12 獲取註冊表資料
const GetAllRegistry = () => {

  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {
          if(connError) {
            reject(connError);
          }
          else {



            // 照註冊順序排序
            let mysqlbody = `SELECT * FROM registry_lib ORDER BY registry_lib.registry_id;`
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


// 辰翰 9/12 新增學號到註冊表
const addUserToRegistry = (inputValues) => {

  const selected_user = inputValues.selected_user;
  const registryTable_data = inputValues.registryTable_data;
  
  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {
          if(connError) {
            reject(connError);
          }
          else {

            let successCount = 0;
            let failureCount = 0;

            const addPromises = selected_user.map(
              user => {

                // 驗證輸入之學號是否合法 ----------------------
                let isLegal = true;

                if(!user.username) {
                  isLegal = false;
                  failureCount++;
                }
                else if( ! /^\d{10}$/.test(user.username) ) {
                  isLegal = false;
                  failureCount++;
                }
                else {
                  const isDuplicate = registryTable_data.some(
                    (existedUser) => existedUser.username == user.username
                  )
                  if(isDuplicate) {
                    isLegal = false;
                    failureCount++;
                  }
                }
                // 驗證輸入之學號是否合法 END ----------------------

                if(isLegal == true) {

                  successCount++;

                  return new Promise(
                    (addResolve, addReject) => {
                      
                      let mysqlbody = 
                        `
                          INSERT INTO registry_lib (username)
                          VALUES ('${user.username}');
                        `
            
                      conn.query (
                        mysqlbody,
                        (error, result) => {
                          if(error) {
                            console.log('幹註冊表excel匯入錯誤！', error);
                            addReject(error);
                          }
                          else {
                            addResolve(result);
                          }
                          conn.release();
                        }
                      )
                      
                    }
                  )
                }

              }
            )

            Promise.all(addPromises)
                .then(
                  () => {
                    
                    conn.release();

                    const result = {
                      successCount: successCount,
                      failureCount: failureCount
                    }

                    resolve(result);

                  }
                )
                .catch(
                  (error) => {
                    console.log('錯誤!!!!!!!!!!!!!');
                    reject(error);
                  }
                )

          }
        }
      )
    }
  )

}

// 辰翰 9/12 根據ID刪除註冊表中學號
const removeUserFromRegistry = (inputValues) => {

  const selected_user = inputValues.selected_user;

  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {
          if(connError) {
            reject(connError);
          }
          else {

            const removePromises = selected_user.map(
              registry_id => {
          
                return new Promise(
                  (addResolve, addReject) => {

                    let mysqlbody = `
                      DELETE FROM
                        registry_lib
                      WHERE
                        registry_id = ${registry_id};`
          
                    conn.query (
                      mysqlbody,
                      (error, result) => {
                        if(error) {
                          console.log('幹刪除錯誤！', error);
                          addReject(error);
                        }
                        else {
                          addResolve(result);
                        }
                        conn.release();
                      }
                    )
                    
                  }
                )
          
              }
            )

            Promise.all(removePromises)
              .then(
                () => {
                  conn.release();
                  resolve();
                }
              )
              .catch(
                (error) => {
                  console.log('錯誤!!!!!!!!!!!!!');
                  reject(error);
                }
              )

          }
        }
      )
    }
  )

}

// 辰翰 10/4 獲取question_lib所有question_id
const getAllQuestionIdFromQuestionLib = () => {

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
                question_id
              FROM
                question_lib
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

// 辰翰 10/4 獲取question_concept所有question_id
const getAllQuestionIdFromQuestionConcept = () => {

  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {
          if(connError) {
            reject(connError);
          }
          else {

            let mysqlbody = `
              SELECT DISTINCT
                question_id
              FROM
                question_concept
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

// 辰翰 10/4 為沒有概念的題目加上default概念
const addDefaultConcept = (question_ids) => {

  return new Promise(
    (resolve, reject) => {
      pool.getConnection(
        (connError, conn) => {
          if(connError) {
            reject(connError);
          }
          else {

            const addPromises = question_ids.map(
              question => {
          
                return new Promise(
                  (addResolve, addReject) => {

                    let mysqlbody = `
                      INSERT INTO
                        question_concept (question_id, concept_id)
                      VALUES
                        ('${question.question_id}', 1);
                    `
                    
                    conn.query (
                      mysqlbody,
                      (error, result) => {
                        if(error) {
                          console.log('幹新增錯誤！', error);
                          addReject(error);
                        }
                        else {
                          addResolve(result);
                        }
                        conn.release();
                      }
                    )
                    
                  }
                )
          
              }
            )

            Promise.all(addPromises)
              .then(
                () => {
                  conn.release();
                  resolve();
                }
              )
              .catch(
                (error) => {
                  console.log('錯誤!!!!!!!!!!!!!');
                  reject(error);
                }
              )

          }
        }
      )
    }
  )

}

// 辰翰 10/25 輸入0或1，更改題目之驗證狀態
const modifyQuesVerification = (isVerified, question_id) => {

  console.log(isVerified);
  console.log(question_id);

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
                question_lib
              SET
                isVerified = '${isVerified}'
              WHERE
                question_id = ${question_id};`

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
// 嘉盛 11/11 上傳小幫手用戶的query
const UploadUserQuery = (insertValues) => {
  return new Promise((resolve, reject) => {
    // 獲取資料庫連接
    pool.getConnection((connectionError, conn) => {
      if (connectionError) {
        reject(connectionError);
      } else {
        console.log("Connecting to database...");
        console.log(insertValues);

        // 從 insertValues 中解構需要的欄位
        const { user_id, user_query, user_query_time } = insertValues.params;

        // 檢查輸入資料
        if (!user_id || !user_query) {
          conn.release();
          return reject(new Error('Missing required fields: user_id or user_query'));
        }

        // SQL 插入語句
        const sql = `
          INSERT INTO helper_conversation_record (user_id, user_query, user_query_time)
          VALUES (?, ?, ?)
        `;

        // 執行資料庫插入
        conn.query(sql, [user_id, user_query, user_query_time], (error, result) => {
          if (error) {
            console.error("Error inserting data:", error);
            reject(error);
          } else {
            console.log("Data inserted successfully");
            resolve(result);
          }
          // 釋放資料庫連接
          conn.release();
        });
      }
    });
  });
};
// 嘉盛 11/12 把用戶的query傳給gpt並得到回應
const GetGptResponse = (user_id, user_query, user_query_time) => {
  return new Promise(async (resolve, reject) => {
    console.log("Triggering GPT response process...");
    console.log(`Received parameters: user_id=${user_id}, user_query=${user_query}, user_query_time=${user_query_time}`);

    try {
      // Step 1: 查詢最近3筆歷史對話，排除當前最新問題
      const sql = `
        SELECT user_query, gpt_response, user_query_time
        FROM helper_conversation_record
        WHERE user_id = ?
          AND user_query_time < ? -- 排除最新的這筆紀錄
        ORDER BY user_query_time DESC
        LIMIT 3
      `;

      const historyResults = await new Promise((resolve, reject) => {
        pool.getConnection((connError, conn) => {
          if (connError) {
            return reject(connError);
          }
          conn.query(sql, [user_id, user_query_time], (error, results) => {
            conn.release();
            if (error) {
              return reject(error);
            }
            resolve(results);
          });
        });
      });

      console.log('History Results:', historyResults);

      // 格式化對話歷史
      let conversationHistory = '';
      for (let i = historyResults.length - 1; i >= 0; i--) {
        const record = historyResults[i];
        conversationHistory += `User: ${record.user_query}\nAssistant: ${record.gpt_response}\n`;
      }

      console.log('Conversation History:', conversationHistory);

      // Step 2: 呼叫 Python 腳本
      const pythonProcess = spawn('python', ['gpt_response.py', user_query, conversationHistory]);
      // product version
      // const pythonProcess = exec(`/usr/src/app/venv/bin/python gpt_response.py '${user_query}' '${conversationHistory}' `, (error, stdout, stderr) => {
      //   if (error) {
      //     console.error(`exec error: ${error}`);
      //     return;
      //   }
      //   console.log(`Python output: ${stdout}`);
      // }); 
      let result = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python error: ${data}`);
      });

      pythonProcess.on('close', async (code) => {
        if (code !== 0) {
          return reject(new Error('Python script failed'));
        }

        try {
          // Step 3: 處理 GPT 回應
          const responseJson = JSON.parse(result);
          const gpt_response = responseJson.response;
          const retrieved_docs = responseJson.retrieved_docs
          let date = new Date()
          const gpt_response_time = formatDateTime(date)
          console.log("檢索到的文檔:", retrieved_docs);
          console.log("GPT response received:", gpt_response);

          // Step 4: 更新資料庫
          const updateSql = `
            UPDATE helper_conversation_record
            SET gpt_response = ?, gpt_response_time = ?
            WHERE user_id = ? AND user_query_time = ?
          `;

          await new Promise((resolve, reject) => {
            pool.getConnection((connError, conn) => {
              if (connError) {
                return reject(connError);
              }
              conn.query(updateSql, [gpt_response, gpt_response_time, user_id, user_query_time], (error, result) => {
                conn.release();
                if (error) {
                  return reject(error);
                }
                resolve(result);
              });
            });
          });

          // 回傳結果
          resolve(gpt_response);
        } catch (error) {
          console.error('Failed to parse Python script output:', error);
          reject(error);
        }
      });
    } catch (err) {
      reject(err);
    }
    function formatDateTime(date) {
      const d = new Date(date);
      const taipeiTime = new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
      const year = taipeiTime.getFullYear();
      const month = `0${taipeiTime.getMonth() + 1}`.slice(-2);
      const day = `0${taipeiTime.getDate()}`.slice(-2);
      const hour = `0${taipeiTime.getHours()}`.slice(-2);
      const minute = `0${taipeiTime.getMinutes()}`.slice(-2);
      const second = `0${taipeiTime.getSeconds()}`.slice(-2);
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  });
};






module.exports.GetTestTime = GetTestTime;
module.exports.GetQuestion = GetQuestion;
module.exports.GetQuestionDetail = GetQuestionDetail;
module.exports.upload_student_table = upload_student_table;
module.exports.GetStudentTable = GetStudentTable;
module.exports.CatchStudentTable = CatchStudentTable;
module.exports.GetAnswer = GetAnswer;
module.exports.GetGptJudge = GetGptJudge;
module.exports.upload_practice_table = upload_practice_table;
module.exports.GetWeek = GetWeek;
module.exports.GetClass = GetClass;
module.exports.GetPermission = GetPermission;
module.exports.GetPracticeRecord = GetPracticeRecord;
module.exports.UploadPracticeRecord = UploadPracticeRecord;
module.exports.UpdatePracticeRecord = UpdatePracticeRecord;
module.exports.GetPracticeQuestionId = GetPracticeQuestionId;
module.exports.UplocadPracticeQuestion = UplocadPracticeQuestion;
module.exports.GetQuestionInformation = GetQuestionInformation;
module.exports.GetQuestinFrequency = GetQuestinFrequency;

// 辰翰 8/4
module.exports.GetAllQuestion = GetAllQuestion;
// 辰翰 8/11
module.exports.GetAllConcept = GetAllConcept;
// 辰翰 8/13
module.exports.addConcept = addConcept;
// 辰翰 8/13
module.exports.removeConcept = removeConcept;
// 辰翰 8/13
module.exports.modifyConcept = modifyConcept;
// 辰翰 8/16
module.exports.addQuestion = addQuestion;
// 辰翰 8/17
module.exports.removeConceptOnly = removeConceptOnly;
// 辰翰 8/17
module.exports.removeQuestion = removeQuestion;
// 辰翰 8/17
module.exports.modifyQuestion = modifyQuestion;
// 辰翰 8/18
module.exports.getAllClass = getAllClass;
// 辰翰 8/18
module.exports.getAllWeekConcept = getAllWeekConcept;
// 辰翰 8/18
module.exports.modifyWeekConcept = modifyWeekConcept;
// 辰翰 8/21
module.exports.getAllStudent = getAllStudent;
// 辰翰 8/22
module.exports.getAllClassStudent = getAllClassStudent;
// 辰翰 8/23
module.exports.modifyClassStudent = modifyClassStudent;
// 辰翰 8/23
module.exports.removeStudentByIdFromClassStudent = removeStudentByIdFromClassStudent;
// 辰翰 9/2
module.exports.addQuestionByCsv = addQuestionByCsv;
// 辰翰 9/2
module.exports.getConceptIdByName = getConceptIdByName;
// 辰翰 9/10
module.exports.addRecord = addRecord;
// 辰翰 9/10
module.exports.GetAllRecord = GetAllRecord;
// 羽喬 9/12
module.exports.ChangePassword = ChangePassword;
// 羽喬 9/13
module.exports.CheckPassword = CheckPassword;
// 辰翰 9/12
module.exports.GetAllRegistry = GetAllRegistry;
// 辰翰 9/12
module.exports.addUserToRegistry = addUserToRegistry;
// 辰翰 9/12
module.exports.removeUserFromRegistry = removeUserFromRegistry;
// 辰翰 10/4
module.exports.getAllQuestionIdFromQuestionLib = getAllQuestionIdFromQuestionLib;
// 辰翰 10/4
module.exports.getAllQuestionIdFromQuestionConcept = getAllQuestionIdFromQuestionConcept;
// 辰翰 10/4
module.exports.addDefaultConcept = addDefaultConcept;
// 辰翰 10/25
module.exports.modifyQuesVerification = modifyQuesVerification;
// 嘉盛 11/11
module.exports.UploadUserQuery = UploadUserQuery;
// 嘉盛 11/12
module.exports.GetGptResponse = GetGptResponse;