# connect-flash

The flash is a special area of the session used for storing messages.  Messages
are written to the flash and cleared after being displayed to the user.  The
flash is typically used in combination with redirects, ensuring that the message
is available to the next page that is to be rendered.

This middleware was extracted from [Express](http://expressjs.com/) 2.x, after
Express 3.x removed direct support for the flash.  connect-flash brings this
functionality back to Express 3.x, as well as any other middleware-compatible
framework or application. +1 for [radical reusability](http://substack.net/posts/b96642/the-node-js-aesthetic).

## Installation

    $ npm install connect-flash

## Usage

#### Express 3.x

Flash messages are stored in the session.  First, setup sessions as usual by
enabling `cookieParser` and `session` middleware.  Then, use `flash` middleware
provided by connect-flash.

    var flash = require('connect-flash');
    var app = express();

    app.configure(function() {
      app.use(express.cookieParser('keyboard cat'));
      app.use(express.session({ cookie: { maxAge: 60000 }}));
      app.use(flash());
    });

With `flash` middleware in place, all requests will have `req.flash()` function
that can be used for flash messages.

    app.get('/flash', function(req, res){
      req.flash('info', 'Flash is back!')
      res.redirect('/');
    });

    app.get('/', function(req, res){
      res.render('index', { message: req.flash('info') });
    });

## Examples

For an example using connect-flash in an Express 3.x app, refer to the [express3](https://github.com/jaredhanson/connect-flash/tree/master/examples/express3)
example.

## Tests

    $ npm install --dev
    $ make test

[![Build Status](https://secure.travis-ci.org/jaredhanson/connect-flash.png)](http://travis-ci.org/jaredhanson/connect-flash)

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)
  - [TJ Holowaychuk](https://github.com/visionmedia)

## License

(The MIT License)

Copyright (c) 2011 Jared Hanson

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
