var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var callback = false;

parser(fs.readFileSync('data/namespace.xml').toString(), function (err, res) {
	callback = true;
	assert.ifError(err);
	assert.equal(res['@'].xmlns.atom, 'http://www.w3.org/2005/Atom');
	for (var i in res['atom:link']) {
		var atom = res['atom:link'][i];
		assert.equal(atom['@'].rel, 'self');
		assert.equal(atom['@'].type, 'application/rss+xml');
	}
	assert.equal(res['atom:link'][0]['@'].href, 'http://localhost/wordpress/?feed=rss');
	assert.equal(res['atom:link'][1]['@'].href, 'http://localhost/wordpress/?feed=rss2');
});

process.on('exit', function () {
	assert.ok(callback);
});
