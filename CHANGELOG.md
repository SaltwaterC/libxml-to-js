## v0.3.1
 * The returned error argument is now an instance of Error().
 * In case of error, the result argument is not returned.

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
