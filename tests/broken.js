var parser = require('../');

var fs = require('fs');
var assert = require('assert');

parser(fs.readFileSync('data/broken.xml').toString(), function (err, res) {
	assert.ok(err instanceof Error);
	assert.equal(err.code, 4);
});
