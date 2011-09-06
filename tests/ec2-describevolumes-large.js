var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var callback = false;

parser(fs.readFileSync('data/ec2-describevolumes-large.xml').toString(), function (err, res) {
	callback = true;
	assert.ifError(err);
	for (var i in res.volumeSet.item) {
		var volume = res.volumeSet.item[i];
		assert.equal(volume.volumeId, 'vol-00000000');
	}
});

process.on('exit', function () {
	assert.ok(callback);
});
