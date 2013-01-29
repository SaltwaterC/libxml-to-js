var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var xml = fs.readFileSync('data/root-cdata.xml').toString();

var callback = false;

parser(xml, function (err, res) {
	callback = true;
	assert.ifError(err);
	
	assert.strictEqual(res['#'], 'Home');
	assert.strictEqual(res['@'].section, 'default');
	assert.strictEqual(res['@'].code, 'widgethome');
});

process.on('exit', function () {
	assert.ok(callback);
});
