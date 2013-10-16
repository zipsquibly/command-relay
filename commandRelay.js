var io = require('socket.io').listen(8999);

var relay = io
  .of("/cmd-relay")
  .on('connection', function (socket) {

  });

