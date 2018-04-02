var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var nocache = require('nocache');
var redis = require('redis');
var app = express();

var configuration = require('./configuration');
app.set('configuration', configuration);
var logFramework = require('./logFramework');
app.set('logFramework', logFramework);
app.set('redis', redis);
var redisClient = require('./modules/redisModule')(app);
console.log(redisClient);
app.set('redisClient', redisClient);
var moduleIndex = require('./routes/index')(app);

var moduleSecurity = require('./routes/security')(app);

//var indexRouter = moduleIndex.router;
var gatewayProxy =  require('./routes/gatewayProxy')(app);
var healthCheckRouter = require('./routes/healthcheck')(app);
var securityMiddleware = require('./routes/securityMiddleware')(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(morgan('dev'));
app.use(morgan('dev', {
  skip: function (req, res) {
      return res.statusCode < 400
  }, stream: process.stderr
}));

app.use(morgan('dev', {
  skip: function (req, res) {
      return res.statusCode >= 400
  }, stream: process.stdout
}));


app.use(logFramework.connectLogger(logFramework.getLogger('http'), { level: 'auto' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(nocache())

app.use('/', moduleIndex);
app.use('/security', moduleSecurity);
app.use('/cdn', express.static(path.join(__dirname, 'cdn')));

app.use('/health', healthCheckRouter);

app.use('/api', securityMiddleware, gatewayProxy);
app.use('/app', securityMiddleware, gatewayProxy);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app; 
