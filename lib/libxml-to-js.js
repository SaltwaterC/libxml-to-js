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

exports.stringParser = function (xml, callback) {
	try {
		callback(undefined, libxml2js(libxmljs.parseXmlString(xml)));
	} catch (err) {
		callback(err, {});
	}
};

exports.saxParser = function (xml, callback) {
	var parser = new libxmljs.SaxParser(function (cb) {
		var stack = [], end = false;
		
		cb.onStartElementNS(function (elem, attrs) {
			var obj = {};
			obj['#'] = '';
			obj['#name'] = elem;
			
			if (attrs.length) {
				obj['@'] = {};
				var attrName, attrValue;
				
				for (var i = 0; i < attrs.length; i++) {
					attrName = attrs[i][0];
					attrValue = attrs[i][3];
					obj['@'][attrName] = attrValue;
				}
			}
			
			stack.push(obj);
		});
		
		cb.onEndElementNS(function () {
			var obj = stack.pop();
			var nodeName = obj['#name'];
			delete(obj['#name']);
			
			var s = stack[stack.length - 1];
			obj['#'] = obj['#'].replace(/^\s*/, '').replace(/\s*$/, '');
			if (obj['#'].match(/^\s*$/)) {
				delete(obj['#']);
			} else {
				if (Object.keys(obj).length === 1 && '#' in obj) {
					obj = obj['#'];
				}
			}
			
			if (stack.length > 0) {
				var old;
				if ( ! (nodeName in s)) {
					return s[nodeName] = obj;
				} else if (s[nodeName] instanceof Array) {
					return s[nodeName].push(obj);
				} else {
					old = s[nodeName];
					s[nodeName] = [old];
					return s[nodeName].push(obj);
				}
			} else {
				callback(undefined, obj);
				end = true;
			}
		});
		
		cb.onCharacters(function (chars) {
			var s = stack[stack.length - 1];
			if (s) {
				return s['#'] += chars;
			}
		});
		
		cb.onError(function (error) {
			if ( ! end) {
				callback(error, {});
			}
		});
	});
	
	parser.parseString(xml);
};
