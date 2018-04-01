var jwt = require('jsonwebtoken');
var configuration = require('../configuration');
var redisClient = require('../modules/redisModule');
var logFramework = require('../logFramework');
var logger = logFramework.getLogger("default");

const securityMiddleware = function (req, res, next) {
  logger.debug('Requested path: %s', req.originalUrl);
  tokenProvided = req.get('token');
  logger.debug("tokenProvided : %s",tokenProvided);
  if(tokenProvided == null || tokenProvided == ""){
    logger.warn('Token es nullo o vacio');
    res.redirect('/');
    return;
  }
  // redisClient.getClient().set('SECURITY_' + tokenProvided, 'valid', function(err, reply) {
  //   logger.debug("persistido");
  // });
  redisClient.getClient().get('SECURITY_' + tokenProvided, function(err, reply) {
    // reply is null when the key is missing
    if(err){
      res.redirect('/');
      return;
    } else {
      var decodedToken = '';
      try{
        decodedToken = jwt.verify(tokenProvided, configuration.app.secretKey);
        logger.debug("token verificado: %s", decodedToken);
        res.header('token',decodedToken);
        next();
      } catch(err) {
          logger.warn(err);
          res.redirect('/');
          return;
      }
      
    }
  });
};

module.exports = securityMiddleware;