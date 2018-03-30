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
  console.log('PATH: ' + req.originalUrl)
  

  var tokenWithDuration = jwt.sign({ user: 'usuario', iat: Math.floor(Date.now() / 1000) - 30 }, 'my secret');
  proxyReq.setHeader('x-added', tokenWithDuration);
  res.setHeader('x-added', tokenWithDuration);
  console.log("generating jwt token: " + tokenWithDuration);
}

var options = {
  target: String(configuration.reverseProxy.default.url), // target host
  logLevel: "debug",
  logProvider: logProvider,
  changeOrigin: true,  
  onProxyReq: onProxyReq,             // needed for virtual hosted sites
  proxyTimeout: configuration.reverseProxy.default.proxyTimeout,
  ws: true,                         // proxy websockets
  pathRewrite: {
      '^/api' : '',           // remove base path
      '^/app' : ''           // remove base path
  },
  router: {
      '/api' : String(configuration.reverseProxy.api.url),
      '/app' : String(configuration.reverseProxy.app.url)
  }
};

var proxy = proxyMiddleware(options);

module.exports = proxy;