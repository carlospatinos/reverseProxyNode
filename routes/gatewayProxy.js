var proxyMiddleware = require('http-proxy-middleware');
var jwt = require('jsonwebtoken');

module.exports = function(app){
    var configuration = require('../configuration');
    var redisClient = require('../modules/redisModule');

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
      
      var options = {
        target: String(configuration.reverseProxy.default.url), // target host
        logLevel: "debug",
        logProvider: logProvider,
        changeOrigin: true,  
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
      return proxy;
};