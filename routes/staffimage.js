var express = require('express');
var router = express.Router();

var imageController = require('./imageController');

router.post('/', imageController.dataInput);

module.exports = router;