## About

This is a XML to JavaScript object parser. It uses the [libxmljs](https://github.com/polotek/libxmljs) module for the actual XML parsing. It aims to be an easy [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) replacement. I used xml2js for my own needs, but the error reporting of the underlying SAX parser is quite broken.

It has a couple of implemented parsing modes. This is a side effect of the fact that at first I implemented the SAX parser, thereafter the string parser of libxmljs. The first has better error reporting while the last works asynchronously.

## Installation

Either manually clone this repository into your node_modules directory, or the recommended method:

> npm install libxml-to-js

## Usage mode

### The string parser

<pre>
var parser = require('libxml-to-js').stringParser;
var xml = 'xml string';

parser(xml, function (error, result) {
	if (error) {
		console.error(error);
	} else {
		console.log(result);
	}
});
</pre>

### The SAX parser

<pre>
var parser = require('libxml-to-js').saxParser;
var xml = 'xml string';

parser(xml, function (error, result) {
	if (error) {
		console.error(error);
	} else {
		console.log(result);
	}
});
</pre>

## Notes

The SAX parser usage is identical to the string parser usage. The only actual differece might be an error at the end of the XML string while the rest of the string being valid XML. In this case, the string parser returns the error argument while the SAX parser doesn't return the error, but succesfully return the XML contents. However, the string parser might be buggier if I messed up the recursion. Currently I didn't find anything that breaks it, but your mileage may vary.
