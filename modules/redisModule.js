var redis = require('redis');
var nodeCleanup = require('node-cleanup');
var logFramework = require('../logFramework');
var logger = logFramework.getLogger("default");
let client = null;
 
nodeCleanup(function (exitCode, signal) {
    // release resources here before node exits 
    console.log("Terminando conexion con redis");
    if(client != null) {
        client.quit();
    }
});

const options = {
    url: 'redis://localhost:6379',
    retry_strategy: (options) => {
        client = null;
        return new Error("Redis client connection dropped.");
    }
};

module.exports = {
    getClient: () => {
        if (client == null) {
            client = redis.createClient(options);

            client.on('connect', function() {
                logger.info('Conexion a redis establecida');
            });
            
            client.on("error", function (err) {
                logger.error("Error " + err);
            });
        }
        return client;
    }
};

//module.exports = client;
