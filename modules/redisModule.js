
//var redis = require('redis');
var nodeCleanup = require('node-cleanup');

// module.exports = {
//     getClient: () => {
//         if (client == null) {
//             client = redis.createClient(options);

//             client.on('connect', function() {
//                 logger.info('Conexion a redis establecida');
//             });
            
//             client.on("error", function (err) {
//                 logger.error("Error " + err);
//             });
//         }
//         return client;
//     }
// };

module.exports = function (app){
    var logFramework = app.get('logFramework');
    var configuration = app.get('configuration');
    var logger = logFramework.getLogger("default");
    var redis = app.get('redis');
    
    let client = null;

    nodeCleanup(function (exitCode, signal) {
        // release resources here before node exits 
        logger.info("Terminando conexion con redis");
        if(client != null) {
            client.quit();
        }
    });

    const options = {
        url: configuration.redis.url,
        retry_strategy: (options) => {
            client = null;
            return new Error("No se pudo establecer conexion con redis.");
        }
    };

    return {
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
    }
};