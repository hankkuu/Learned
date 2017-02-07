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
var session = require('express-session');

app.use(session({
  secret: 'some-strange-strings',
  resave: false,
  saveUninitialized: true
}));

app.locals.pretty = true;

app.set('view engine', 'jade');
app.set('views', './views');
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser('some-strange-strings'));

/// 카운터
app.get('/count', function(req, res) {
  if (req.signedCookies.count) {
    var count = parseInt(req.signedCookies.count);
  } else {
    var count = 0;
  }
  count = count + 1;
  res.cookie('count', count, {signed: true});
  res.send('count: ' + count);
});

app.get('/count_session', function(req, res) {
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send('count: ' + req.session.count);
})

var products = {
  1: {title: 'The history of web 1'},
  2: {title: 'The next web'}
};

app.get('/products', function(req, res) {
  var output = '';
  for (var name in products) {
    output += `
      <li>
        <a href='/cart/${name}'>${products[name].title}</a>
      </li>`;
  };
  res.send(`<h1>Products</h1><ul>${output}</ul><a href='/cart'>Cart</a>`)
})

/// 카트 기능 구현
app.get('/cart/:id', function(req, res) {
  var id = req.params.id;
  if (req.signedCookies.cart) {
    var cart = req.signedCookies.cart;
  } else {
    var cart = {};
  }

  if (!cart[id]) {
    cart[id] = 0;
  }
  cart[id] = parseInt(cart[id]) + 1;
  res.cookie('cart', cart, {signed: true});
  res.redirect('/cart');
});

app.get('/cart', function(req, res) {
  var cart = req.signedCookies.cart;
  if (!cart) {
    res.send('Empty');
  } else {
    var output = '';
    for (var id in cart) {
      output += `<li>${products[id].title} (${cart[id]})</li>`
    }
  }
  res.send(`
    <h1>Cart</h1>
    <ul>${output}</ul>
    <a href='/products'>Products List</a>
  `);
})

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

// 로그인 기능
app.get('/auth/login', function(req, res) {
  var output = `
    <h1>Login</h1>
    <form action='/auth/login' method='post'>
      <p>
        <input type='text' name='username' placeholder='username'>
      </p>
      <p>
        <input type='password' name='password' placeholder='password'>
      </p>
      <input type='submit'>
    </form>`;
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
    res.send('Who are you? <a href="/auth/login">login</a>')
  };
})

app.get('/welcome', function(req, res) {
  if (req.session.displayName) {
    res.send(`
      <h1>Hello, ${req.session.displayName}</h1>
      <a href="/auth/logout">logout</a>`);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <a href="/auth/login">Login</a>`)
  };
});

app.get('/auth/logout', function(req, res) {
  delete req.session.displayName;
  req.session.save(function() {
    res.redirect('/welcome');
  });
})

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
