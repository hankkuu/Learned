var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

app.locals.pretty = true;

app.set('view engine', 'jade');
app.set('views', './views');
app.use(bodyParser.urlencoded({extended: false}));

/// 글 작성
app.get('/topic/new', function(req, res) {
  fs.readdir('data', function(err, files) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('new', {topics:files});
  });
});

app.post('/topic', function(req, res) {
  var title = req.body.title;
  var description = req.body.description;
  fs.writeFile('data/'+title, description, function(err) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.redirect('/topic/'+title);
  });
});

/// 글 목록 및 상세 조회
app.get(['/topic', '/topic/:id'], function(req, res) {
  fs.readdir('data', function(err, files) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    var id = req.params.id;
    if (id) {
      // id 값이 있을 때
      fs.readFile('data/'+id, 'utf8', function(err, data) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        res.render('view', {topics: files, title: id, description: data});
      })
    } else {
      res.render('view', {topics: files, title: 'Welcome', description: 'Hello, Javascript for server.'});
    }
  });
});

app.listen(3000, function() {
  console.log('Connected 3000 port');
});
