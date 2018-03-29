let log4js = require('log4js');
let configuration = require('./configuration');

log4js.configure(configuration.log.configFile);
let log = log4js.getLogger('default');

log.info("logging configured properly.");

module.exports = log4js; 