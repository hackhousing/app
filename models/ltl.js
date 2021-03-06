'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');

var ltlSchema = mongoose.Schema({
  basic: {
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    password: {type: String, required: true}
  }
});

ltlSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.basic.password);
};

ltlSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

ltlSchema.methods.generateToken = function(secret) {
  var _this = this;
  return jwt.encode({
    iss: 'hackhousing',
    sub: _this._id
  }, secret);
};

module.exports = mongoose.model('Ltl', ltlSchema);
