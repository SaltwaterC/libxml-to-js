'use strict';

var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var common = require('./includes/common.js');

var callbacks = {
	parse: 0
};

fs.readFile('data/ec2-describevolumes-large.xml', function (err, xml) {
	assert.ifError(err);
	
	parser(xml, function (err, res) {
		var i;
		callbacks.parse++;
		
		assert.ifError(err);
		for (i in res.volumeSet.item) {
			if (res.volumeSet.item.hasOwnProperty(i)) {
				var volume = res.volumeSet.item[i];
				assert.strictEqual(volume.volumeId, 'vol-00000000');
			}
		}
	});
});

common.teardown(callbacks);
