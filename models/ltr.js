'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');

var ltrSchema = mongoose.Schema({
  basic: {
    // name: {type: String, required: true},
    // email: {type: String, required: true},
    // password: {type: String, required: true},
    // magi: {type: Number, required: true},
    // phone: {type: String, required: true}
    name: {type: String},
    email: {type: String},
    password: {type: String},
    magi: {type: Number},
    phone: {type: String}
  }
});

ltrSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.basic.password);
};

ltrSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

ltrSchema.methods.generateToken = function(secret) {
  var _this = this;
  return jwt.encode({
    iss: 'hackhousing',
    sub: _this._id
  }, secret);
};

module.exports = mongoose.model('Ltr', ltrSchema);
