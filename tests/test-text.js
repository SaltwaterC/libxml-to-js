'use strict';

var parser = require('../');

var fs = require('fs');
var assert = require('assert');

var common = require('./includes/common.js');

var callbacks = {
	parse: 0,
	parseXpath: 0
};

fs.readFile('data/text.xml', function (err, xml) {
	assert.ifError(err);
	
	parser(xml, function (err, res) {
		callbacks.parse++;
		assert.ifError(err);
		assert.deepEqual({
			'news': [{
				"auteur": "Bizzard5",
				"date": "17 Août 2008",
				"text": {}
			}, {
				"auteur": "Little",
				"date": "18 Août 2007",
				"text": {
					"test": "test"
				}
			}, {
				"auteur": "Bizzard5",
				"date": "17 Août 2008",
				"text": "C'est un teste"
			}, {
				"auteur": "Little",
				"date": "18 Août 2007",
				"text": "Allo"
			}, {
				"auteur": "Little",
				"date": "18 Août 2007",
				"text": {
					"text": "test"
				}
			}]
		},
		res);
	});
	
	parser(xml, '//nouvelle/news', function (err, res) {
		callbacks.parseXpath++;
		
		assert.ifError(err);
		assert.deepEqual({
			"auteur": "Bizzard5",
			"date": "17 Août 2008",
			"text": {}
		},
		res[0]);
	});
});

common.teardown(callbacks);
