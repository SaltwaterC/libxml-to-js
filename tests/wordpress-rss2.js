var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var callback = false;
var callbackXPath = false;

var xml = fs.readFileSync('data/wordpress-rss2.xml').toString();

parser(xml, function (err, res) {
	callback = true;
	assert.ifError(err);
	assert.equal(res['@'].version, '2.0');
	assert.equal(res['@'].xmlns.atom, 'http://www.w3.org/2005/Atom');
	assert.equal(res.channel.title, 'WordPress');
	assert.equal(res.channel['atom:link']['@'].href, 'http://localhost/wordpress/?feed=rss2');
	assert.equal(res.channel.item.title, 'Hello world!');
	assert.equal(res.channel.item.category, 'Uncategorized'); // CDATA element
});

parser(xml, '//dc:creator', function (err, res) {
	callbackXPath = true;
	assert.ifError(err);
	assert.strictEqual(res.length, 1);
	assert.strictEqual(res[0]['#'], 'admin');
});

process.on('exit', function () {
	assert.ok(callback);
	assert.ok(callbackXPath);
});
