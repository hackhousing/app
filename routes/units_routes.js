'use strict';

var grid = require('gridfs-stream');
var Unit = require('../models/unit');
var updateObject = require('../lib/update-obj');

module.exports = function(app, appSecret, mongoose) {
  var jwtAuth = require('../lib/jwt-auth')(appSecret);
  var permissions = require('../lib/permissions');
  var formParser = require('../lib/form-parser')(mongoose.connection.db, mongoose.mongo);
  var removeImage = require('../lib/remove-image')(mongoose.connection.db, mongoose.mongo);

  //add a unit
  app.post('/api/units', jwtAuth, formParser, function(req, res) {
    var newUnit = new Unit();
    newUnit.ltlId = req.ltl._id;
    newUnit.title = req.body.title;
    newUnit.unitBody = req.body.unitBody;
    newUnit.date = new Date();
    newUnit.lat = req.body.lat;
    newUnit.lng = req.body.lng;
    if (req.body.image) newUnit.img = req.body.image;
    newUnit.save(function(err, data) {
      if (err) return res.status(500).send('there was an error');
      return res.json(data);
    });
  });

  //get a unit
  app.get('/api/units/single/:unitId', function(req, res) {
    Unit.findById(req.params.unitId, function(err, unit) {
      if (err) return res.status(500).send('unit not found');
      return res.json(unit);
    });
  });

  //update a particular unit
  app.put('/api/units/single/:unitId',
    jwtAuth,
    permissions,
    formParser,
    updateObject,
    removeImage,
  function(req, res) {
    //update the unit document
    req.unit.update(req.updateObj, function(err, numAffected, raw) {
      if (err) return res.status(500).send('update not successful');
      return res.json(raw);
    });
  });

  //get a unit's image
  app.get('/api/units/single/image/:unitId', function(req, res) {
    Unit.findById(req.params.unitId, function(err, unit) {
      if (err) return res.status(500).send('server error');
      if (!unit) return res.status(500).send('unit does not exist');
      var gfs = grid(mongoose.connection.db, mongoose.mongo);
      // streaming from gridfs
      var readstream = gfs.createReadStream({
        _id: unit.img
      });

      //error handling, e.g. file does not exist
      readstream.on('error', function(err) {
        console.log('An error occurred streaming the image!\n', err);
        return res.status(500).send('readstream error');
      });

      readstream.pipe(res);
    });
  });

  //get a particular ltl's unit
  app.get('/api/units/ltl', jwtAuth, function(req, res) {
    Unit.find({ltlId: req.ltl._id}, function(err, units) {
      if (err) return res.status(500).send('server error');
      return res.json(units);
    });
  });

  //get all units within certain radius of given lat/lng
  app.get('/api/units/location', function(req, res) {
    //check for count < 200
    Unit.where({
      lat: {$gte: parseFloat(req.headers.latmin), $lte: parseFloat(req.headers.latmax)},
      lng: {$gte: parseFloat(req.headers.lngmin), $lte: parseFloat(req.headers.lngmax)}
    }).count(function(err, count) {
      if (count < 200) {
        //if fewer than 200, return units
        return Unit.find({
          lat: {$gte: parseFloat(req.headers.latmin), $lte: parseFloat(req.headers.latmax)},
          lng: {$gte: parseFloat(req.headers.lngmin), $lte: parseFloat(req.headers.lngmax)}
         }, function(err, data) {
            if (err) return res.status(500).send('database error');
            return res.json(data);
          });
      }
      //otherwise, return count
      return res.json({unitCount: count});
    });
  });
};
