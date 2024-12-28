const db_model = require('../modules/db_model');

const db_getAllQuestionByCourseName = (req, res) => {
  const { courseName } = req.query; // 使用查詢參數
  console.log(`Received courseName: ${courseName}`);

  if (!courseName) {
      return res.status(400).send({ error: 'Missing courseName parameter' });
  }

  let resultQues = {};
  let remainingQueries = 2;

  const check_queryFinished = () => {
      remainingQueries--;
      if (remainingQueries === 0) {
          res.send(resultQues);
      }
  };

  db_model.getChoiceQuesByCourseName(courseName)
      .then((result) => {
          resultQues.choiceQues = result;
          check_queryFinished();
      })
      .catch((err) => {
          console.error(`Error fetching choice questions: ${err.message}`);
          res.status(500).send({ error: 'Failed to fetch choice questions' });
      });

  db_model.getShortAnsQuesByCourseName(courseName)
      .then((result) => {
          resultQues.shortAnsQues = result;
          check_queryFinished();
      })
      .catch((err) => {
          console.error(`Error fetching short answer questions: ${err.message}`);
          res.status(500).send({ error: 'Failed to fetch short answer questions' });
      });
};


module.exports.db_getAllQuestionByCourseName = db_getAllQuestionByCourseName;
