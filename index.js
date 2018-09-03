/*eslint no-console: ["error", { allow: ["warn", "log"] }] */
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);
//route
app.get('/', function (request, response) {
	response.sendFile(__dirname + '/index.html');
});


app.get('/static', function (request, response) {
	response.sendFile(__dirname + '/staticCenter.html');
});


var clientDataList=[];

//staticCenter
var staticCenter = io.of('/static').on('connect', (socket) => {
	console.log('static connect have been made.');
	io.emit('connected', 'static connect have been made.');
	staticCenter.emit('static.clientList',clientDataList);
});


//client
var client = io.of('/client').on('connect', (socket) => {
	console.log('client['+socket.id + '] connect have been made.');
	
	let clientData = {
		id: socket.id,
		username:null,
		selection:null
	};
	clientDataList.push(clientData);
	
	socket.emit('user.name', socket.id);
	staticCenter.emit('static.clientList', clientDataList);
	
	
	socket.on('vote', function (selection) {
		clientData.selection = selection;
		staticCenter.emit('static.clientList', clientDataList);
	});

	socket.on('updateName', function (username) {
		clientData.username = username;
		staticCenter.emit('static.clientList', clientDataList);
	});

	socket.on('disconnect', function () {
		console.log('client[' + socket.id + '] is disconnected.');
		clientDataList=clientDataList.filter((v) => {
			return v.id != socket.id;
		});
		staticCenter.emit('static.clientList', clientDataList);
	});

});

