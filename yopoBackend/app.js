var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var users = require('./routes/users');
var mongoClient = require('mongodb').MongoClient;

var app = express();

// Models
var dbConfig = require('./models/db.js');
mongoClient.connect(dbConfig.url, function(err, database) {
	if(err) return console.log(err);
	db = database;
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/users', users);

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