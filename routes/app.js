var express = require('express');
var router = express.Router();
var logFramework = require('../logFramework');
var logger = logFramework.getLogger("http");

/* GET users listing. */
router.get('/', function(req, res, next) {
  logger.debug('/api received a call.');
  res.json({message: "accessing app"});
});

module.exports = router;
