var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
var _storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({storage: _storage});

var cookieParser = require('cookie-parser');

app.locals.pretty = true;

app.set('view engine', 'jade');
app.set('views', './views');
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());

/// 카운터
app.get('/count', function(req, res) {
  if (req.cookies.count) {
    var count = parseInt(req.cookies.count);
  } else {
    var count = 0;
  }
  count = count + 1;
  res.cookie('count', count);
  res.send('count: ' + count);
});

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

// 파일 업로드
app.get('/upload', function(req, res) {
  res.render('upload');
});

app.post('/upload', upload.single('userfile'), function(req, res) {
  console.log(req.file);
  res.send('Uploaded : ' + req.file.filename);
});

app.listen(3000, function() {
  console.log('Connected 3000 port');
});
