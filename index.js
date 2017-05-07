var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/in', function(req, res){
  res.sendFile(__dirname + '/in.html');
});

app.get('/out', function(req, res){
  res.sendFile(__dirname + '/out.html');
});

app.get('/day21', function(req, res){
  res.sendFile(__dirname + '/days/day21.html');
});
var users = {};
io.on('connection', function(client) {
 
  client.emit('users base', users);
  client.emit('user connected', client.id);
  client.on('user done', function(coordx, coordy){
    users[client.id] = {
      x: coordx,
      y: coordy
    }
    client.broadcast.emit('user done', coordx, coordy, client.id)
  });
  client.on('button clicked', function(value){
    client.broadcast.emit('sprite change coord', client.id, value);
    client.emit('button clicked', client.id, value);
    users[client.id].x = +users[client.id].x + value
  });
  client.on('disconnect', function(){
    client.broadcast.emit('user disconnected', client.id);
    delete users[client.id];
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
