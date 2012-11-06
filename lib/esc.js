// set up the hex digits and a hexMap[0..255] = ( '00', '01', ...,  'FF' )

/*jshint bitwise:false*/

var hexDigits = '0123456789ABCDEF';
var hexMap = [];
for ( var i = 0; i < 256; i++ ) {
    hexMap[i] = hexDigits.charAt(i >> 4) + hexDigits.charAt(i & 15);
}
var doNotEsc = /[A-Za-z0-9_.~\-%]/;

// Our own version of URI escape/encode, from http://oauth.net/core/1.0a/#encoding_parameters

// # NOTE #
//
// From: http://docs.amazonwebservices.com/general/latest/gr/sigv4-create-canonical-request.html
//
// * Do not URL-encode any of the unreserved characters that RFC 3986 defines: A-Z, a-z, 0-9,
//   hyphen ( - ), underscore ( _ ), period ( . ), and tilde ( ~ ).
// * Percent-encode all other characters with %XY, where X and Y are hexadecimal characters (0-9 and uppercase A-F).
// * Percent-encode extended UTF-8 characters in the form %XY%ZA....
// * Percent-encode the space character as %20 (and not '+', as some encoding schemes do).
//
// So what we do is a two pronged approach. Firstly, we use encodeURIComponent(str). This converts most characters into
// their %xx equivalents. This IMPORTANTLY includes any unicode characters. It also means that the string returned now
// only contains ASCII characters.
//
// However, at this point characters like '!' are not yet encoded and from the list above from Amazon, we see that they
// do need to be encoded. So we then loop though the rest of the chars looking for these and encode them manually.
//
// Finaly note -> when doing this, we also skip over '%' since that shouldn't be double encoded.

function esc(str) {
    // firstly, use encodeURIComponent(str) to convert all the unicode and most other characters
    str = encodeURIComponent(str);

    // force a string (since some things might just be a number, e.g. 2)
    str = '' + str;

    // loop through all chars in str
    var result = [];
    for ( var i = 0; i < str.length; i++ ) {
        if ( str[i].match( doNotEsc ) ) {
            result.push( str[i] );
        }
        else {
            result.push( '%' + hexMap[str.charCodeAt(i)] );
        }
    }

    // console.log('        ->', result.join(''));

    return result.join('');
}

module.exports = esc;
