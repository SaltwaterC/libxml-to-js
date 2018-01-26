'use strict';

var parser = require('..');

var assert = require('chai').assert;

var fs = require('fs');

describe('libxml-to-js text encoding tests', function() {
  var xml;

  before(function(done) {
    fs.readFile('test/data/text.xml', function(err, doc) {
      assert.ifError(err);
      xml = doc;
      done();
    });
  });

  describe('parse elements text with non-ASCII charachers', function() {
    it('should parse the document', function(done) {
      parser(xml, function(err, res) {
        assert.ifError(err);
        assert.deepEqual({
            'news': [{
              'auteur': 'Bizzard5',
              'date': '17 Août 2008',
              'text': {}
            }, {
              'auteur': 'Little',
              'date': '18 Août 2007',
              'text': {
                'test': 'test'
              }
            }, {
              'auteur': 'Bizzard5',
              'date': '17 Août 2008',
              'text': 'C\'est un teste'
            }, {
              'auteur': 'Little',
              'date': '18 Août 2007',
              'text': 'Allo'
            }, {
              'auteur': 'Little',
              'date': '18 Août 2007',
              'text': {
                'text': 'test'
              }
            }]
          },
          res);
        done();
      });
    });

    it('should parse the document with XPath expression', function(done) {
      parser(xml, '//nouvelle/news', function(err, res) {
        assert.ifError(err);
        assert.deepEqual({
            'auteur': 'Bizzard5',
            'date': '17 Août 2008',
            'text': {}
          },
          res[0]);
        done();
      });
    });
  });
});
