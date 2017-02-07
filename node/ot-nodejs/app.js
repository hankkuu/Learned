var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.locals.pretty = true;

app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

/// 정적 페이지 렌더링

app.get('/', function(req, res) {
  res.send('Hello homepage');
});

app.get('/login', function(req, res) {
  res.send('Login please');
});

app.get('/template', function(req, res) {
  res.render('temp', {time: Date(), title: 'Jade'});
});

/// 동적 페이지 렌더링

app.get('/dynamic', function(req, res) {
  var lis = '';
  for (var i=0; i<5; i++) {
    lis = lis + '<li>coding</li>'
  };
  var time = Date();
  var output = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset='utf-8'>
        <title></title>
      </head>
      <body>
        Hello, Dynamic
        <ul>
          ${lis}
        </ul>
        ${time}
      </body>
    </html>`;
  res.send(output);
});

app.get('/topic/:id', function(req, res) {
  var topics = [
    'Javascript is ...',
    'Nodejs is ...',
    'Express is ...'
  ];
  var as = `
    <a href='/topic/0'>Javascript</a><br>
    <a href='/topic/1'>Nodejs</a><br>
    <a href='/topic/2'>Expres</a><br><br>
    ${topics[req.params.id]}`;
  res.send(as);
});

/// POST 방식을 통한 정보 전달

app.get('/form', function(req, res) {
  res.render('form');
});

app.post('/form_receiver', function(req, res) {
  var title = req.body.title;
  var description = req.body.description;
  res.send(title + ', ' + description);
  res.send('Hello, POST');
});

app.listen(3000, function() {
  console.log('Connected 3000 port');
});
