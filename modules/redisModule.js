var redis = require('redis');
var nodeCleanup = require('node-cleanup');
var logFramework = require('../logFramework');
var logger = logFramework.getLogger("default");
var client = redis.createClient();

client.on('connect', function() {
    logger.info('Conexion a redis establecida');
});

client.on("error", function (err) {
    logger.error("Error " + err);
});
 
nodeCleanup(function (exitCode, signal) {
    // release resources here before node exits 
    console.log("Terminando conexion con redis");
    client.quit();
});

module.exports = client;
