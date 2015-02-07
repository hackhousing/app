'use strict';

var Ltl = require('../models/ltl');

module.exports = function(app, appSecret, passport, mongoose) {
  var formParser = require('../lib/form-parser')(mongoose.connection.db, mongoose.mongo);
  //add ltl
  app.post('/api/ltls', formParser, function(req, res) {
    Ltl.findOne({'basic.email': req.body.email}, function(err, ltl) {
      if (err) return res.status(500).send('server error');
      if (ltl) return res.status(500).send('cannot create that ltl');
      if (req.body.password !== req.body.passwordConfirm) return res.status(500).send('passwords do not match');

      var newLtl = new Ltl();
      newLtl.basic.email = req.body.email;
      newLtl.basic.password = newLtl.generateHash(req.body.password);
      newLtl.save(function(err) {
        if (err) return res.status(500).send('server error');
        res.json({jwt: newLtl.generateToken(appSecret)});
      });
    });
  });

  //sign ltl in
  app.get('/api/ltls', passport.authenticate('basic', {session: false}), function(req, res) {
    return res.json({jwt: req.user.generateToken(appSecret)});
  });

};
