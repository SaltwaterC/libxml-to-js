## About

This is a XML to JavaScript object parser. It uses the [libxmljs](https://github.com/polotek/libxmljs) module for the actual XML parsing. It aims to be an easy [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) replacement, but it doesn't follow the xml2js API. I used xml2js for my own needs, but the error reporting of the underlying SAX parser is quite broken. This is how libxml-to-js saw the day light.

libxml-to-js uses the string parser method of libxmljs. Basically a modified version of the algorithm from [here](http://mscdex.net/code-snippets/) in order to fit the formal specifications of xml2js output.

## Installation

Either manually clone this repository into your node_modules directory, or the recommended method:

> npm install libxml-to-js

## Usage mode

<pre>
var parser = require('libxml-to-js');
var xml = 'xml string';

parser(xml, function (error, result) {
	if (error) {
		console.error(error);
	} else {
		console.log(result);
	}
});
</pre>

## Known issues

 * The namespace attribute isn't translated to the JavaScript object as the libxmljs treats it different from the [sax-js](https://github.com/isaacs/sax-js) parser. The sax-js simply places it as a simple attribute.
 * The behavior for nodes that use namespaces is untested vs. the output of xml2js.
