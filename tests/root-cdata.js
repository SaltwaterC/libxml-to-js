'use strict';

var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var common = require('./includes/common.js');

var callbacks = {
	parse: 0
};

fs.readFile('data/root-cdata.xml', function (err, xml) {
	assert.ifError(err);
	parser(xml, function (err, res) {
		callbacks.parse++;
		
		assert.ifError(err);
		assert.strictEqual(res['#'], 'Home');
		assert.strictEqual(res['@'].section, 'default');
		assert.strictEqual(res['@'].code, 'widgethome');
	});
});

common.teardown(callbacks);
