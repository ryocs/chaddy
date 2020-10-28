  
var io = require('socket.io').listen(5000);

var users = {};
var chat = [];

io.sockets.on('connection', function (socket) {
	
	socket.on('message', function(data) {
		console.log(data);
		chat.push(data);
		socket.broadcast.json.emit('message', data);
	});

	socket.on('new_user', (data) => {
		users[socket.id] = {username: data.username, color: data.color};
		console.log(`user ${data.username} connected`);
	});

	socket.on('userlist', () => {
		socket.json.emit('userlist', users);
		socket.broadcast.json.emit('userlist', users);
	});	

	socket.on('load_chat', () => {
		socket.json.emit('load_chat', chat);
	});
	
	
	socket.on('disconnect', function () {
		console.log(`user ${users[socket.id].username} disconnected`);
		delete users[socket.id];
		socket.broadcast.json.emit('userlist', users);
	});
});