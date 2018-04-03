var jwt = require('jsonwebtoken');
var token = jwt.sign({ applicationId: '1', userId: 2 }, 'carlos');
console.log(token);