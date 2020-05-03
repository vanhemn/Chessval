/*=====================Initialisation=====================*/
const express = require("express");
require('dotenv').config();
const app  = express();
const http = require('http').Server(app);
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

/*------include fichier------*/
app.get('/', function(req, res) {
		res.sendFile("public/view/index.html")
	});

/*======================route fichier static (public)====================*/
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/img", express.static(__dirname + '/public/img'));
app.use("/js", express.static(__dirname + '/public/js'));


/*==================start serv==================*/
http.listen(process.env.PORT, function(){
	console.log('listening on *:' + process.env.PORT);
});