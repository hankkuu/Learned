module.exports = function() {
  var route = require('express').Router();
  var conn = require('../config/db')();

  /// 글 작성
  route.get('/new', function(req, res) {
    var sql = 'SELECT id, title FROM topic';
    conn.query(sql, function(err, topics, fields) {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.render('topic/new', {topics: topics});
      }
    });
  });

  route.post('/new', function(req, res) {
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

  route.get(['/', '/:id'], function(req, res) {
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
            res.render('topic/view', {topics: topics, topic: topic[0]});
          }
        });
      } else {
        res.render('topic/view', {topics: topics});
      }
    })
  });

  /// 글 수정
  route.get('/:id/edit', function(req, res) {
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
            res.render('topic/edit', {topics: topics, topic: topic[0]});
          }
        });
      } else {
        console.log('There is no id.');
        res.status(500).send('Internal Server Error.');
      }
    });
  });

  route.post('/:id/edit', function(req, res) {
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
  route.get('/:id/delete', function(req, res) {
    var sql = 'SELECT id, title FROM topic';
    conn.query(sql, function(err, topics, fields) {
      var sql = 'SELECT * FROM topic WHERE id=?';
      var id = req.params.id;
      conn.query(sql, [id], function(err, topic, fields) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('topic/delete', {topics: topics, topic: topic[0]});
        }
      });
    });
  });

  route.post('/:id/delete', function(req, res) {
    var id = req.params.id;
    var sql = 'DELETE FROM topic WHERE id=?'
    conn.query(sql, [id], function(err, result) {
      res.redirect('/topic');
    })
  });

  return route;
}
