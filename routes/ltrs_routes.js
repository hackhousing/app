'use strict';

var Ltr = require('../models/ltr');
var multiparty = require('multiparty');

module.exports = function(app, appSecret, passport, mongoose) {
  var formParser = require('../lib/form-parser')(mongoose.connection.db, mongoose.mongo);
  //add ltr
  app.post('/api/ltrs', function(req, res) {
    Ltr.findOne({'basic.email': req.body.email}, function(err, ltr) {
      if (err) return res.status(500).send('server error');
      if (ltr) return res.status(500).send('cannot create that ltr');
      if (req.body.password !== req.body.passwordConfirm) return res.status(500).send('passwords do not match');

      var form = new multiparty.Form();

      form.parse(req, function(err, fields, files) {
        console.dir(fields);

        var newLtr = new Ltr();
        // Object.keys(fields).forEach(function(name) {
        //   newLtr.basic[name] = fields[name][0];
        // });

        newLtr.basic.email = fields.email[0];
        newLtr.basic.password = newLtr.generateHash(fields.password[0]);
        newLtr.basic.name = fields.name[0];
        newLtr.basic.phone = fields.phone[0];
        newLtr.basic.magi = fields.magi[0];

        console.dir(newLtr);

        newLtr.save(function(err) {
          if (err) {
            console.log(err);
            return res.status(500).send('error saving to db');
          }
          res.json({jwt: newLtr.generateToken(appSecret)});
        });
      });

    });
  });

  //sign ltr in
  app.get('/api/ltrs', passport.authenticate('basic', {session: false}), function(req, res) {
    return res.json({jwt: req.user.generateToken(appSecret)});
  });

};
