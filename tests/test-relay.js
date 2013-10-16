/* jshint laxcomma: true */
var chai = require("chai"),
  assert = chai.assert,
  expect = chai.expect,
  util = require("util"),
  child_process = require("child_process"),
  io = require("socket.io-client");

describe('commandRelay', function() {

  var socket;
  var trayClient;
  var id = null;
  var HOST = "http://127.0.0.1:8999";

  before(function(done) {
      trayClient = child_process.fork('testClient.js');
      trayClient.send('Froosh');
      trayClient.on('message', function (m) {
          console.log('parent: ' + m);
      });
      done();
  });
  before(function(done) {
      require("../commandRelay.js");
      done();
  });
  it('should connect', function(done) {
    socket = io.connect(HOST + '/cmd-relay');
    socket.on('identifier', function (ident) {
        id = ident;
        socket.emit('link', id);
        done();
    });
  });
  it('should have an ID', function() {
      expect(id).to.not.be.null;
  });
  it('should create second client', function(done) {
      trayClient.send('connect');
      trayClient.once('message', function(m) {
          expect(m).to.be.equal('CONNECTED');
          done();
      });
  });
  it('should link both clients', function(done) {
      trayClient.send({'id':id});
      trayClient.once('message', function(m) {
          expect(m).to.be.equal('LINKED');
          done();
      });
  });
  it('should relay a message', function(done) {
    trayClient.send({'relay':'whassup', 'data':{'foo':'bar'}});
    trayClient.once('message', function(m) {
        expect(m).to.be.equal('RELAYED');
    });
    socket.once('whassup', function (m) {
        expect(m.foo).to.be.equal('bar');
        done()
    });
  });
});
