var jwt = require('jsonwebtoken');
var configuration = require('../configuration');
var redisClient = require('../modules/redisModule');

const securityMiddleware = function (req, res, next) {
  console.log('PATH: ' + req.originalUrl);
  tokenProvided = req.get('token');
  console.log("tokenProvided : " + tokenProvided);
  if(tokenProvided == null || tokenProvided == ""){
    console.log('Token es nullo o vacio');
    res.redirect('/');
  }
  // redisClient.getClient().set('SECURITY_' + tokenProvided, 'valid', function(err, reply) {
  //   console.log("persistido");
  // });
  redisClient.getClient().get('SECURITY_' + tokenProvided, function(err, reply) {
    // reply is null when the key is missing
    if(err){
      res.redirect('/');
    } else {
      var decodedToken = '';
      try{
        decodedToken = jwt.verify(tokenProvided, configuration.app.secretKey);
        console.log(decodedToken);
        res.json({token: decodedToken});
        console.log("--generating jwt token: " + decodedToken);
        next();
      } catch(err) {
          console.log('error: ' + err);
          res.redirect('/');
      }
      
    }
  });
};

module.exports = securityMiddleware;