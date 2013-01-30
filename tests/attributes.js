'use strict';

var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var common = require('./includes/common.js');

var callbacks = {
	parse: 0,
	parseXpath: 0
};

var xml = '<thing><real id="width">300</real><real id="height">200</real></thing>';

parser(xml, function (err, res) {
	callbacks.parse++;
	
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
	callbacks.parseXpath++;
	
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

common.teardown(callbacks);
