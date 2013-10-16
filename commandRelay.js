var io = require('socket.io').listen(8999);

var relay = io
  .of("/cmd-relay")
  .on('connection', function (socket) {
        console.log("connected");
        socket.on('echo', function (msg) {
            socket.emit('echo', msg);
        });
  });

