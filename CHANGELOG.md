## v0.3.11
 * Adds more CDATA support [#13](https://github.com/SaltwaterC/libxml-to-js/issues/13). Thanking XApp-Studio for the patch.
 * jslint compliant.

## v0.3.10
 * Fixes a couple of global variable leaks [#10](https://github.com/SaltwaterC/libxml-to-js/pull/10).

## v0.3.9
 * Takes a more safe approach to the err argument of the catch block in the exported method. It proves that in production the err argument may be undefined which breaks things.

## v0.3.8
 * Fixes [#8](https://github.com/SaltwaterC/libxml-to-js/issues/8) regarding the error handling inside the passed callback to the parser. Thanking [kongelaks](https://github.com/kongelaks) for reporting it.

## v0.3.7
 * Fixes [#6](https://github.com/SaltwaterC/libxml-to-js/issues/6) simple test case losing attribute name. Thanks to [Richard Anaya](https://github.com/richardanaya) for the contribution.

## v0.3.6
 * Fixes [#5](https://github.com/SaltwaterC/libxml-to-js/pull/5) which was introduced in v0.3.5.

## v0.3.5
 * Improved the text kludge and namespaces support. Thanks to @[VirgileD](https://github.com/VirgileD) for the contribution.

## v0.3.4
 * XPath queries support for parsing just parts of the XML document. Thanks to @[Marsup](https://github.com/Marsup) for the contribution.

## v0.3.3
 * Refactored the namespace support in order to make it more stable. The parser used to crash for large XML documents in an undeterministic manner (missing method errors or segmentation faults, for the same input).

## v0.3.2
 * Does not return the namespace at all if the prefix is null.

## v0.3.1
 * The returned error argument is now an instance of Error().
 * In case of error, the result argument is not returned.
 * Ignores the namespace prefix if the namespace prefix is null.

## v0.3
 * The error argument is null in case of successful execution in order to follow the node.js convention. This may break some code if the evaluation is made against 'undefined'.
 * Won't recurse if the children name is 'undefined'.
 * XML namespace support into the key names. This may break some existing code.
 * CDATA support for the values.
 * Support for returning the used namespaces into the XML document.

## v0.2.2
 * Cleaned up the garbage from the npm published package.

## v0.2.1
 * Updated the package.json file with more data.

## v0.2
 * Dropped the SAX parser in favor of maintaining the string parser. Basically it cuts the code base in half. xml2js might implement libxmljs as well, therefore nothing is really lost.

## v0.1
 * Initial release, featuring SAX and string parsers.
