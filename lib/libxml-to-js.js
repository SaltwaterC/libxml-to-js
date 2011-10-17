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
 * Checks if an object is empty
 * @param obj
 * @returns bool
 */
var isEmpty = function (obj) {
	for (var prop in obj) {
		if(obj.hasOwnProperty(prop)) {
			return false;
		}
	}
	return true;
}

/**
 * The core function of this module
 * @param obj
 * @param recurse
 * @param namespaces
 * @returns parsedObj
 */
var libxml2js = function (obj, recurse, namespaces) {
	if (namespaces == undefined) {
		namespaces = {};
	}

	if ( ! recurse) {
		obj = obj.root();
		if (obj.namespace()) {
			namespaces['xmlns'] = obj.namespace().href();
		}
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
		if (children[i].name() == 'text' && children[i].type() == 'text') {
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
		var namespace = children[i].namespace();
		if (namespace && namespace.prefix() != null) {
			ns = namespace.prefix() + ':';
			namespaces[namespace.prefix()] = namespace.href();
		}
		var key = ns + children[i].name();
		
		if (typeof jsobj[key] == 'undefined') {
			if (children[i].childNodes().length == 1 && children[i].attrs().length == 0 && (children[i].childNodes()[0].type() == 'text' || children[i].childNodes()[0].type() == 'cdata')) {
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
		if (namespaces && ! isEmpty(namespaces)) {
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

module.exports = function (xml, xpath, callback) {
	if ( ! callback) {
		callback = xpath;
		xpath = null;
	}
	var xmlDocument, jsDocument, selected = [], xmlns = null, error, result;
	try {
		xmlDocument = libxmljs.parseXmlString(xml);
		jsDocument = libxml2js(xmlDocument);
		if (jsDocument['@'] && jsDocument['@'].xmlns) {
			xmlns = jsDocument['@'].xmlns;
		}
		if ( !! xpath) {
			xmlDocument.find(xpath, xmlns).forEach(function(item) {
				selected.push(libxml2js(item, true).jsobj);
			});
			result = selected;
		} else {
			result = jsDocument;
		}
	} catch (err) {
		err.message = err.message || 'libxml error';
		error = new Error(err.message);
		error.code = err.code || 0;
	}
	if ( ! error) {
		callback(null, result);
	} else {
		callback(error);
	}
};
