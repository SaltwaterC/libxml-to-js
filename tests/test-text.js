var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var callback = false;
var callbackXPath = false;

var xml = fs.readFileSync('data/text.xml').toString();

parser(xml, function (err, res) {
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

parser(xml, '//nouvelle/news', function (err, res) {
	callbackXPath = true;
	assert.ifError(err);
	assert.deepEqual({
		"auteur": "Bizzard5",
		"date": "17 Août 2008",
		"text": {}
	},
	res[0]);
});

process.on('exit', function () {
	assert.ok(callback);
	assert.ok(callbackXPath);
});
