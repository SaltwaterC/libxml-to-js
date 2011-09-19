var parser = require('../'), util = require('util');

var fs = require('fs');
var assert = require('assert');

parser(fs.readFileSync('data/text.xml').toString(), function (err, res) {
	assert.ifError(err);
	console.log(util.inspect(res, true, null));
	assert.deepEqual({ 'news':[{ "auteur" : "Bizzard5", "date" : "17 Août 2008", "text" : { }},{ "auteur" : "Little", "date" : "18 Août 2007", "text" : { "test" : "test" }},{ "auteur" : "Bizzard5", "date" : "17 Août 2008", "text" : "C'est un teste"},{ "auteur" : "Little", "date" : "18 Août 2007", "text" : "Allo" },{ "auteur" : "Little", "date" : "18 Août 2007", "text" : { "text" : "test" } }]},
          res);
});

