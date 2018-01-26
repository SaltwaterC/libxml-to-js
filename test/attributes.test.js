'use strict';

var parser = require('..');

var assert = require('chai').assert;

describe('libxml-to-js attributes tests', function() {
  var doc = '<thing><real id="width">300</real><real id="height">200</real></thing>';

  describe('parse document with atrributes', function() {
    it('should match the document schema', function(done) {
      parser(doc, function(err, res) {
        assert.ifError(err);

        assert.deepEqual({
            'real': [{
              '@': {
                'id': 'width'
              },
              '#': '300'
            }, {
              '@': {
                'id': 'height'
              },
              '#': '200'
            }]
          },
          res);

        done();
      });
    });

    it('should match the document schema with XPath expression', function(done) {
      parser(doc, '//thing/real', function(err, res) {
        assert.ifError(err);

        assert.deepEqual([{
            '@': {
              'id': 'width'
            },
            '#': '300'
          }, {
            '@': {
              'id': 'height'
            },
            '#': '200'
          }],
          res);

        done();
      });
    });
  });
});
