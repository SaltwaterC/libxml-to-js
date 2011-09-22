var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var callback = false;

parser('This is a broken XML file.', function (err, res) {
	callback = true;
	assert.ok(err instanceof Error);
	assert.equal(err.code, 4);
});

process.on('exit', function () {
	assert.ok(callback);
});
