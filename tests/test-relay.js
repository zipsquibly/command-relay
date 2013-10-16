/* jshint laxcomma: true */
var chai = require("chai"),
  assert = chai.assert,
  expect = chai.expect,
  util = require("util"),
  io = require("socket.io-client");

describe('commandRelay', function() {

  var socket;
  var HOST = "http://127.0.0.1:8999";

  before(function(done) {
      require("../commandRelay.js");
      done();
  });
  it('should connect', function(done) {
    socket = io.connect(HOST + '/cmd-relay');
    socket.on('connect', function () {
        done();
    });
  });
  it('should echo', function(done) {
      socket.on('echo', function(msg) {
          expect(msg).to.equal('hello');
          done();
      });
      socket.emit('echo', 'hello');
  });
});
