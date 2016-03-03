var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer');

var basicAuth = require('basic-auth-connect');

var routes = require('./routes');

var app = express();
app.disable('x-powered-by');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//basic Auth
if (app.get('env') === 'development') {
  var username = process.env.BASIC_AUTH_ID;
  var password = process.env.BASIC_AUTH_PASSWORD;

  if (typeof username !== 'undefined' && typeof password !== 'undefined') {
    app.all('/speech2text', basicAuth(function (user, password) {
      return user === username && password === password;
    }));

    app.all('/api/*', basicAuth(function (user, password) {
      return user === username && password === password;
    }));
  }
  //app.use(basicAuth(username, password));
}

// setup routing
routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

  
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
