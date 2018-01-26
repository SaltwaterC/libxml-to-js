'use strict';

var parser = require('..');

var assert = require('chai').assert;

var fs = require('fs');

describe('libxml-to-js parse document typically returned by EC2 API tests', function() {
  var describeImages, describeVolumes;

  before(function(done) {
    var expect = 2;

    var complete = function() {
      if (expect === 0) {
        done();
      }
    };

    fs.readFile('test/data/ec2-describeimages.xml', function(err, doc) {
      assert.ifError(err);
      describeImages = doc;
      expect--;
      complete();
    });

    fs.readFile('test/data/ec2-describevolumes.xml', function(err, doc) {
      assert.ifError(err);
      describeVolumes = doc;
      expect--;
      complete();
    });
  });

  describe('parse DescribeImages response', function() {
    it('should pass back the parsed document schema', function(done) {
      parser(describeImages, function(err, res) {
        assert.ifError(err);
        assert.strictEqual(res.imagesSet.item[0].imageId, 'ami-be3adfd7');
        assert.strictEqual(res.imagesSet.item[1].imageId, 'ami-be3adfd9');
        done();
      });
    });

    it('should pass back the parsed document schema with XPath expression', function(done) {
      parser(describeImages, '//xmlns:blockDeviceMapping', function(err, res) {
        assert.ifError(err);
        assert.strictEqual(res.length, 2);
        assert.strictEqual(res[0].item.deviceName, '/dev/sda');
        done();
      });
    });
  });

  describe('parse large DescribeVolumes response', function() {
    it('should pass back the parsed document schema', function(done) {
      parser(describeVolumes, function(err, res) {
        var i, volume;

        assert.ifError(err);

        for (i in res.volumeSet.item) {
          if (res.volumeSet.item.hasOwnProperty(i)) {
            volume = res.volumeSet.item[i];
            assert.strictEqual(volume.volumeId, 'vol-00000000');
          }
        }

        done();
      });
    });
  });
});
