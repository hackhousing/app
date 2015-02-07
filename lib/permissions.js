'use strict';

/*
* Make sure a ltl has permissions to modify the story
*/

var Unit = require('../models/unit');

module.exports = function(req, res, next) {
  Unit.findById(req.params.unitId, function(err, unit) {
    if (err) return res.status(500).send('unit not found');
    if (String(unit.ltlId) !== String(req.ltl._id)) return res.status(403).send('not authorized');
    req.unit = unit;
    next();
  });
};
