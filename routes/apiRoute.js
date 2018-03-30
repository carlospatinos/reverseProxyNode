// var express = require('express');
// var router = express.Router();

// var logFramework = require('../logFramework');
// var logger = logFramework.getLogger("http");

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   logger.debug('/api received a call.');
//   res.status(200);
//   res.json({message: "accessing api"});
// });

const express = require('express');
const proxy = require('http-proxy-middleware');

// proxy middleware options
let proxyOptions = {
        target: 'https://en.wikipedia.org', // target host
        changeOrigin: true, // needed for virtual hosted sites
        ws: true,  // proxy websockets
        proxyTimeout: 1000, // time waiting for response
        // pathRewrite: {
        //   '^/api/old-path' : '/api/new-path',     // rewrite path
        //   '^/api' : ''           // remove base path
        // },
        pathRewrite: function (path, req) { console.log("haaaaaaaa"); return path.replace('/api', '/base/api') },
        secure:false // dont verify SSL Certs
    };
let router = express.Router();
let appProxy = proxy("/api", proxyOptions);

/*
* Handles a reverse proxy request to backend service
* Handles all http methods on all paths under /api
*/
router.all('/api', appProxy);

module.exports = router;