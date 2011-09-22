var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var callback = false;
var callbackXPath = false;

var xml = fs.readFileSync('data/ec2-describeimages.xml').toString();

parser(xml, function (err, res) {
	callback = true;
	assert.ifError(err);
	assert.equal(res.imagesSet.item[0].imageId, 'ami-be3adfd7');
	assert.equal(res.imagesSet.item[1].imageId, 'ami-be3adfd9');
});

parser(xml, '//xmlns:blockDeviceMapping', function (err, res) {
	callbackXPath = true;
	assert.ifError(err);
	assert.strictEqual(res.length, 2);
	assert.strictEqual(res[0].item.deviceName, '/dev/sda');
});

process.on('exit', function () {
	assert.ok(callback);
	assert.ok(callbackXPath);
});
