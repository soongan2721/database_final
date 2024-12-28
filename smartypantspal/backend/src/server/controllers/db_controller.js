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












module.exports.db_getAllQuestion = db_getAllQuestion; // 獲取所有題目