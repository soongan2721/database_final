var db_model = require('../modules/db_model');

// 獲取所有題目
const db_getAllQuestion = (req, res) => {

    let resultQues = {};
    let remainingQueries = 2;

    const check_queryFinished = () => {
        remainingQueries--;
        if(remainingQueries == 0) {          
          res.send(resultQues)
        }
    }
    db_model.getAllChoiceQues()
        .then(
          (result) => {
            resultQues.choiceQues = result;
            check_queryFinished();
          }
        )
        .catch(
          (err) => {
            res.send(err);
          }
        )
    db_model.getAllShortAnsQues()
        .then(
          (result) => {
            resultQues.shortAnsQues = result;
            check_queryFinished();
          }
        )
        .catch(
          (err) => {
            res.send(err);
          }
        )
    
}

// 新增題目
const db_addQuestion = (req, res) => {

  const inputValues = req.body.params;
  const question_type = req.body.params.question_type;
  
  if(question_type == '選擇題') {
    (
      async() => {

        const lastInsertID = await db_model.addQues(inputValues)
        await db_model.addChoiceQuesDetail(inputValues, lastInsertID)
        await db_model.addCourseYearQues(inputValues, lastInsertID)

        res.send()

      }
    )();
  }
  else if(question_type == '簡答題') {
    (
      async() => {

        const lastInsertID = await db_model.addQues(inputValues)
        res.send()

      }
    )();
  }

}

const db_modifyQuestion = (req, res) => {

  const inputValues = req.body.params;
  const question_type = req.body.params.question_type;
  
  if(question_type == '選擇題') {
    (
      async() => {

        await db_model.modifyQues(inputValues)
        await db_model.modifyChoiceQuesDetail(inputValues)
        await db_model.removeCourseYearQuesByQuesID(inputValues.question_id)
        await db_model.addCourseYearQues(inputValues, inputValues.question_id)
        res.send()

      }
    )();
  }
  else if(question_type == '簡答題') {
    (
      async() => {

        await db_model.modifyQues(inputValues)
        res.send()

      }
    )();
  }

}

const db_getAllCourse = (req, res) => {

  db_model.getAllCourse()
    .then(
      (result) => {
        res.send(result)
      }
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}

const db_getAllTeacher = (req, res) => {

  db_model.getAllTeacher()
    .then(
      (result) => {
        res.send(result)
      }
    )
    .catch(
      (err) => {
        res.send(err);
      }
    )
  
}






module.exports.db_getAllQuestion = db_getAllQuestion; // 獲取所有題目
module.exports.db_addQuestion = db_addQuestion; // 新增題目
module.exports.db_modifyQuestion = db_modifyQuestion; // 修改題目
module.exports.db_getAllCourse = db_getAllCourse; // 獲取所有課程
module.exports.db_getAllTeacher = db_getAllTeacher; // 獲取所有老師