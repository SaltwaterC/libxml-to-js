'use strict';

var parser = require('..');

var assert = require('chai').assert;

var fs = require('fs');

describe('libxml-to-js WordPress RSS parsing tests', function() {
  var xml;

  before(function(done) {
    fs.readFile('test/data/wordpress.xml', function(err, doc) {
      assert.ifError(err);
      xml = doc;
      done();
    });
  });

  describe('parse WordPress feed', function() {
    it('should pass back the parsed document', function(done) {
      parser(xml, function(err, res) {
        assert.ifError(err);
        assert.strictEqual(res['@'].version, '2.0');
        assert.strictEqual(res['@'].xmlns.atom, 'http://www.w3.org/2005/Atom');
        assert.strictEqual(res.channel.title, 'WordPress');
        assert.strictEqual(res.channel['atom:link']['@'].href, 'http://localhost/wordpress/?feed=rss2');
        assert.strictEqual(res.channel.item.title, 'Hello world!');
        assert.strictEqual(res.channel.item.category, 'Uncategorized'); // CDATA element
        done();
      });
    });

    it('should pass back the parsed document with XPath expression', function(done) {
      parser(xml, '//dc:creator', function(err, res) {
        assert.ifError(err);
        assert.strictEqual(res.length, 1);
        assert.strictEqual(res[0]['#'], 'admin');
        done();
      });
    });
  });
});
