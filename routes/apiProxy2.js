var proxy = require('http-proxy-middleware');

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
  proxyReq.setHeader('x-added', 'foobar');
  console.log("proxy request.......");
  // or log the req
}

var options = {
  target: 'https://en.wikipedia.org', // target host
  logProvider: logProvider,
  changeOrigin: true,  
  onProxyReq: onProxyReq,             // needed for virtual hosted sites
  ws: true,                         // proxy websockets
  pathRewrite: {
      '^/api/old-path' : '/api/new-path',     // rewrite path
      '^/api' : ''           // remove base path
  },
  router: {
      // when request.headers.host == 'dev.localhost:3000',
      // override target 'http://www.example.org' to 'http://localhost:8000'
      'dev.localhost:3000' : 'http://localhost:8000'
  }
};


var proxy2 = proxy(options);

module.exports = proxy2;