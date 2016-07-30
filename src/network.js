var wol = require('node-wol');
var db = require('./db');
var ping = require('ping');

function Host(ip, mac) {
	this.ip = ip;
	this.mac = mac;
}

module.exports = (function() {
	const config = {
		timeout: 200
	};

	return {
		getHosts: function() {
			return db.readHosts();
		},
		pingHost: function(host, callback) {
			ping.promise.probe(host.ip, config).then(function(pingRes) {
				callback( pingRes );
			});
		},
		wakeHost: function(host) {
			var macAddress = host.mac.toUpperCase();
			wol.wake(macAddress, function(error) {
				console.log(error)
			});
		}
	}
}());