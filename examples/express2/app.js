var express = require('express')
  , flash = require('../..')
  , util = require('util');


var app = express.createServer();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  
  // Setting `unsafe` to `true` causes connect-flash's implementation to
  // override Express 2.x's implementation.  Functionally these are equivalent,
  // so there is no reason to use connect-flash with Express 2.x.  This example
  // is for illustrative purposes only.
  
  app.use(flash({ unsafe: true }));
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
