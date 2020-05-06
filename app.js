/*=====================Initialisation=====================*/
const express = require("express");
require('dotenv').config();
const app  = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const bodyParser = require('body-parser')
const path = require('path');
const minify = require('express-minify');
/*======================================================*/


// Middleware session
app.use(minify({cache: __dirname + '/cache'}));
app.use(bodyParser.json({limit: '10MB'}));       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

/*======================routes==========================*/ 

app.get('/game/:id', function(req, res) {
	res.sendFile(__dirname + "/public/view/game.html")
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + "/public/view/index.html")
});

app.get('/api/game/data', function(req, res) {
	res.sendFile(__dirname + "/config/game.json")
});

/*======================route fichier static (public)====================*/
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/img", express.static(__dirname + '/public/img'));
app.use("/js", express.static(__dirname + '/public/js'));


/*==================start serv==================*/
http.listen(process.env.PORT, function(){
	console.log('listening on *:' + process.env.PORT);
});

io.on('connection', (socket) => {
	socket.roomslist = [];
	require('./src/gameManager.js')(socket, io);
	require('./src/chat.js')(socket, io);
});