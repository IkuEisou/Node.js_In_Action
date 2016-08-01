var events = require('events')
  , net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};
channel.input = [];

channel.on('join', function(id, client) {
  var welcome = "Welcome!\n"
                + 'Guests online: ' + this.listeners('broadcast').length;
  client.write(welcome + "\n");
  this.clients[id] = client; 
  this.subscriptions[id] = function(senderId, message) {
    if (id != senderId) { 
      this.clients[id].write(message);
    }
  }
  this.on('broadcast', this.subscriptions[id]); 
});

channel.on('leave', function(id) { 
  channel.removeListener('broadcast', this.subscriptions[id]); 
  channel.emit('broadcast', id, id + " has left the chat.\n");
});

channel.on('shutdown', function() {
  channel.emit('broadcast', '', "Chat has shut down.\n");
  channel.input = [];
  channel.removeAllListeners('broadcast');
});

var server = net.createServer(function (client) {
  var id = client.remoteAddress + ':' + client.remotePort;

  channel.emit('join', id, client);
  channel.emit('broadcast', id, id+" joined\n");

  client.on('connect', function() {
    console.log("connect is heared\n");
    channel.emit('join', id, client); 
  });

  client.on('data', function(data) {
    // client.write(data);
    channel.input.push(data);
    var inputdata = channel.input.join("");
    console.log(inputdata);
    if(inputdata.indexOf("shutdown") != -1) {
      console.log("emit shudown\n");
      channel.emit('shutdown');
    }
    channel.emit('broadcast', id, inputdata); 
  });
  client.on('close', function() {
    channel.emit('leave', id); 
  });
});
server.listen(8888);
