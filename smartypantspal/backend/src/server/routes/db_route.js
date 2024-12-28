var express = require('express');
var router = express.Router();
var db_controller = require('../controllers/db_controller');

router.get('/db_getAllQuestion',db_controller.db_getAllQuestion);


module.exports = router;