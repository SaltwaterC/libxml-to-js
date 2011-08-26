var parser = require('../');

var fs = require('fs');
var assert = require('assert');

parser(fs.readFileSync('data/ec2-describeimages.xml').toString(), function (err, res) {
	assert.ifError(err);
	assert.equal(res.imagesSet.item[0].imageId, 'ami-be3adfd7');
	assert.equal(res.imagesSet.item[1].imageId, 'ami-be3adfd9');
});

parser(fs.readFileSync('data/ec2-describeimages.xml').toString(), '//xmlns:blockDeviceMapping', function (err, res) {
  assert.ifError(err);
  assert.strictEqual(res.length, 2);
  assert.strictEqual(res[0].item.deviceName, '/dev/sda');
});
