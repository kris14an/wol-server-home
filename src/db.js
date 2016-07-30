const fs = require("fs");

module.exports = (function() {
	return {
		readHosts: function() {
			return require('./database.json');
		},
		saveHosts: function(hosts) {
			if(hosts instanceof Array) {
				fs.writeFile('./src/database.json', JSON.stringify( hosts ), "utf8");
			} else {
				throw new Error("Hosts must by Array!");
			}
		}
	}
}());