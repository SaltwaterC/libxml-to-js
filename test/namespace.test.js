'use strict';

var parser = require('..');

var assert = require('chai').assert;

var fs = require('fs');

describe('libxml-to-js namespace test', function() {
  describe('parse document with namespaces', function() {
    it('should return a list of namespaces attached as root attribute', function(done) {
      fs.readFile('test/data/namespace.xml', function(err, xml) {
        assert.ifError(err);
        parser(xml, function(err, res) {
          var i, atom;

          assert.ifError(err);
          assert.strictEqual(res['@'].xmlns.atom, 'http://www.w3.org/2005/Atom');

          for (i in res['atom:link']) {
            if (res['atom:link'].hasOwnProperty(i)) {
              atom = res['atom:link'][i];
              assert.strictEqual(atom['@'].rel, 'self');
              assert.strictEqual(atom['@'].type, 'application/rss+xml');
            }
          }

          assert.strictEqual(res['atom:link'][0]['@'].href, 'http://localhost/wordpress/?feed=rss');
          assert.strictEqual(res['atom:link'][1]['@'].href, 'http://localhost/wordpress/?feed=rss2');

          done();
        });
      });
    });
  });
});
