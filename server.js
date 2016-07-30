var express = require('express');
var network = require('./src/network');
var bodyParser = require('body-parser');

(function() {

	var app = express();

	app.use(express.static('static'));
	app.use(bodyParser.json());

	app.use(function authenticate(req, res, next){
		if(req.get("Password") === 'admin') {
			next();
			return;
		}

		res.sendStatus(403);
	});

	app.get('/api/hosts', function(req, res) {
		res.send( network.getHosts() );
	});

	app.post('/api/host/ping', function(req, res) {
		network.pingHost(req.body, function(pingInfo) {
			res.send(pingInfo);
		});
	});

	app.post('/api/host/wake', function(req, res) {
		network.wakeHost(req.body);
		res.send("{\"sended\": true}");
	});

	app.listen(3000);
	
}());
