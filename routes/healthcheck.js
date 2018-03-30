var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
    "statusConnectionRedis": true,
    "statusConnectionBack": false
  });
});

module.exports = router;
