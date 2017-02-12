var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

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

app.post('/auth/login', function(req, res) {
  var user = {
    username: 'egoing',
    password: '111',
    displayName: 'Egoing'
  };
  var uname = req.body.username;
  var pwd = req.body.password;
  if (uname === user.username && pwd === user.password) {
    req.session.displayName = user.displayName;
    res.redirect('/welcome');
  } else {
    res.send('Who are you? <a href="/auth/login">login</a>');
  }
});

app.get('/welcome', function(req, res) {
  if (req.session.displayName) {
    res.send(`
      <h1>Hello, ${req.session.displayName}</h1>
      <a href='/auth/logout'>logout</a>
    `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <a href='/auth/login'>Login</a>
    `)
  }
});

app.get('/auth/logout', function(req, res) {
  delete req.session.displayName;
  req.session.save(function() {
    res.redirect('/welcome');
  })
});

app.listen(3000, function() {
  console.log('Connected, 3000 port!');
})
