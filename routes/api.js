var express = require('express');
var router = express.Router();

const log4js = require('log4js');
const proxy = require('http-proxy-middleware');
var configuration = require('../configuration');

var logFramework = require('../logFramework');
var logger = logFramework.getLogger("http");

/* GET users listing. */
router.get('/', function(req, res, next) {
  logger.debug('/api received a call.');
  res.status(200);
  res.json({message: "accessing api"});
});


var rewriteFn = function (path, req) {
  console.log('rewrrrrrrrrrrrrrrrr');
  return path.replace('/api/wp', '');
}

// proxy middleware options
// let proxyOptions = {
//         target: configuration.reverseProxy.api.url, // target host
//         changeOrigin: true, // needed for virtual hosted sites
//         ws: true,  // proxy websockets
//         pathRewrite: rewriteFn,
//         proxyTimeout: configuration.reverseProxy.api.proxyTimeout, // time waiting for response
//         secure:false // dont verify SSL Certs
//     };
// let appProxy = proxy('/api/wp', proxyOptions);

/*
* Handles a reverse proxy request to backend service
* Handles all http methods on all paths under /api
*/
// router.all('*', appProxy);
//router.get('/api', appProxy);

module.exports = router;