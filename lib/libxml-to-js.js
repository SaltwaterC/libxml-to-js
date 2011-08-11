var libxmljs = require('libxmljs');

/**
 * Simple object merger
 * 
 * @param obj1
 * @param obj2
 * @returns obj3
 */
var merge = function (obj1, obj2) {
	var obj3 = {};
	
	for (attrname in obj1) {
		obj3[attrname] = obj1[attrname];
	}
	
	for (attrname in obj2) {
		obj3[attrname] = obj2[attrname];
	}
	
	return obj3;
};

/**
 * The core function of this module
 * @param obj
 * @param recurse
 * @param namespaces
 * @returns parsedObj
 */
var libxml2js = function (obj, recurse, namespaces) {
	if ( ! recurse) {
		obj = obj.root();
	}
	
	if (namespaces == undefined) {
		namespaces = {};
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
			jsobj['#'] = children[i].text().trim();
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
		var ns = '';
		if (children[i].namespace()) {
			if (children[i].namespace().prefix() != null) {
				ns = children[i].namespace().prefix() + ':';
			}
			namespaces[children[i].namespace().prefix()] = children[i].namespace().href();
		}
		var key = ns + children[i].name();
		
		if (typeof jsobj[key] == 'undefined') {
			if (children[i].childNodes().length == 1 && (children[i].childNodes()[0].type() == 'text' || children[i].childNodes()[0].type() == 'cdata')) {
				var val = children[i].childNodes()[0].toString().trim();
				if (children[i].childNodes()[0].type() == 'cdata') {
					val = val.replace(/^\<\!\[CDATA\[/, '').replace(/\]\]\>$/, '');
				}
				jsobj[key] = val;
			} else {
				if (children[i].name() !== undefined) {
					var recValue = libxml2js(children[i], true, namespaces);
					jsobj[key] = recValue.jsobj;
					merge(namespaces, recValue.namespaces);
				}
			}
		} else {
			if (typeof jsobj[key] == 'string') {
				var old = jsobj[key];
				jsobj[key] = [];
				jsobj[key].push({'#': old});
			} else if (typeof jsobj[key] == 'object' && ! ('push' in jsobj[key])) {
				var old = jsobj[key];
				jsobj[key] = [];
				jsobj[key].push(old);
			}
			var recValue = libxml2js(children[i], true, namespaces);
			jsobj[key].push(recValue.jsobj);
			merge(namespaces, recValue.namespaces);
		}
	}
	
	if ( ! recurse) {
		if (namespaces) {
			if ( ! jsobj['@']) {
				jsobj['@'] = {};
			}
			jsobj['@'].xmlns = namespaces;
		}
		return jsobj;
	} else {
		return {
			jsobj: jsobj,
			namespaces: namespaces
		}
	}
};

module.exports = function (xml, callback) {
	try {
		callback(null, libxml2js(libxmljs.parseXmlString(xml)));
	} catch (err) {
		var errInst = new Error(err.message);
		errInst.code = err.code || 0;
		callback(errInst);
	}
};
