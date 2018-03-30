var express = require('express');
var router = express.Router();
var axios = require('axios');
var logFramework = require('../logFramework');
var configuration = require('../configuration');

var logger = logFramework.getLogger("http");
var healthResponse = {};
// TODO ping redis
healthResponse['statusConnectionRedis']=true;
//healthResponse['statusConnectionBack']=true;

function useNull() {
  return null;
}

function buildStatus(result){
  if(result != null && result.status == 200) {
    return true;
  } else {
    return false;
  }
}

/* GET users listing. */
router.get('/', function(req, res, next) {

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
      "properties": buildStatus(healthServiceProperties),
      "applications": buildStatus(healthServiceApplications),
      "audits": buildStatus(healthServiceAudits),
      "labels": buildStatus(healthServiceLabels),
      "catalogs": buildStatus(healthServiceCatalogs),
      "pushs": buildStatus(healthServicePushs),
      "clients": buildStatus(healthServiceClients),
      "accounts": buildStatus(healthServiceAccounts),
      "cards": buildStatus(healthServiceCards),
      "balances": buildStatus(healthServiceBalances)
    };
    healthResponse['statusConnectionBack']=(data);

    console.log(healthResponse); 
    res.json(healthResponse);   
  }));

  // axios.all([
  //   axios.get('https://jsonplaceholder.typicode.com/users'),
  //   axios.get('https://jsonplaceholder.typicode.com/users')
  // ]).then(axios.spread((response1, response2) => {
  //   console.log(response1.status);
  //   console.log(response2.status);

  //   res.json(healthResponse);
  // })).catch(error => {
  //   console.log(error);
  // });

    
});

module.exports = router;
