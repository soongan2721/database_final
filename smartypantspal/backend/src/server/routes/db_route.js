var express = require('express');
var router = express.Router();
var db_controller = require('../controllers/db_controller');

router.get('/db_getAllQuestionByCourseName',db_controller.db_getAllQuestionByCourseName);
router.get('/db_getAllQuestionByTeacherName',db_controller.db_getAllQuestionByTeacherName);
router.get('/db_getAllQuestionByYear',db_controller.db_getAllQuestionByYear);
router.get('/db_getAllQuestionByTeacherAndYear',db_controller.db_getAllQuestionByTeacherAndYear);
router.get('/db_getAllQuestionByCourseAndYear',db_controller.db_getAllQuestionByCourseAndYear);
module.exports = router;