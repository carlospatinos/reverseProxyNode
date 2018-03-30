const proxy = require('http-proxy-middleware');
var configuration = require('../configuration');

var rewriteFn = function (path, req) {
  console.log('rewrrrrrrrrrrrrrrrr');
  return path.replace('/api', '');
}

//proxy middleware options
let proxyOptions = {
        target: configuration.reverseProxy.api.url, // target host
        changeOrigin: true, // needed for virtual hosted sites
        ws: true,  // proxy websockets
        pathRewrite: rewriteFn,
        // pathRewrite: {
        //   '^/api/old-path' : '/api/new-path',     // rewrite path
        //   '^/api' : '/'           // remove base path
        // },
        proxyTimeout: configuration.reverseProxy.api.proxyTimeout, // time waiting for response
        secure:false // dont verify SSL Certs
    };
let appProxy = proxy(proxyOptions);
// http://localhost:8080/api
/*
* Handles a reverse proxy request to backend service
* Handles all http methods on all paths under /api
*/
// router.all('*', appProxy);
//router.get('/api', appProxy);

module.exports = appProxy;