var express = require('express');
var router = express.Router();
var axios = require('axios');

module.exports = function(app) {

  var logFramework = app.get('logFramework');
  var configuration = app.get('configuration');
  var redisClient = app.get('redisClient');

  var logger = logFramework.getLogger("default");
  var healthResponse = {};
  healthResponse['statusConnectionRedis']=false;
  
  function isNull() {
    return null;
  }
  
  function isServiceRunning(result){
    if(result != null && result.status == 200) {
      return true;
    } else {
      return false;
    }
  }
  
  function isRedisRunning(error, result){
    if(error != null){
      return false;
    }
    if(result != null && result == 'PONG') {
      return true;
    } else {
      return false;
    }
  }
  
  /* GET users listing. */
  router.get('/', function(req, res, next) {
    // TODO: validar el jwt token
    redisClient.getClient().ping(function(error, redisResponse) {
      healthResponse['statusConnectionRedis']=isRedisRunning(error, redisResponse);
    });
  
    axios.all([
      axios.head(configuration.backend.properties).catch(isNull),
      axios.head(configuration.backend.applications).catch(isNull),
      axios.head(configuration.backend.audits).catch(isNull),
      axios.head(configuration.backend.labels).catch(isNull),
      axios.head(configuration.backend.catalogs).catch(isNull),
      axios.head(configuration.backend.pushs).catch(isNull),
      axios.head(configuration.backend.clients).catch(isNull),
      axios.head(configuration.backend.accounts).catch(isNull),
      axios.head(configuration.backend.cards).catch(isNull),
      axios.head(configuration.backend.balances).catch(isNull),
    ]).then(axios.spread((healthServiceProperties, healthServiceApplications, 
      healthServiceAudits, healthServiceLabels, healthServiceCatalogs, 
      healthServicePushs, healthServiceClients, healthServiceAccounts,
      healthServiceCards, healthServiceBalances) => {
  
      var data = {
        "properties": isServiceRunning(healthServiceProperties),
        "applications": isServiceRunning(healthServiceApplications),
        "audits": isServiceRunning(healthServiceAudits),
        "labels": isServiceRunning(healthServiceLabels),
        "catalogs": isServiceRunning(healthServiceCatalogs),
        "pushs": isServiceRunning(healthServicePushs),
        "clients": isServiceRunning(healthServiceClients),
        "accounts": isServiceRunning(healthServiceAccounts),
        "cards": isServiceRunning(healthServiceCards),
        "balances": isServiceRunning(healthServiceBalances)
      };  
      healthResponse['statusConnectionBack']=(data);
  
      logger.debug(healthResponse); 
      res.json(healthResponse);   
    }));    
  });

  return router;
};