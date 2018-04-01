var express = require('express');

module.exports = function(app) {
  'use strict';
  var router = express.Router();
  router.get('/', function(req, res, next) {
    res.send('gateway running!!');

  });

  return router;
};
