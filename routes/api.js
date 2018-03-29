var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200);
  res.json({message: "accessing api"});
});

module.exports = router;
