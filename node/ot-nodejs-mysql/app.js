var app = require('./config/express')();
var passport = require('./config/passport')(app);

var topic = require('./routes/topic')();
app.use('/topic', topic);

var auth = require('./routes/auth')(passport);
app.use('/auth', auth);

app.listen(3000, function() {
  console.log('Connected, 3000 port!');
})
