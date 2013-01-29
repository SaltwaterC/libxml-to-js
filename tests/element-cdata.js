var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var xml = fs.readFileSync('data/element-cdata.xml').toString();

var callback = false;

parser(xml, function (err, res) {
	callback = true;
	assert.ifError(err);
	assert.strictEqual(res.phrase['#'], 'Home');
	assert.strictEqual(res.phrase['@'].section, 'default');
	assert.strictEqual(res.phrase['@'].code, 'widgethome');
});

process.on('exit', function () {
	assert.ok(callback);
});
