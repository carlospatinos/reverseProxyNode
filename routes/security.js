var express = require('express');
var jwt = require('jsonwebtoken');

module.exports = function(app){
    'use strict';
    var router = express.Router();
    
    var configuration = app.get('configuration');
    var logFramework = app.get('logFramework');
    var logger = logFramework.getLogger("default");
    var redisClient = app.get('redisClient');

    function isValid(value){
        return(value != null && value != "");
    };
    
    /* GET home page. */
    router.post('/', function(req, res, next) {
        // TODO: validar la information contra redis
        var applicationKey = req.get('applicationKey');
        var applicationPassword = req.get('applicationPassword');
        logger.debug('Generando token para usuario: ' + applicationKey + req.headers);
        if(!isValid(applicationKey) || !isValid(applicationPassword)){
            logger.warn('applicationKey [' + applicationKey + '] o applicationPassword [' + applicationPassword + '] es nullo o vacio');
            res.redirect('/');
            return;
        }
        
        redisClient.getClient().get('APP_' + configuration.applicationKey, function(err, reply) {
            if(err){
                logger.warn('No se encontro el id de la aplicacion %s', configuration.applicationKey);
                res.redirect('/');
                return;
            } else {
                var duration = parseInt(configuration.app.tokenDuration);
                var payload = JSON.parse(reply);
                var tokenWithDuration = jwt.sign(payload, configuration.app.secretKey, { expiresIn: duration });

                // TODO: securityContent
                var securityContent = JSON.stringify({"token": tokenWithDuration, "applicationToken":"ABCD", "applicationKey":"key","lastUse":1404359477253, "clientHostName":"local", "nombre": "Juan", "app": "Perez" });
                redisClient.getClient().set('SECURITY_' + tokenWithDuration, securityContent, function(err, reply) {
                    if(err){
                        //TODO: RETRY?
                        logger.warn('No se persistio la informacion de SECURITY_%s', tokenWithDuration);
                    } else {
                        res.json({token: tokenWithDuration});
                    }
                });
            }

        });
        
    });

    return router;
};