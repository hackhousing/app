'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var expect = chai.expect;

var url = 'http://localhost:3000';
var jwt = require('jwt-simple');
var app = require('../../server');

chai.use(chaiHttp);

describe('ltls', function() {
  before(function() {
    mongoose.connection.collections.ltls.drop(function(err) {
      if (err) { console.log(err); }
    });
  });

  var jwt;

  it('should create a new ltl', function(done) {
    chai.request(url)
    .post('/api/ltls')
    .field('email', 'test@example.com')
    .field('password', 'asdf')
    .field('passwordConfirm', 'asdf')
    .field('name', 'the fonz')
    .field('phone', '123-456-7890')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.not.have.status(500);
      expect(res.body).to.have.property('jwt').that.is.a('string');
      done();
    });
  });

  it('should sign a ltl in', function(done) {
    chai.request(url)
    .get('/api/ltls')
    .auth('test@example.com', 'asdf')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res.body).to.have.property('jwt').that.is.a('string');
      jwt = res.body.jwt;
      done();
    });
  });
});
