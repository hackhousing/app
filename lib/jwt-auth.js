'use strict';

var jwt = require('jwt-simple');
var Ltl = require('../models/ltl');

module.exports = function(secret) {
  return function(req, res, next) {
    var token = req.headers.jwt;

    var decoded;
    try {
      decoded = jwt.decode(token, secret);
    } catch (e) {
      return res.status(403).send('decode error');
    }

    Ltl.findById(decoded.sub, function(err, ltl) {
      if (err) return res.status(500).send('server error');
      if (!ltl) return res.status(403).send('access denied');
      req.ltl = ltl;
      next();
    });
  };
};
