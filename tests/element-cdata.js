'use strict';

var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var common = require('./includes/common.js');

var callbacks = {
	parse: 0
};

fs.readFile('data/element-cdata.xml', function (err, xml) {
	parser(xml, function (err, res) {
		callbacks.parse++;
		
		assert.ifError(err);
		assert.strictEqual(res.phrase['#'], 'Home');
		assert.strictEqual(res.phrase['@'].section, 'default');
		assert.strictEqual(res.phrase['@'].code, 'widgethome');
	});
});

common.teardown(callbacks);
