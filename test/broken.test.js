'use strict';

var parser = require('..');

var assert = require('chai').assert;

describe('libxml-to-js broken XML test', function() {
  describe('parse broken XML', function() {
    it('should pass back an error argument to the completion callback', function(done) {
      parser('This is a broken XML file.', function(err, res) {
        assert.instanceOf(err, Error);
        assert.strictEqual(err.code, 4);
        assert.isUndefined(res);
        done();
      });
    });
  });
});
