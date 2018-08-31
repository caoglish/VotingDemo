var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', function (request, response) {
	// response.send('Hello,wolrd');
	response.sendFile(__dirname + "/index.html");
});


app.get('/static', function (request, response) {
	// response.send('Hello,wolrd');
	response.sendFile(__dirname + "/staticCenter.html");
});

 //var voting = [];
//var clientList=[];
var clientDataList=[];

var static = io.of("/static").on('connect', (socket) => {
	console.log('static connect have been made.');
	io.emit('connected', 'static connect have been made.');
	//static.emit("static.selection", voting);
	static.emit("static.clientList",clientDataList);
	console.log(clientDataList);
});



var client = io.of("/client").on('connect', (socket) => {
	
	console.log("client["+socket.id + '] connect have been made.');
    let clientData = {
		id: socket.id,
		username:null,
		selection:null
    };
	clientDataList.push(clientData);
	
	socket.emit("user.name", socket.id);
	static.emit("static.clientList", clientDataList);
	
	
	socket.on('vote', function (selection) {
		clientData.selection = selection;
		static.emit("static.clientList", clientDataList);
	});

	socket.on('updateName', function (username) {
		clientData.username = username;
		static.emit("static.clientList", clientDataList);
	});

	socket.on('disconnect', function () {
		console.log("client[" + socket.id + '] is disconnected.');
		clientDataList=clientDataList.filter((v) => {
			return v.id != socket.id
		});
		static.emit("static.clientList", clientDataList);
	});

});

