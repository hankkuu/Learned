var app = require('./config/express')();
var passport = require('./config/passport')(app);

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

var auth = require('./routes/auth')(passport);
app.use('/auth', auth);

app.listen(3000, function() {
  console.log('Connected, 3000 port!');
})
