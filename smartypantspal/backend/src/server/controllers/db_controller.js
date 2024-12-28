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
          console.log(resultQues)
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


const db_getAllQuestionByTeacherName = (req, res) => {
  const { TeacherName } = req.query; // 使用查詢參數
  console.log(`Received TeacherName: ${TeacherName}`);

  if (!TeacherName) {
      return res.status(400).send({ error: 'Missing TeacherName parameter' });
  }

  let resultQues = {};
  let remainingQueries = 2;

  const check_queryFinished = () => {
      remainingQueries--;
      if (remainingQueries === 0) {
          res.send(resultQues);
          console.log(resultQues)
      }
  };

  db_model.getChoiceQuesByTeacherName(TeacherName)
      .then((result) => {
          resultQues.choiceQues = result;
          check_queryFinished();
      })
      .catch((err) => {
          console.error(`Error fetching choice questions: ${err.message}`);
          res.status(500).send({ error: 'Failed to fetch choice questions' });
      });

  db_model.getShortAnsQuesByTeacherName(TeacherName)
      .then((result) => {
          resultQues.shortAnsQues = result;
          check_queryFinished();
      })
      .catch((err) => {
          console.error(`Error fetching short answer questions: ${err.message}`);
          res.status(500).send({ error: 'Failed to fetch short answer questions' });
      });
};

const db_getAllQuestionByYear = (req, res) => {
  const { Year } = req.query; // 使用查詢參數
  console.log(`Received Year: ${Year}`);

  if (!Year) {
      return res.status(400).send({ error: 'Missing Year parameter' });
  }

  let resultQues = {};
  let remainingQueries = 2;

  const check_queryFinished = () => {
      remainingQueries--;
      if (remainingQueries === 0) {
          res.send(resultQues);
          console.log(resultQues)
      }
  };

  db_model.getChoiceQuesByYear(Year)
      .then((result) => {
          resultQues.choiceQues = result;
          check_queryFinished();
      })
      .catch((err) => {
          console.error(`Error fetching choice questions: ${err.message}`);
          res.status(500).send({ error: 'Failed to fetch choice questions' });
      });

  db_model.getShortAnsQuesByYear(Year)
      .then((result) => {
          resultQues.shortAnsQues = result;
          check_queryFinished();
      })
      .catch((err) => {
          console.error(`Error fetching short answer questions: ${err.message}`);
          res.status(500).send({ error: 'Failed to fetch short answer questions' });
      });
};


const db_getAllQuestionByTeacherAndYear = (req, res) => {
  const { Teacher, Year } = req.query; // 使用查詢參數
  console.log(`Received TeacherAndYear: ${Teacher}, ${Year}`);

  let resultQues = {};
  let remainingQueries = 2;

  const checkQueryFinished = () => {
    remainingQueries--;
    if (remainingQueries === 0) {
      res.send(resultQues); // 所有查詢完成後返回結果
    }
  };

  // 查詢選擇題
  db_model.getChoiceQuesByTeacherAndYear(Teacher, Year)
    .then((result) => {
      resultQues.choiceQues = result; // 保存選擇題結果
      checkQueryFinished();
    })
    .catch((err) => {
      console.error('Error fetching choice questions:', err);
      res.status(500).send({ error: 'Failed to fetch choice questions' });
    });

  // 查詢簡答題
  db_model.getShortAnsQuesByTeacherAndYear(Teacher, Year)
    .then((result) => {
      resultQues.shortAnsQues = result; // 保存簡答題結果
      checkQueryFinished();
    })
    .catch((err) => {
      console.error('Error fetching short answer questions:', err);
      res.status(500).send({ error: 'Failed to fetch short answer questions' });
    });
};

const db_getAllQuestionByCourseAndYear = (req, res) => {
  const { courseName, Year } = req.query; // 使用查詢參數
  console.log(`Received CourseAndYear: ${courseName}, ${Year}`);

  let resultQues = {};
  let remainingQueries = 2;

  const checkQueryFinished = () => {
    remainingQueries--;
    if (remainingQueries === 0) {
      res.send(resultQues); // 所有查詢完成後返回結果
    }
  };

  // 查詢選擇題
  db_model.getChoiceQuesByCourseAndYear(courseName, Year)
    .then((result) => {
      resultQues.choiceQues = result; // 保存選擇題結果
      checkQueryFinished();
    })
    .catch((err) => {
      console.error('Error fetching choice questions:', err);
      res.status(500).send({ error: 'Failed to fetch choice questions' });
    });

  // 查詢簡答題
  db_model.getShortAnsQuesByCourseAndYear(courseName, Year)
    .then((result) => {
      resultQues.shortAnsQues = result; // 保存簡答題結果
      checkQueryFinished();
    })
    .catch((err) => {
      console.error('Error fetching short answer questions:', err);
      res.status(500).send({ error: 'Failed to fetch short answer questions' });
    });
};





module.exports.db_getAllQuestionByCourseName = db_getAllQuestionByCourseName;
module.exports.db_getAllQuestionByTeacherName = db_getAllQuestionByTeacherName;
module.exports.db_getAllQuestionByYear = db_getAllQuestionByYear;
module.exports.db_getAllQuestionByTeacherAndYear = db_getAllQuestionByTeacherAndYear;
module.exports.db_getAllQuestionByCourseAndYear = db_getAllQuestionByCourseAndYear;