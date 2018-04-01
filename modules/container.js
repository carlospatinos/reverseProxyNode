var Container = require('plus.container');
var container = new Container();

var configuration = require('./configuration');
var securityRouter = require('./routes/security');
container.register('configuration', configuration);
//container.register('configuration', configuration, [container]);
container.register('securityRouter', securityRouter, [configuration]);