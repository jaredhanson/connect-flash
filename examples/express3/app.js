var express = require('express')
  , flash = require('../..')
  , util = require('util');


var app = express();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session({ key: 'sid', cookie: { maxAge: 60000 }}));
  
  // Use connect-flash middleware.  This will add a `req.flash()` function to
  // all requests, matching the functionality offered in Express 2.x.
  
  app.use(flash());
  app.use(app.router);
});


app.get('/', function(req, res){
  res.render('index', { message: req.flash('info') });
});

app.get('/flash', function(req, res){
  req.flash('info', 'Hi there!')
  res.redirect('/');
});

app.get('/no-flash', function(req, res){
  res.redirect('/');
});

app.listen(3000);
