var express = require('express');
var jwt = require('jsonwebtoken');

module.exports = function(app){
    'use strict';
    var router = express.Router();
    
    var configuration = app.get('configuration');
    var logFramework = app.get('logFramework');
    var logger = logFramework.getLogger("default");
    
    /* GET home page. */
    router.post('/', function(req, res, next) {
        // TODO: validar la information contra redis
        user = req.get('user');
        pass = req.get('pass');
        logger.debug('Generando token para usuario: ' + user);
        var tokenWithDuration = jwt.sign({ user: user }, configuration.app.secretKey, { expiresIn: parseInt(configuration.app.tokenDuration) });
        res.json({token: tokenWithDuration});
    });
    
    // TODO: delete
    router.put('/', function(req, res, next){
        var decoded = '';
        try{
            decoded = jwt.verify(req.get('token'), configuration.app.secretKey);
            logger.debug("decodificando el token: %s", decoded);
            res.json({token: decoded});
        } catch(err) {
            logger.warn('error: %s', err);
            res.json({error: err});
        }
    });
    
    // TODO: delete
    router.get('/', function(req, res, next) {
        res.json({token: 'tokenWithDuration'});
    });

    return router;
};