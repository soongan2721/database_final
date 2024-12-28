var express = require('express');
var router = express.Router();
var db_controller = require('../controllers/db_controller');

router.get('/db_getAllQuestion',db_controller.db_getAllQuestion);
router.post('/db_addQuestion',db_controller.db_addQuestion);
router.post('/db_modifyQuestion',db_controller.db_modifyQuestion);




module.exports = router;