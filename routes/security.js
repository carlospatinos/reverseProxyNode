var express = require('express');
var jwt = require('jsonwebtoken');

var configuration = require('../configuration');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
    // TODO validar la information contra redis
    user = req.get('user');
    pass = req.get('pass');
    console.log('generando password para: ' + user);
    var tokenWithDuration = jwt.sign({ user: user }, configuration.app.secretKey, { expiresIn: parseInt(configuration.app.tokenDuration) });
    res.json({token: tokenWithDuration});
});

// TODO: delete
router.put('/', function(req, res, next){
    var decoded = '';
    try{
        decoded = jwt.verify(req.get('token'), configuration.app.secretKey);
        console.log(decoded);
        res.json({token: decoded});
    } catch(err) {
        console.log('error: ' + err);
        res.json({error: err});
    }
});

// TODO: delete
router.get('/', function(req, res, next) {
    res.json({token: 'tokenWithDuration'});
});

module.exports = router;
// module.exports = function(container) {
//     console.log("-----------");
//     return router;
// }
