'use strict';

var Ltr = require('../models/ltr');

module.exports = function(app, appSecret, passport, mongoose) {
  var formParser = require('../lib/form-parser')(mongoose.connection.db, mongoose.mongo);
  //add ltr
  app.post('/api/ltrs', formParser, function(req, res) {
    Ltr.findOne({'basic.email': req.body.email}, function(err, ltr) {
      if (err) return res.status(500).send('server error');
      if (ltr) return res.status(500).send('cannot create that ltr');
      if (req.body.password !== req.body.passwordConfirm) return res.status(500).send('passwords do not match');

      var newLtr = new Ltr();
      newLtr.basic.email = req.body.email;
      newLtr.basic.password = newLtr.generateHash(req.body.password);
      newLtr.basic.name = req.body.name;
      newLtr.basic.phone = req.body.phone;
      newLtr.basic.magi = req.body.magi;
      newLtr.save(function(err) {
        if (err) return res.status(500).send('server error');
        res.json({jwt: newLtr.generateToken(appSecret)});
      });
    });
  });

  //sign ltr in
  app.get('/api/ltrs', passport.authenticate('basic', {session: false}), function(req, res) {
    return res.json({jwt: req.user.generateToken(appSecret)});
  });

};