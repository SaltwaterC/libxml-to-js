var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var callback = false;

parser(fs.readFileSync('data/text.xml').toString(), function (err, res) {
	callback = true;
	assert.ifError(err);
	assert.deepEqual({
		'news': [{
			"auteur": "Bizzard5",
			"date": "17 Août 2008",
			"text": {}
		}, {
			"auteur": "Little",
			"date": "18 Août 2007",
			"text": {
				"test": "test"
			}
		}, {
			"auteur": "Bizzard5",
			"date": "17 Août 2008",
			"text": "C'est un teste"
		}, {
			"auteur": "Little",
			"date": "18 Août 2007",
			"text": "Allo"
		}, {
			"auteur": "Little",
			"date": "18 Août 2007",
			"text": {
				"text": "test"
			}
		}]
	},
	res);
});

process.on('exit', function () {
	assert.ok(callback);
});
