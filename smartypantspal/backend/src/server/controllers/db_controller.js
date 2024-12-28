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
        const result = await db_model.addChoiceQuesDetail(inputValues, lastInsertID)
        res.send(result)

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










module.exports.db_getAllQuestion = db_getAllQuestion; // 獲取所有題目
module.exports.db_addQuestion = db_addQuestion; // 新增題目
module.exports.db_modifyQuestion = db_modifyQuestion; // 修改題目