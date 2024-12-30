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
  const { Teacher } = req.query; // 使用查詢參數
  console.log(`Received TeacherName: ${Teacher}`);

  if (!Teacher) {
      return res.status(400).send({ error: 'Missing Teacher parameter' });
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

  db_model.getChoiceQuesByTeacherName(Teacher)
      .then((result) => {
          resultQues.choiceQues = result;
          check_queryFinished();
      })
      .catch((err) => {
          console.error(`Error fetching choice questions: ${err.message}`);
          res.status(500).send({ error: 'Failed to fetch choice questions' });
      });

  db_model.getShortAnsQuesByTeacherName(Teacher)
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

  console.log('req: ', req.query);
  


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
      await db_model.addCourseYearQues(inputValues, lastInsertID)
      res.send()

    }
  )();
}

}

const db_modifyQuestion = (req, res) => {

const inputValues = req.body.params;
const question_type = req.body.params.question_type;

console.log(inputValues);


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
      await db_model.removeCourseYearQuesByQuesID(inputValues.question_id)
      await db_model.addCourseYearQues(inputValues, inputValues.question_id)
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

const removeTeacher = (req, res) => {

  const teacher_id = req.body.params.teacher_id;

  db_model.removeTeacher(teacher_id)
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

const addTeacher = (req, res) => {

  const teacher_name = req.body.params.teacher_name;

  db_model.addTeacher(teacher_name)
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

const removeCourse = (req, res) => {

  const course_id = req.body.params.course_id;

  db_model.removeCourse(course_id)
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

const addCourse = (req, res) => {

  const course_name = req.body.params.course_name;
  const teacher_id = req.body.params.teacher_id;

  db_model.addCourse(course_name, teacher_id)
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

const db_getQuestionsByTeacherAndCourse = (req, res) => {
  const { Teacher, courseName } = req.query; // 使用查詢參數
  console.log(`Received Teacher: ${Teacher}, courseName: ${courseName}`);

  if (!Teacher || !courseName) {
      return res.status(400).send({ error: 'Missing Teacher or courseName parameter' });
  }

  let resultQues = {};
  let remainingQueries = 2;

  const check_queryFinished = () => {
      remainingQueries--;
      if (remainingQueries === 0) {
          res.send(resultQues);
          console.log(resultQues);
      }
  };

  // 查詢選擇題
  db_model.getQuestionsByTeacherAndCourse(Teacher, courseName)
      .then((result) => {
          resultQues.choiceQues = result.filter(q => q.option1 && q.option2 && q.option3 && q.option4); // 選擇題
          check_queryFinished();
      })
      .catch((err) => {
          console.error(`Error fetching choice questions: ${err.message}`);
          res.status(500).send({ error: 'Failed to fetch choice questions' });
      });

  // 查詢簡答題
  db_model.getQuestionsByTeacherAndCourse(Teacher, courseName)
      .then((result) => {
          resultQues.shortAnsQues = result.filter(q => !q.option1 && !q.option2 && !q.option3 && !q.option4); // 簡答題
          check_queryFinished();
      })
      .catch((err) => {
          console.error(`Error fetching short answer questions: ${err.message}`);
          res.status(500).send({ error: 'Failed to fetch short answer questions' });
      });
};




module.exports.db_getAllQuestionByCourseName = db_getAllQuestionByCourseName;
module.exports.db_getAllQuestionByTeacherName = db_getAllQuestionByTeacherName;
module.exports.db_getAllQuestionByYear = db_getAllQuestionByYear;
module.exports.db_getAllQuestionByTeacherAndYear = db_getAllQuestionByTeacherAndYear;
module.exports.db_getAllQuestionByCourseAndYear = db_getAllQuestionByCourseAndYear;

module.exports.db_getAllQuestion = db_getAllQuestion; // 獲取所有題目
module.exports.db_addQuestion = db_addQuestion; // 新增題目
module.exports.db_modifyQuestion = db_modifyQuestion; // 修改題目
module.exports.db_getAllCourse = db_getAllCourse; // 獲取所有課程
module.exports.db_getAllTeacher = db_getAllTeacher; // 獲取所有老師

module.exports.removeTeacher = removeTeacher;
module.exports.addTeacher = addTeacher;
module.exports.removeCourse = removeCourse;
module.exports.addCourse = addCourse;
module.exports.db_getQuestionsByTeacherAndCourse = db_getQuestionsByTeacherAndCourse;






