module.exports = function flash(options) {
  options = options || {};
  var safe = (options.unsafe === undefined) ? true : !options.unsafe;
  
  return function(req, res, next) {
    if (req.flash && safe) { return next(); }
    
    req.flash = _flash;
    next();
  }
}

function _flash(type, msg) {
  if (this.session === undefined) throw Error('req.flash() requires sessions');
  var msgs = this.session.flash = this.session.flash || {};
  if (type && msg) {
    // TODO: Format messages
    
    return (msgs[type] = msgs[type] || []).push(msg);
  } else if (type) {
    var arr = msgs[type];
    delete msgs[type];
    return arr || [];
  } else {
    this.session.flash = {};
    return msgs;
  }
}
