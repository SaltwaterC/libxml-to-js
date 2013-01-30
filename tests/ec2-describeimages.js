'use strict';

var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var common = require('./includes/common.js');

var callbacks = {
	parse: 0,
	parseXpath: 0
};

fs.readFile('data/ec2-describeimages.xml', function (err, xml) {
	assert.ifError(err);
	
	parser(xml, function (err, res) {
		callbacks.parse++;
		
		assert.ifError(err);
		assert.strictEqual(res.imagesSet.item[0].imageId, 'ami-be3adfd7');
		assert.strictEqual(res.imagesSet.item[1].imageId, 'ami-be3adfd9');
	});
	
	parser(xml, '//xmlns:blockDeviceMapping', function (err, res) {
		callbacks.parseXpath++;
		
		assert.ifError(err);
		assert.strictEqual(res.length, 2);
		assert.strictEqual(res[0].item.deviceName, '/dev/sda');
	});
});

common.teardown(callbacks);
