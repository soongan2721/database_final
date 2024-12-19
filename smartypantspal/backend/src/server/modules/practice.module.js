var mariadb = require('mariadb/callback');
var con = require('../../config/DBconfig');
// const { exec } = require('child_process');
const { spawn } = require('child_process');
const { readlink } = require('fs');
const { resolve } = require('path');
const pool = mariadb.createPool({
  port: con.port, // 連接阜號
  host: con.host, // 主機名稱 
  user: con.user, // 用戶名稱
  password: con.password, // 資料庫密碼
  database: con.database, // 資料庫名稱
  connectionLimit: con.connectionLimit //連線池限制
});



//取得測驗的開始和結束的時間
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
              resolve(result);
            }
            else{
              reject('exam_lib empty');
              console.log('exam_lib error');
            }
            conn.release();
          }
        });
      }
    });
  });
}



//抓取符合條件的題目id
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
               WHERE week in (?) AND class_id = ? AND exam_type = ?';
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



//取得題目的所有資訊
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



//
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
        console.log(student_anwser);
        let answer_time = insertValues.answer_time;
        //let answer_date = insertValues.answer_date;
        let practice_id = insertValues.practice_id;
        sql = "insert into practice_answer(question_id, student_answer, answer_time, practice_id) values(?, ?, ?, ?)";
        conn.query(sql, [question_id, student_anwser, answer_time, practice_id], (error, result) => {
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



//取得題目的答案
const GetAnswer = (SearchValues) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, conn) => { 
      if (connectionError) {
        reject(connectionError);
      } 
      else {
        let question_id = SearchValues.question_id;
        let sql = 'SELECT question_id, question_type, answer FROM question_lib WHERE question_id in (?)';
        conn.query(sql, [question_id], (error, result) => {
          if(error){
            reject(error);
          }
          else{
            let answerInfo;
            if(result && result.length > 0){
              console.log('enter');
              answerInfo = Promise.all(result.map((question) => {
                //console.log(id);
                return new Promise((resolve, reject) => {
                  console.log(question);
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
                      conn.release();
                    });
                  }
                  else{
                    question.explain = null;
                    resolve(question);
                  }
                });
              }));
            }
            else{
              console.log('************************');
            }
            resolve(answerInfo);
            conn.release();
          }
        });
      }
    });
  });
};



//取得所有可以練習或測驗的周次
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
        let sql = 'SELECT week from exam_lib WHERE class_id = ? AND exam_type = ?';
        if(class_id && exam_type){
          conn.query(sql, [class_id, exam_type], (error, result) => {
            if(error){
              reject(error);
            }
            else{
              console.log(result);
              if(result && result.length > 0){
                for(let i = 0; i < 18; i++){
                  let week = new Object();
                  week.label = "week" + (i + 1);
                  week.value = (i + 1);
                  week.disabled = !result.some(item => item.week === (i + 1));
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
    });
  });
}



//取得所有課程列表
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



//更新練習紀錄
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



//上傳練習紀錄
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
        });
      }
    });
  });
}



//取得學生的所有練習紀錄
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



//取得該次練習的所有題目id
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



//上傳當次練習的所有題目id
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



//取得題目的所有資訊，包括答案和選項
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
                sql = 'SELECT gpt_answer, gpt_explain FROM practice_text_answer where question_id = ? AND practice_id = ?';
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
                questionInfo.answer = gpt_response[0].gpt_answer;
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





module.exports.GetTestTime = GetTestTime;
module.exports.GetQuestion = GetQuestion;
module.exports.GetQuestionDetail = GetQuestionDetail;
module.exports.upload_practice_table = upload_practice_table;
module.exports.GetAnswer = GetAnswer;
module.exports.GetWeek = GetWeek;
module.exports.GetClass = GetClass;
module.exports.UpdatePracticeRecord = UpdatePracticeRecord;
module.exports.GetPracticeRecord = GetPracticeRecord;
module.exports.UploadPracticeRecord = UploadPracticeRecord;
module.exports.GetTestGetPracticeQuestionIdTime = GetPracticeQuestionId;
module.exports.UplocadPracticeQuestion = UplocadPracticeQuestion;
module.exports.GetQuestionInformation = GetQuestionInformation;

