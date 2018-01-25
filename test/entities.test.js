'use strict';

var parser = require('..');

var assert = require('chai').assert;

describe('libxml-to-js entities test', function() {
  describe('entities in element text', function() {
    it('is expected to return parsed entity characters in output', function(done) {
      var doc = '<root><example>TEST &lt; &gt; &amp; &apos; &quot; &#65; &#x41; &#60; TEST</example></root>';

      parser(doc, function(err, res) {
        assert.ifError(err);
        assert.strictEqual(res.example, 'TEST < > & \' " A A < TEST');
        done();
      });
    });
  });

  describe('entities in element text with element attribute', function() {
    it('is expected to return parsed entity characters in output', function(done) {
      var doc = '<root><example attr="000">TEST &lt; &gt; &amp; &apos; &quot; &#65; &#x41; &#60; TEST</example></root>';

      parser(doc, function(err, res) {
        assert.ifError(err);
        assert.strictEqual(res.example['#'], 'TEST < > & \' " A A < TEST');
        done();
      });
    });
  });
});
