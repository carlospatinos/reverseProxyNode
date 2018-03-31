var express = require('express');
var router = express.Router();
var axios = require('axios');
var logFramework = require('../logFramework');
var configuration = require('../configuration');
var redisClient = require('../modules/redisModule');

var logger = logFramework.getLogger("default");
var healthResponse = {};
healthResponse['statusConnectionRedis']=false;

function useNull() {
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
  redisClient.getClient().ping(function(error, redisResponse) {
    healthResponse['statusConnectionRedis']=isRedisRunning(error, redisResponse);
  });

  axios.all([
    axios.head(configuration.backend.properties).catch(useNull),
    axios.head(configuration.backend.applications).catch(useNull),
    axios.head(configuration.backend.audits).catch(useNull),
    axios.head(configuration.backend.labels).catch(useNull),
    axios.head(configuration.backend.catalogs).catch(useNull),
    axios.head(configuration.backend.pushs).catch(useNull),
    axios.head(configuration.backend.clients).catch(useNull),
    axios.head(configuration.backend.accounts).catch(useNull),
    axios.head(configuration.backend.cards).catch(useNull),
    axios.head(configuration.backend.balances).catch(useNull),
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

module.exports = router;
