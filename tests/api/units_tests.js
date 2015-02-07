'use strict';

var fs = require('fs');
var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var expect = chai.expect;
var url = 'http://localhost:3000';

chai.use(chaiHttp);

require('../../server');

describe('units', function() {
  before(function() {
    mongoose.connection.collections.ltls.drop(function(err) {
      if (err) { console.log(err); }
    });
    mongoose.connection.collections.units.drop(function(err) {
      if (err) { console.log(err); }
    });
  });

  var tempJWT;
  var tempUnitId;

  it('should create a new ltl', function(done) {
    chai.request(url)
    .post('/api/ltls')
    .field('email', 'test@example.com')
    .field('password', 'asdf')
    .field('passwordConfirm', 'asdf')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res.body).to.have.property('jwt').that.is.a('string');
      tempJWT = res.body.jwt;
      done();
    });
  });

  it('should add a unit', function(done) {
    chai.request(url)
    .post('/api/units')
    .set('jwt', tempJWT)
    .attach('file', __dirname + '/DSCN0119.JPG')
    .field('title', 'my cool title')
    .field('unitBody', 'the body of the unit')
    .field('lat', '47.34234')
    .field('lng', '-127.34234')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.not.have.status(500);
      expect(res.body).to.include.keys('img','title', 'unitBody', 'lat', 'lng', 'date', 'ltlId');
      tempUnitId = res.body._id;
      done();
    });
  });

  it('should return one unit given a unit id', function(done) {
    chai.request(url)
    .get('/api/units/single/' + tempUnitId)
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.not.have.status(500);
      expect(res.body).to.include.keys('img','title', 'unitBody', 'lat', 'lng', 'date', 'ltlId');
      done();
    });
  });

  it('should update a unit', function(done) {
    chai.request(url)
    .put('/api/units/single/' + tempUnitId)
    .set('jwt', tempJWT)
    .attach('file', __dirname + '/DSCN0196.JPG')
    .field('unitBody', 'the new body of the unit')
    .field('lat', '47.45768')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.not.have.status(500);
      expect(res).to.not.have.status(403);
      expect(res.body).to.have.deep.property('ok').to.not.eql(false);
      done();
    });
  });

  it('should return a unit\'s image given a unit id', function(done) {
    chai.request(url)
    .get('/api/units/single/image/' + tempUnitId)
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.not.have.status(500);
      expect(res).to.have.header('transfer-encoding', 'chunked');
      //create file
      fs.writeFileSync(__dirname + '/testImage.jpeg');
      //make write stream out of file
      var writeStream = fs.createWriteStream(__dirname + '/testImage.jpeg');
      //pipe res into write stream
      res.on('data', function(data) {
        writeStream.write(data);
      });
      //check if that file exists
      res.on('end', function() {
        fs.exists(__dirname + '/testImage.jpeg', function(exists) {
          expect(exists).to.be.true;
          fs.unlinkSync(__dirname + '/testImage.jpeg');
          done();
        });
      });
    });
  });

  it('should get a ltl\'s units', function(done) {
    chai.request(url)
    .get('/api/units/ltl')
    .set('jwt', tempJWT)
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.not.have.status(500);
      expect(res.body).to.be.an('array');
      done();
    });
  });

  //this is for the get('/api/units/location') route;
  //it shows that it excludes units outside its range
  it('should add another unit', function(done) {
    chai.request(url)
    .post('/api/units')
    .set('jwt', tempJWT)
    .field('title', 'out of range unit')
    .field('unitBody', 'this unit is not in range')
    .field('lat', '49.34234')
    .field('lng', '-130.34234')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res.body).to.include.keys('title', 'unitBody', 'lat', 'lng', 'date', 'ltlId');
      tempUnitId = res.body._id;
      done();
    });
  });

  it('should get units inside a range of coordinates', function(done) {
    chai.request(url)
    .get('/api/units/location')
    .set('latMin', 46.34234)
    .set('latMax', 48.34234)
    .set('lngMin', -127.91233)
    .set('lngMax', -127.24234)
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res.body).to.be.an('array')
        .to.have.deep.property('[0].title', 'my cool title');
      done();
    });
  });

  before(function() {
    for (var i = 0; i < 201; i++) {
      mongoose.connection.collections.units.insert({
        ltlId: '546d3092ad2269026e83de6c',
        title: i,
        unitBody: 'a unit',
        lat: 47.0005,
        lng: -122.05
      }, function(err) {
        if (err) return err;
      });
    }
  });

  it('should return a count instead of an array of units', function(done) {
    chai.request(url)
    .get('/api/units/location')
    .set('latMin', 47.0004)
    .set('latMax', 47.0006)
    .set('lngMin', -122.06)
    .set('lngMax', -122.04)
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res.body).to.have.property('unitCount')
        .that.eql(201);
      done();
    });
  });

});
