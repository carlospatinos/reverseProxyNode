var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var nocache = require('nocache');

var app = express();

var Container = require('plus.container');
var container = new Container();

var configuration = require('./configuration');
var securityRouter = require('./routes/security');
container.register('configuration', configuration);
//container.register('configuration', configuration, [container]);
container.register('securityRouter', securityRouter, [configuration]);

var logFramework = require('./logFramework');

var indexRouter = require('./routes/index');
var gatewayProxy =  require('./routes/gatewayProxy');
var healthCheckRouter = require('./routes/healthcheck');




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('logFramework', logFramework);
//app.set('configuration', configuration);

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
app.use('/cdn', express.static(path.join(__dirname, 'cdn')));
app.use(nocache())

app.use('/', indexRouter);
app.use('/health', healthCheckRouter);
app.use('/security', securityRouter);


app.use('/api', gatewayProxy);
app.use('/app', gatewayProxy);

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
