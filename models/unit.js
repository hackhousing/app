'use strict';

var mongoose = require('mongoose');

var unitSchema = mongoose.Schema({
  ltlId: mongoose.Schema.Types.ObjectId,
  title: {type: String, required: true},
  unitBody: {type: String, required: true},
  date: Date,
  img: mongoose.Schema.Types.ObjectId,
  lat: {type: Number, required: true},
  lng: {type: Number, required: true}
});

module.exports = mongoose.model('Unit', unitSchema);
