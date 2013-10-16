var io = require('socket.io').listen(8999);
var uuid = require('uuid');
var relay = io.of("/cmd-relay")
  .authorization(function (handshakeData, callback) {
    handshakeData.identifier = uuid();
    callback(null, true);
  })
  .on('connection', function (socket) {
        socket.emit('identifier', socket.handshake.identifier);
        socket.on('echo', function (msg) {
            socket.emit('echo', msg);
        });
        socket.on('link', function (id) {
            socket.join(id);
            socket.emit('linked');
            socket.on('relay', function(msg) {
                socket.broadcast.to(id).emit(msg.event, msg.data);
            });
        });
    });
