var proxyMiddleware = require('http-proxy-middleware');
var jwt = require('jsonwebtoken');
var configuration = require('../configuration');

function logProvider(provider) {
  var logger = new (require('winston').Logger)();

  var myCustomProvider = {
      log: logger.log,
      debug: logger.debug,
      info: logger.info,
      warn: logger.warn,
      error: logger.error
  }
  return myCustomProvider;
}

function onProxyReq(proxyReq, req, res) {
  // add custom header to request
  var tokenWithDuration = jwt.sign({ user: 'usuario', iat: Math.floor(Date.now() / 1000) - 30 }, 'my secret');
  proxyReq.setHeader('x-added', tokenWithDuration);
  res.setHeader('x-added', tokenWithDuration);
  console.log("generating jwt token: " + tokenWithDuration);
  // or log the req
}

var options = {
  target: String(configuration.reverseProxy.api.url), // target host
  logLevel: "debug",
  logProvider: logProvider,
  changeOrigin: true,  
  onProxyReq: onProxyReq,             // needed for virtual hosted sites
  //proxyTimeout: configuration.reverseProxy.api.proxyTimeout,
  ws: true,                         // proxy websockets
  pathRewrite: {
      '^/api' : ''           // remove base path
  },
  router: {
      // when request.headers.host == 'dev.localhost:3000',
      'dev.localhost:3000' : 'http://localhost:8000'
  }
};

var proxy = proxyMiddleware(options);

module.exports = proxy;