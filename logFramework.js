let logFramework = require('log4js');
let configuration = require('./configuration');

logFramework.configure(configuration.log.configFile);
let log = logFramework.getLogger('default');

log.info("logging configured properly.");

module.exports = logFramework; 