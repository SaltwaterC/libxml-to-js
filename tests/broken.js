'use strict';

var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var common = require('./includes/common.js');

var callbacks = {
	parse: 0
};

parser('This is a broken XML file.', function (err, res) {
	callbacks.parse++;
	
	assert.ok(err instanceof Error);
	assert.strictEqual(err.code, 4);
});

common.teardown(callbacks);
