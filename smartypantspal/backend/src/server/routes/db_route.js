var express = require('express');
var router = express.Router();
var db_controller = require('../controllers/db_controller');

router.get('/db_getAllQuestionByCourseName',db_controller.db_getAllQuestionByCourseName);


module.exports = router;