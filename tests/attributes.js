var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var callback = false;
var callbackXPath = false;

var xml = '<thing><real id="width">300</real><real id="height">200</real></thing>';

parser(xml, function (err, res) {
	callback = true;
	assert.ifError(err);
	assert.deepEqual({
		"real": [{
			"@": {
				"id": "width"
			},
			"#": "300"
		}, {
			"@": {
				"id": "height"
			},
			"#": "200"
		}]
	},
	res);
});

parser(xml, '//thing/real', function (err, res) {
	callbackXPath = true;
	assert.ifError(err);
	assert.deepEqual([
		{
			"@": {
				"id": "width"
			},
			"#": "300"
		}, {
			"@": {
				"id": "height"
			},
			"#": "200"
		}
	],
	res);
});

process.on('exit', function () {
	assert.ok(callback);
	assert.ok(callbackXPath);
});
