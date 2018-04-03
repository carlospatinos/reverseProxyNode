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
      res.status(401);
      res.send('Token invalido');
      return;
    }
    // TODO: Verificar si esto es necesario.
    // applicationKey = req.get('applicationKey');
    // if(applicationKey == null || applicationKey == ""){
    //   logger.warn('applicationKey es nullo o vacio');
    //   res.status(401);
    //   res.send('applicationKey invalido');
    //   return;
    // }

    redisClient.getClient().get('SECURITY_' + tokenProvided, function(err, reply) {
      if(err){
        logger.warn('No se encontro el id de la aplicacion %s', tokenProvided);
        //res.redirect('/');
        res.status(401);
        res.send('Token invalido');
        return;
      } else {
        var decodedToken = '';
        try{
          var duration = parseInt(configuration.app.tokenDuration);
          decodedToken = jwt.verify(tokenProvided, configuration.app.secretKey);
          // TODO: remover esta linea de log
          logger.debug("token verificado: %s", JSON.stringify(decodedToken));
          // TODO: quien nos provee el applicationId? Applicacion? para persistirlo
          var securityContent = JSON.stringify({"token": decodedToken, "applicationKey": decodedToken.applicationKey, "lastUse": Date.now()});
          redisClient.getClient().set('SECURITY_' + decodedToken, securityContent, 'EX', duration, function(err, reply) {
            if(err){
                //TODO: RETRY?
                logger.warn('No se actualizo la duracion del token %s', decodedToken);
            } 
            res.header('token',decodedToken);
            next();
          });
          
        } catch(err) {
            logger.warn(err);
            res.status(401);
            res.send('Token invalido');
            return;
        }
        
      }
    });
  };
  return securityMiddleware;
};