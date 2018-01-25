'use strict';

var lodash = require('lodash');
var libxmljs = require('libxmljs');

/**
 * Wraps the lodash object merger
 *
 * @private
 * @param obj1
 * @param obj2
 * @returns obj3
 */
var merge = function(obj1, obj2) {
  var obj3 = {};
  lodash.merge(obj3, obj1, obj2);
  return obj3;
};

/**
 * The core function of this module
 *
 * @private
 * @param {Object} obj
 * @param {Boolean} recurse
 * @param {Object} namespaces
 * @returns {Object} parsedObj
 */
var libxml2js = function(obj, recurse, namespaces) {
  var i, j, k, atlen, chlen, chtlen, val, old, recValue;

  if (namespaces === undefined) {
    namespaces = {};
  }

  if (!recurse) { // dealing with the root element
    obj = obj.root();
    if (obj.namespace()) {
      namespaces.xmlns = obj.namespace().href();
    }
  }

  var jsobj = {},
    children = obj.childNodes(),
    attributes = obj.attrs();

  if (attributes.length > 0) {
    jsobj['@'] = {};

    for (i = 0, atlen = attributes.length; i < atlen; i++) {
      jsobj['@'][attributes[i].name()] = attributes[i].value();
    }
  }

  for (i = 0, chlen = children.length; i < chlen; i++) {
    // <"text" kludge>
    if (children[i].name() === 'text' && children[i].type() === 'text') {
      jsobj['#'] = children[i].text().trim();

      if (jsobj['#'].match(/^\s*$/)) {
        delete(jsobj['#']);
      }

      for (j = 0, chtlen = children[i].childNodes().length; j < chtlen; j++) {
        if (children[i].child(j).name() === 'text') {
          var text = {},
            textattrs = children[i].child(j).attrs();

          text['#'] = children[i].child(j).text().trim();

          if (textattrs.length > 0) {
            text['@'] = {};
          }

          for (k = 0, atlen = textattrs.length; k < atlen; i++) {
            text['@'][textattrs[k].name()] = textattrs[k].value();
          }

          jsobj.text = text;
          break; // only allow one "<text></text>" element for now
        }
      }
    } else if (children[i].type() === 'cdata') {
      val = children[i].text().trim();
      val = val.replace(/^<\!\[CDATA\[/, '').replace(/\]\]\>$/, '');
      jsobj['#'] = val;
    } else {
      // </"text" kludge>
      var ns = '';
      var namespace = children[i].namespace();

      if (namespace && namespace.prefix() !== null) {
        ns = namespace.prefix() + ':';
        namespaces[namespace.prefix()] = namespace.href();
      }
      var key = ns + children[i].name();

      if (typeof jsobj[key] === 'undefined') {
        var childType = null;
        var chLen = children[i].childNodes().length;
        var chAttrLen = children[i].attrs().length;
        if (chLen === 1) {
          childType = children[i].childNodes()[0].type();
        }

        if (chLen === 1 && chAttrLen === 0 && (childType === 'text' || childType === 'cdata')) {
          val = children[i].childNodes()[0].text().trim();

          if (childType === 'cdata') {
            val = val.replace(/^<\!\[CDATA\[/, '').replace(/\]\]\>$/, '');
          }

          jsobj[key] = val;
        } else {
          if (children[i].name() !== undefined) {
            recValue = libxml2js(children[i], true, namespaces);
            jsobj[key] = recValue.jsobj;
            merge(namespaces, recValue.namespaces);
          }
        }
      } else {
        if (typeof jsobj[key] === 'string') {
          old = jsobj[key];
          jsobj[key] = [];
          jsobj[key].push({
            '#': old
          });
        } else if (typeof jsobj[key] === 'object' && jsobj[key] instanceof Array === false) {
          old = jsobj[key];
          jsobj[key] = [];
          jsobj[key].push(old);
        }

        recValue = libxml2js(children[i], true, namespaces);
        jsobj[key].push(recValue.jsobj);
        merge(namespaces, recValue.namespaces);
      }
    }
  }

  if (!recurse) {
    if (namespaces && !lodash.isEmpty(namespaces)) {
      if (!jsobj['@']) {
        jsobj['@'] = {};
      }

      jsobj['@'].xmlns = namespaces;
    }

    return jsobj;
  }

  return {
    jsobj: jsobj,
    namespaces: namespaces
  };
};

/**
 * The module wrapper, with XPath support
 *
 * @param {String} xml
 * @param {String} xpath
 * @param {Function} callback
 */
module.exports = function(xml, xpath, callback) {
  if (!callback) {
    callback = xpath;
    xpath = null;
  }

  var xmlDocument, jsDocument, selected = [],
    xmlns = null,
    error, result;

  try {
    xmlDocument = libxmljs.parseXmlString(xml);
    jsDocument = libxml2js(xmlDocument);

    if (jsDocument['@'] && jsDocument['@'].xmlns) {
      xmlns = jsDocument['@'].xmlns;
    }

    if (!!xpath) {
      xmlDocument.find(xpath, xmlns).forEach(function(item) {
        selected.push(libxml2js(item, true).jsobj);
      });
      result = selected;
    } else {
      result = jsDocument;
    }
  } catch (err) {
    var message = 'libxml error';

    if (err && err.message) {
      message = err.message;
    }

    error = new Error(message);
    if (err && err.code) {
      error.code = err.code;
    }
  }

  if (!error) {
    callback(null, result);
  } else {
    callback(error);
  }
};
