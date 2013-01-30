'use strict';

var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var common = require('./includes/common.js');

var callbacks = {
	parse: 0,
	parseXpath: 0
};

fs.readFile('data/wordpress-rss2.xml', function (err, xml) {
	assert.ifError(err);
	
	parser(xml, function (err, res) {
		callbacks.parse++;
		
		assert.ifError(err);
		assert.strictEqual(res['@'].version, '2.0');
		assert.strictEqual(res['@'].xmlns.atom, 'http://www.w3.org/2005/Atom');
		assert.strictEqual(res.channel.title, 'WordPress');
		assert.strictEqual(res.channel['atom:link']['@'].href, 'http://localhost/wordpress/?feed=rss2');
		assert.strictEqual(res.channel.item.title, 'Hello world!');
		assert.strictEqual(res.channel.item.category, 'Uncategorized'); // CDATA element
	});
	
	parser(xml, '//dc:creator', function (err, res) {
		callbacks.parseXpath++;
		
		assert.ifError(err);
		assert.strictEqual(res.length, 1);
		assert.strictEqual(res[0]['#'], 'admin');
	});
});

common.teardown(callbacks);
