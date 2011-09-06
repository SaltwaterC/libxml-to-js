var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var callback = false;

parser(fs.readFileSync('data/broken.xml').toString(), function (err, res) {
	callback = true;
	assert.ok(err instanceof Error);
	assert.equal(err.code, 4);
});

process.on('exit', function () {
	assert.ok(callback);
});
