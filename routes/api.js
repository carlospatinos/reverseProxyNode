var express = require('express');
var router = express.Router();
var logger = require('../logger');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //logger.debug('/api received a call.');
  res.status(200);
  res.json({message: "accessing api"});
});

module.exports = router;
