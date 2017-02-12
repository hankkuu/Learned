module.exports = function(passport) {
  var route = require('express').Router();
  var conn = require('../config/db')();
  var bkfd2Password = require('pbkdf2-password');
  var hasher = bkfd2Password();

  /// 로그인 기능
  route.get('/login', function(req, res) {
    var sql = 'SELECT id, title FROM topic';
    conn.query(sql, function(err, topics, fields) {
      res.render('auth/login', {topics: topics});
    });
  });

  route.post(
    '/login',
    passport.authenticate(
      'local',
      {
        successRedirect: '/topic',
        failureRedirect: '/auth/login',
        failureFlash: false
      }
    )
  );

  /// passport facebook
  route.get(
    '/facebook',
    passport.authenticate(
      'facebook',
      {scope: 'email'}
    )
  );

  route.get(
    '/facebook/callback',
    passport.authenticate(
      'facebook',
      {
        successRedirect: '/topic',
        failureRedirect: '/auth/login',
        failureFlash: false
      }
    )
  );

  /// 회원가입
  route.get('/register', function(req, res) {
    var sql = 'SELECT id, title FROM topic';
    conn.query(sql, function(err, topics, fields) {
      res.render('auth/register', {topics: topics});
    });
  });

  /// 회원가입에 암호화 적용
  route.post('/register', function(req, res) {
    hasher(
      {password: req.body.password},
      function(err, pass, salt, hash) {
        var user = {
          authId: 'local:' + req.body.username,
          username : req.body.username,
          password: hash,
          salt: salt,
          displayName: req.body.displayName
        }
        var sql = 'INSERT INTO users SET ?';
        conn.query(sql, user, function(err, results) {
          if (err) {
            console.log(err);
            res.status(500);
          } else {
            req.login(user, function(err, results) {
              req.session.save(function() {
                res.redirect('/topic');
              });
            });
          }
        });
      }
    );
  });

  route.get('/logout', function(req, res) {
    req.logout();
    req.session.save(function() {
      res.redirect('/topic');
    });
  });

  return route;
}
