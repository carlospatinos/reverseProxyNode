var redis = require('redis');
var client = redis.createClient();

// client.on('connect', function() {
//     console.log('connected');
//     console.log(client.ping());
// });

client.on("error", function (err) {
    console.log("Error " + err);
});

client.set("string key", "string val", redis.print);

client.ping(function(error, val) {
    console.log(val);
});


var nodeCleanup = require('node-cleanup');
 
nodeCleanup(function (exitCode, signal) {
    // release resources here before node exits 
    console.log("saliendo");
    client.quit();
});
