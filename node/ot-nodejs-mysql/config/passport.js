module.exports = function(app) {
  var conn = require('./db')();
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;
  var bkfd2Password = require('pbkdf2-password');
  var hasher = bkfd2Password();

  app.use(passport.initialize());
  app.use(passport.session());

  /// 패스포트 사용
  passport.use(new LocalStrategy(
    function(username, password, done) {
      var uname = username;
      var pwd = password;
      var sql = 'SELECT * FROM users WHERE authId=?';
      conn.query(sql, ['local:'+uname], function(err, results) {
        if (err) {
          return done('There is no user.');
        }
        var user = results[0];
        return hasher(
          {password: pwd, salt: user.salt},
          function(err, pass, salt, hash) {
            if (hash === user.password) {
              done(null, user);
            } else {
              done(null, false);
            }
          }
        );
      });
    }
  ));

  passport.use(new FacebookStrategy(
    {
      clientID: '234018257055870',
      clientSecret: '4d2afa0874e8abb57aad75981b300626',
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
    },
    function(accessToken, refreshToken, profile, done) {
      var authId = 'facebook:' + profile.id;
      var sql = 'SELECT * FROM users WHERE authId=?';
      conn.query(sql, [authId], function(err, results) {
        if (results.length > 0){
          done(null, results[0]);
        } else {
          var sql = 'INSERT INTO users SET ?';
          var newuser = {
            'authId': authId,
            'displayName': profile.displayName,
            'email': profile.email
          };
          conn.query(sql, [newuser], function(err, results) {
            if (err) {
              console.log(err);
              done('Error');
            } else {
              done(null, newuser);
            }
          });
        }
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.authId);
  });

  passport.deserializeUser(function(id, done) {
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, [id], function(err, results) {
      if (err) {
        console.log(err);
        done('There is no user.');
      } else {
        done(null, results[0]);
      }
    });
  });

  return passport;
}
