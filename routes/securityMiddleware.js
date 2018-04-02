var jwt = require('jsonwebtoken');

module.exports = function (app){
  var configuration = app.get('configuration');
  var redisClient = app.get('redisClient');
  var logFramework = app.get('logFramework');
  var logger = logFramework.getLogger("default");

  const securityMiddleware = function (req, res, next) {
    tokenProvided = req.get('token');
    logger.debug('Path requerido: [%s] con token: [%s]', req.originalUrl, tokenProvided );
    if(tokenProvided == null || tokenProvided == ""){
      logger.warn('Token es nullo o vacio');
      //res.redirect('/');
      //return;
    }
    // redisClient.getClient().set('SECURITY_' + tokenProvided, 'valid', function(err, reply) {
    //   logger.debug("persistido");
    // });
    
    redisClient.getClient().get('SECURITY_' + tokenProvided, function(err, reply) {
      // reply is null when the key is missing
      if(err){
        logger.warn('No se encontro el id de la aplicacion %s', tokenProvided);
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
  return securityMiddleware;
};