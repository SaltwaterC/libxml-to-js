var libxmljs = require('libxmljs');

var libxml2js = function (obj, recurse) {
	if ( ! recurse) {
		obj = obj.root();
	}
	
	var jsobj = {}, children = obj.childNodes(), attributes = obj.attrs();
			
	if (attributes.length > 0) {
		jsobj['@'] = {};
		for (var i = 0, atlen = attributes.length; i < atlen; i++) {
			jsobj['@'][attributes[i].name()] = attributes[i].value();
		}
	}
	
	for (var i = 0, chlen = children.length; i < chlen; i++) {
		// <"text" kludge>
		if (children[i].name() == 'text') {
			jsobj['#'] = children[i].text().replace(/^\s*/, '').replace(/\s*$/, '');
			if (jsobj['#'].match(/^\s*$/)) {
				delete(jsobj['#']);
			}
			for (var j = 0, chtlen = children[i].childNodes().length; j < chtlen; j++) {
				if (children[i].child(j).name() == 'text') {
					var text = {}, textattrs = children[i].child(j).attrs();
					text['#'] = children[i].child(j).text();
					if (textattrs.length > 0) {
						text['@'] = {};
					}
					
					for (var k = 0, atlen = textattrs.length; k < atlen; i++) {
						text['@'][textattrs[k].name()] = textattrs[k].value();
					}
					jsobj['text'] = text;
					break; // only allow one "<text></text>" element for now
				}
			}
			continue;
		}
		
		// </"text" kludge>
		if (typeof jsobj[children[i].name()] == 'undefined') {
			if (children[i].childNodes().length == 1 && children[i].childNodes()[0].name() == 'text') {
				jsobj[children[i].name()] = children[i].childNodes()[0].text();
			} else {
				jsobj[children[i].name()] = libxml2js(children[i], true);
			}
		} else {
			
			if (typeof jsobj[children[i].name()] == 'string') {
				var old = jsobj[children[i].name()];
				jsobj[children[i].name()] = [];
				jsobj[children[i].name()].push({'#': old});
			} else if (typeof jsobj[children[i].name()] == 'object' && ! ('push' in jsobj[children[i].name()])) {
				var old = jsobj[children[i].name()];
				jsobj[children[i].name()] = [];
				jsobj[children[i].name()].push(old);
			}
			jsobj[children[i].name()].push(libxml2js(children[i], true));
		}
	}
	
	return jsobj;
};

module.exports = function (xml, callback) {
	try {
		callback(undefined, libxml2js(libxmljs.parseXmlString(xml)));
	} catch (err) {
		callback(err, {});
	}
};

