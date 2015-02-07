'use strict';

var BasicStrategy = require('passport-http').BasicStrategy;
var Ltl = require('../models/ltl');

module.exports = function(passport) {
  var verify = function(ltlid, password, done) {
    Ltl.findOne({'basic.email': ltlid}, function(err, ltl) {
      if (err) return done('server error');
      if (!ltl) return done('ltl does not exist');
      if (!ltl.validatePassword(password)) return done('access denied');
      return done(null, ltl);
    });
  };

  passport.use(new BasicStrategy(verify));
};
