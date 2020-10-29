const config = require('./config');

var io = require('socket.io').listen(config.getParam("port"));

console.log(`Starting server with port: ${config.getParam("port")}`);

var users = {};

var rooms = {
	"default": {
		"maxUsers": 200,
		"currentUsers": 0,
		"password": "",
		"deleteIfEmpty": false
	}
};
var chat = {
	"default": [],
	"test": []
};

io.sockets.on('connection', function (socket) {

	
	
	socket.on('message', function(data) {
		chat[users[socket.id].room].push(data);
		socket.to(users[socket.id].room).broadcast.json.emit('message', data);
	});

	socket.on('new_user', (data) => {
		console.log(data);
		users[socket.id] = {username: data.username, color: data.color, room: "none"};
		console.log(`User ${data.username} connected`);
	});

	socket.on('userlist', (roomname) => {
		let newusers = {};
		Object.keys(users).forEach(user => {
			if (users[user].room == roomname) newusers[user] = users[user];
		});
		socket.json.emit('userlist', newusers);
		socket.to(roomname).broadcast.json.emit('userlist', newusers);
	});	

	socket.on('roomlist', () => {
		let newroomlist = {};
		Object.keys(rooms).forEach(room => {
			newroomlist[room] = {
				"maxUsers": rooms[room].maxUsers,
				"currentUsers": rooms[room].currentUsers
			};
		});
		socket.json.emit('roomlist', newroomlist);
	});	

	socket.on('join', (roomname) => {
		rooms[roomname].currentUsers++;
		users[socket.id].room = roomname;
		socket.join(roomname);
	});

	socket.on('load_chat', () => {
		console.log(chat);
		socket.json.emit('load_chat', chat[users[socket.id].room]);
	});
	
	
	socket.on('disconnect', function () {
		if (Object.keys(users).length == 0) return;
		console.log(`user ${users[socket.id].username} disconnected`);
		roomname = users[socket.id].room;
		delete users[socket.id]
		if (roomname != "none") {
			rooms[roomname].currentUsers--;
			let newusers = {};
			Object.keys(users).forEach(user => {
				if (users[user].room == roomname) newusers[user] = users[user];
			});
			socket.to(roomname).broadcast.json.emit('userlist', newusers);
		}
	});

	socket.on('create_room', (roomname) => {

		if (rooms[roomname] != undefined) return;

		rooms[roomname] = {
			"maxUsers": 200,
			"currentUsers": 0,
			"password": "",
			"deleteIfEmpty": true
		}


		let newroomlist = {};
		Object.keys(rooms).forEach(room => {
			newroomlist[room] = {
				"maxUsers": rooms[room].maxUsers,
				"currentUsers": rooms[room].currentUsers
			};
		});
		socket.json.emit('roomlist', newroomlist);
	});
});