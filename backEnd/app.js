var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');
var mongooseConnector = require('./mongoose/mongoose-connection');
var app = express();

let config = require('config');

/**
 *  import authentication modules
 */

let passport = require('passport');
let Auth0Strategy = require('passport-auth0');

/* Specify router */
let categoryRouter = require('./routes/category-router');
let userRouter = require('./routes/user-router');
let articleRouter = require('./routes/article-router');
let notificationRouter = require('./routes/notification-router');

let schedulerService = require('./mongoose/services/scheduler-service');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



/**
 * Connect to Mongo Database
 * Choose local or mlab host is your choice, lol !
 */


let host = config.get('database.mlab-host');

/** Localhost goes here.... */
let localhost = config.get('database.localhost');

/** Mlab Host goes here */
let mlabHost = config.get('database.mlab-host');
let option = config.get('database.mlab-auth');


//mongooseConnector.connectToMongo(mlabHost, option);
mongooseConnector.connectToMongo(mlabHost, option);
 //mongooseConnector.connectToMongo(localhost);

/**
 * ------   End of database connection configuration ---------------------------------------
 */

//configure path link
app.use('/', index);
app.use('/users', users);
app.use('/api/v1', api);

app.use('/api/v2/categories', categoryRouter);
app.use('/api/v2/articles', articleRouter);
app.use('/api/v2/users', userRouter);
app.use('/api/v2/notifications', notificationRouter);


schedulerService.recalculateArticlesScore();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
