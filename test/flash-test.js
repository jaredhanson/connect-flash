var vows = require('vows');
var assert = require('assert');
var util = require('util');
var flash = require('flash');


function MockRequest() {
  this.session = {};
}

function MockRequestWithoutSession() {
}

function MockResponse() {
}


vows.describe('flash').addBatch({

  'middleware': {
    topic: function() {
      return flash();
    },
    
    'when handling a request': {
      topic: function(flash) {
        var self = this;
        var req = new MockRequest();
        var res = new MockResponse();
        
        function next(err) {
          self.callback(err, req, res);
        }
        process.nextTick(function () {
          flash(req, res, next)
        });
      },
      
      'should not error' : function(err, req, res) {
        assert.isNull(err);
      },
      'should add a flash function' : function(err, req, res) {
        assert.isFunction(req.flash);
      },
      'should set flash message' : function(err, req, res) {
        var count = req.flash('error', 'Something went wrong');
        assert.equal(count, 1);
        assert.lengthOf(Object.keys(req.session.flash), 1);
        assert.lengthOf(req.session.flash['error'], 1);
      },
      'should get and clear previously set flash message' : function(err, req, res) {
        var msgs = req.flash('error');
        assert.lengthOf(msgs, 1);
        assert.equal(msgs[0], 'Something went wrong');
        assert.lengthOf(Object.keys(req.session.flash), 0);
      },
      'should set multiple flash messages' : function(err, req, res) {
        req.flash('info', 'Welcome');
        var count = req.flash('info', 'Check out this great new feature');
        assert.equal(count, 2);
        assert.lengthOf(Object.keys(req.session.flash), 1);
        assert.lengthOf(req.session.flash['info'], 2);
      },
      'should get and clear multiple previously set flash messages' : function(err, req, res) {
        var msgs = req.flash('info');
        assert.lengthOf(msgs, 2);
        assert.equal(msgs[0], 'Welcome');
        assert.equal(msgs[1], 'Check out this great new feature');
        assert.lengthOf(Object.keys(req.session.flash), 0);
      },
      'should set flash messages of multiple types' : function(err, req, res) {
        req.flash('info', 'Welcome back');
        req.flash('notice', 'Last login was yesterday');
        assert.lengthOf(Object.keys(req.session.flash), 2);
        assert.lengthOf(req.session.flash['info'], 1);
        assert.lengthOf(req.session.flash['notice'], 1);
      },
      'should independently get and clear messages of multiple types' : function(err, req, res) {
        var msgs = req.flash('info');
        assert.lengthOf(msgs, 1);
        assert.equal(msgs[0], 'Welcome back');
        assert.lengthOf(Object.keys(req.session.flash), 1);
        msgs = req.flash('notice');
        assert.lengthOf(msgs, 1);
        assert.equal(msgs[0], 'Last login was yesterday');
      },
      'should return all messages' : function(err, req, res) {
        req.flash('error', 'Database is down');
        req.flash('error', 'Message queue is down');
        req.flash('notice', 'Things are looking bleak');
        var msgs = req.flash();
        assert.lengthOf(Object.keys(msgs), 2);
        assert.lengthOf(msgs['error'], 2);
        assert.lengthOf(msgs['notice'], 1);
        assert.lengthOf(Object.keys(req.session.flash), 0);
      },
      'should format messages' : function(err, req, res) {
        if (util.format) {
          req.flash('info', 'Hello %s', 'Jared');
          var msg = req.flash('info')[0];
          assert.equal(msg, 'Hello Jared')
        
          req.flash('info', 'Hello %s %s', 'Jared', 'Hanson');
          var msg = req.flash('info')[0];
          assert.equal(msg, 'Hello Jared Hanson')
        }
      },
      'should return empty array for flash type with no messages' : function(err, req, res) {
        var msgs = req.flash('what');
        assert.lengthOf(msgs, 0);
      },
    },
    
    'when handling a request with an existing flash function': {
      topic: function(flash) {
        var self = this;
        var req = new MockRequest();
        req.flash = function(type, msg) {
          this.session.flash = 'I Exist'
        }
        var res = new MockResponse();
        
        function next(err) {
          self.callback(err, req, res);
        }
        process.nextTick(function () {
          flash(req, res, next)
        });
      },
      
      'should not error' : function(err, req, res) {
        assert.isNull(err);
      },
      'should not overwrite flash function' : function(err, req, res) {
        req.flash('question', 'Do you?')
        assert.equal(req.session.flash, 'I Exist');
      },
    },
    
    'when handling a request without a session': {
      topic: function(flash) {
        var self = this;
        var req = new MockRequestWithoutSession();
        var res = new MockResponse();
        
        function next(err) {
          self.callback(err, req, res);
        }
        process.nextTick(function () {
          flash(req, res, next)
        });
      },
      
      'should not error' : function(err, req, res) {
        assert.isNull(err);
      },
      'should add a flash function' : function(err, req, res) {
        assert.isFunction(req.flash);
      },
      'should throw when attempting to set a flash message' : function(err, req, res) {
        assert.throws(function() {
          req.flash('error', 'Something went wrong');
        });
      },
    },
  },
  
  'middleware with an unsafe option': {
    topic: function() {
      return flash({ unsafe: true });
    },
    
    'when handling a request with an existing flash function': {
      topic: function(flash) {
        var self = this;
        var req = new MockRequest();
        req.flash = function(type, msg) {
          this.session.flash = 'I Exist'
        }
        var res = new MockResponse();
        
        function next(err) {
          self.callback(err, req, res);
        }
        process.nextTick(function () {
          flash(req, res, next)
        });
      },
      
      'should not error' : function(err, req, res) {
        assert.isNull(err);
      },
      'should overwrite flash function' : function(err, req, res) {
        req.flash('info', 'It works!');
        assert.lengthOf(Object.keys(req.session.flash), 1);
        assert.lengthOf(req.session.flash['info'], 1);
      },
    },
  },

}).export(module);
