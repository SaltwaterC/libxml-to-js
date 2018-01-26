'use strict';

var parser = require('..');

var assert = require('chai').assert;

var fs = require('fs');

describe('libxml-to-js CDATA parsing tests', function() {
  describe('parse element CDATA', function() {
    it('should return the parsed CDATA values', function(done) {
      fs.readFile('test/data/element-cdata.xml', function(err, element) {
        assert.ifError(err);
        parser(element, function(err, res) {
          assert.ifError(err);
          assert.strictEqual(res.phrase['#'], 'Home');
          assert.strictEqual(res.phrase['@'].section, 'default');
          assert.strictEqual(res.phrase['@'].code, 'widgethome');
          done();
        });
      });
    });
  });

  describe('parse root CDATA', function() {
    it('should return the parsed CDATA values', function(done) {
      fs.readFile('test/data/root-cdata.xml', function(err, root) {
        parser(root, function(err, res) {
          assert.ifError(err);
          assert.strictEqual(res['#'], 'Home');
          assert.strictEqual(res['@'].section, 'default');
          assert.strictEqual(res['@'].code, 'widgethome');
          done();
        });
      });
    });
  });
});
