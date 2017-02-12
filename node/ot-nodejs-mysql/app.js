var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();

var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'o2'
});
conn.connect();

app.set('views', './views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'some-strange-strings',
  resave: false,
  saveUninitialized: true,
  /// session store configure
  store: new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'o2'
  })
}));

app.use(passport.initialize());
app.use(passport.session());

/// 글 작성
app.get('/topic/new', function(req, res) {
  var sql = 'SELECT id, title FROM topic';
  conn.query(sql, function(err, topics, fields) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.render('new', {topics: topics});
    }
  });
});

app.post('/topic/new', function(req, res) {
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var sql = 'INSERT INTO topic (title, description, author) VALUES (?, ?, ?)';
  conn.query(sql, [title, description, author], function(err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/topic/'+rows.insertId);
    }
  });
});

app.get(['/topic', '/topic/:id'], function(req, res) {
  var sql = 'SELECT id, title FROM topic';
  conn.query(sql, function(err, topics, fields) {
    var id = req.params.id;
    if (id) {
      var sql = 'SELECT * FROM topic WHERE id=?';
      conn.query(sql, [id], function(err, topic, fields) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('view', {topics: topics, topic: topic[0]});
        }
      });
    } else {
      res.render('view', {topics: topics});
    }
  })
});

/// 글 수정
app.get('/topic/:id/edit', function(req, res) {
  var sql = 'SELECT id, title FROM topic';
  conn.query(sql, function(err, topics, fields) {
    var id = req.params.id;
    if (id) {
      var sql = 'SELECT * FROM topic WHERE id=?';
      conn.query(sql, [id], function(err, topic, fields) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('edit', {topics: topics, topic: topic[0]});
        }
      });
    } else {
      console.log('There is no id.');
      res.status(500).send('Internal Server Error.');
    }
  });
});

app.post('/topic/:id/edit', function(req, res) {
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var id = req.params.id;
  var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
  conn.query(sql, [title, description, author, id], function(err, topics, fields) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/topic/'+id);
    }
  });
});

// 글 삭제
app.get('/topic/:id/delete', function(req, res) {
  var sql = 'SELECT id, title FROM topic';
  conn.query(sql, function(err, topics, fields) {
    var sql = 'SELECT * FROM topic WHERE id=?';
    var id = req.params.id;
    conn.query(sql, [id], function(err, topic, fields) {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.render('delete', {topics: topics, topic: topic[0]});
      }
    });
  });
});

app.post('/topic/:id/delete', function(req, res) {
  var id = req.params.id;
  var sql = 'DELETE FROM topic WHERE id=?'
  conn.query(sql, [id], function(err, result) {
    res.redirect('/topic');
  })
})

/// 패스포트 사용
passport.use(new LocalStrategy(
  function(username, password, done) {
    var uname = username;
    var pwd = password;
    for (var i=0; i < users.length; i++) {
      var user = users[i];
      if (uname === user.username) {
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
      }
    }
    done(null, false);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  for (var i=0; i < users.length; i++) {
    var user = users[i];
    if (user.username === id) {
      return done(null, user);
    }
  }
});

/// 로그인 기능
app.get('/auth/login', function(req, res) {
  var output = `
    <h1>Login</h1>
    <form action='/auth/login' method='POST'>
      <p>
        <input type='text' name='username' placeholder='username'>
      </p>
      <p>
        <input type='password' name='password' placeholder='password'>
      </p>
      <input type='submit'>
    </form>
  `;
  res.send(output);
});

app.post(
  '/auth/login',
  passport.authenticate(
    'local',
    {
      successRedirect: '/welcome',
      failureRedirect: '/auth/login',
      failureFlash: false
    }
  )
);

var users = [
  {
    username: 'egoing',
    password: 'rTtmAX0/GlP5nXefMjB1EMSESR7as7fRZf1IVbuhoe25RuGJi5hzvG0T84+LpNPkdrIHRx4H3hZ5aMJIpaybqzbyUOtcfduZjIt4rNkt8nL0dC3Cbi0KfNg1FEjEMaBKeXABS0QqtGF9wFdSiO48Dr4Ho/rDYjrsu1Y5DLdW1yI=',
    displayName: 'Egoing',
    salt: 'TpCwET/PIsEw5lOGP/ijbEbAMlUzm2HfVuo9ijIZ+Bl1CUi6qQ6+t6YDrLrwBp29hAXpjB4iB7+T7iThzCiupQ=='
  }
];

/// 회원가입
app.get('/auth/register', function(req, res) {
  var output = `
    <h1>Register</h1>
    <form action='/auth/register' method='POST'>
      <p>
        <input type='text' name='username' placeholder='username'>
      </p>
      <p>
        <input type='password' name='password' placeholder='password'>
      </p>
      <p>
        <input type='text' name='displayName' placeholder='displayName'>
      </p>
      <p>
        <input type='submit'>
      </p>
    </form>
  `;
  res.send(output);
});

/// 회원가입에 암호화 적용
app.post('/auth/register', function(req, res) {
  hasher(
    {password: req.body.password},
    function(err, pass, salt, hash) {
      var user = {
        authId: 'local:' + req.body.username,
        username: req.body.username,
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
          res.redirect('/welcome');
        }
      });
    }
  )
});

app.get('/welcome', function(req, res) {
  if (req.user && req.user.displayName) {
    res.send(`
      <h1>Hello, ${req.user.displayName}</h1>
      <a href='/auth/logout'>logout</a>
    `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <ul>
        <li><a href='/auth/login'>Login</a></li>
        <li><a href='/auth/register'>Register</a></li>
      </ul>
    `)
  }
});

app.get('/auth/logout', function(req, res) {
  req.logout();
  req.session.save(function() {
    res.redirect('/welcome');
  })
});

app.listen(3000, function() {
  console.log('Connected, 3000 port!');
})
