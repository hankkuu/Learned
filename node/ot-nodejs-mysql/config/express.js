module.exports = function() {
  var express = require('express');
  var app = express();
  var session = require('express-session');

  var MySQLStore = require('express-mysql-session')(session);
  var bodyParser = require('body-parser');

  app.set('views', './views');
  app.set('view engine', 'jade');

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(session({
    secret: 'some-strange-strings',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
      host: 'localhost',
      port: 3306,
      user: 'root',
      database: 'o2'
    })
  }));

  return app;
}
