## About [![build status](https://secure.travis-ci.org/SaltwaterC/libxml-to-js.png?branch=master)](http://travis-ci.org/SaltwaterC/libxml-to-js) ![still maintained](http://stillmaintained.com/SaltwaterC/libxml-to-js.png)

This is a XML to JavaScript object parser. It uses the [libxmljs](https://github.com/polotek/libxmljs) module for the actual XML parsing. It aims to be an easy [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) v1 replacement, but it doesn't follow the xml2js API.

libxml-to-js uses the string parser method of libxmljs. Basically a modified version of the algorithm from [here](http://mscdex.net/code-snippets/) in order to fit the formal specifications of xml2js output.

## Installation

Either manually clone this repository into your node_modules directory, or the recommended method:

> npm install libxml-to-js

The installation of the underlying dependency, **libxmljs**, fails if you don't have gcc (or compatible compiler), the [libxml2](http://en.wikipedia.org/wiki/Libxml2) development headers, and the xml2-config script. Under various Linux distributions you may install the appropriate libxml2 development package: libxml2-dev (Debian, Ubuntu, etc), libxml2-devel (RHEL, CentOS, Fedora, etc).

## Usage mode

```javascript
var parser = require('libxml-to-js');
var xml = 'xml string';

parser(xml, function (error, result) {
	if (error) {
		console.error(error);
	} else {
		console.log(result);
	}
});
```

With XPath query:

```javascript
parser(xml, '//xpath/query', function (error, result) {
	if (error) {
		console.error(error);
	} else {
		console.log(result);
	}
});
```

## Gotcha

Due to the fact that libxmljs does not have any method for returning the namespace attributes of a specific element, the returned namespaces aren't returned as expected:

 * the returned namespaces are only the actual used namespaces by the XML document. If there are unused namespaces, they aren't returned. This is a consequence of the fact that the namespaces are pushed into the returned object as they are detected by the parsing recursion.
 * the returned namespaces are attached as attributes to the root element, into the xmlns key in order to keep the code simple.

Example from the WordPress RSS 2 feed:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:atom="http://www.w3.org/2005/Atom"
	xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
	xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
	>
<!-- the rest of the doc -->
</rss>
```

is parsed as:

```javascript
{ '@': 
   { version: '2.0',
     xmlns: 
      { atom: 'http://www.w3.org/2005/Atom',
        sy: 'http://purl.org/rss/1.0/modules/syndication/',
        dc: 'http://purl.org/dc/elements/1.1/',
        content: 'http://purl.org/rss/1.0/modules/content/',
        wfw: 'http://wellformedweb.org/CommentAPI/',
        slash: 'http://purl.org/rss/1.0/modules/slash/' } },
// the rest of the doc
}
```

## Contributors

 * @[Brian White](https://github.com/mscdex): The original algorithm for converting a parsed XML doc into JavaScript object.
 * @[Marsup](https://github.com/Marsup): XPath queries support.
 * @[VirgileD](https://github.com/VirgileD): improved text kludge and namespaces support
 * @[Richard Anaya](https://github.com/richardanaya): fix for [#6](https://github.com/SaltwaterC/libxml-to-js/issues/6)
 * @[TokyoIncidents](https://github.com/TokyoIncidents): fixes a couple of global variables leaks [#10](https://github.com/SaltwaterC/libxml-to-js/pull/10)
 * @[XApp-Studio](https://github.com/XApp-Studio): more support for CDATA elements [#13](https://github.com/SaltwaterC/libxml-to-js/issues/13)
