'use strict';

var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var common = require('./includes/common.js');

var callbacks = {
	parse: 0
};

fs.readFile('data/namespace.xml', function (err, xml) {
	parser(xml, function (err, res) {
		var i;
		callbacks.parse++;
		
		assert.ifError(err);
		assert.strictEqual(res['@'].xmlns.atom, 'http://www.w3.org/2005/Atom');
		
		for (i in res['atom:link']) {
			if (res['atom:link'].hasOwnProperty(i)) {
				var atom = res['atom:link'][i];
				assert.strictEqual(atom['@'].rel, 'self');
				assert.strictEqual(atom['@'].type, 'application/rss+xml');
			}		
		}
		
		assert.strictEqual(res['atom:link'][0]['@'].href, 'http://localhost/wordpress/?feed=rss');
		assert.strictEqual(res['atom:link'][1]['@'].href, 'http://localhost/wordpress/?feed=rss2');
	});
});

common.teardown(callbacks);
