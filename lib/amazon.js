// --------------------------------------------------------------------------------------------------------------------
//
// amazon.js - the base class for all Amazon Web Services
//
// Copyright (c) 2011 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
// requires

var util = require("util");
var crypto = require('crypto');
var https = require('https');

// dependencies
var _ = require('underscore');
var xml2js = require('xml2js');

// our own library
var awssum = require ("./awssum");

// --------------------------------------------------------------------------------------------------------------------
// constants

var MARK = 'amazon: ';

var US_EAST_1 = 'Virginia';
var US_WEST_1 = 'California';
var EU_WEST_1 = 'Dublin';
var AP_SOUTHEAST_1 = 'Singapore';
var AP_NORTHEAST_1 = 'Tokyo';
var US_GOVCLOUD_1 = 'Undisclosed';

var Region = {
    US_EAST_1 : true,
    US_WEST_1 : true,
    EU_WEST_1 : true,
    AP_SOUTHEAST_1 : true,
    AP_SOUTHWEST_1 : true,
    US_GOVCLOUD_1 : true,
};

// create our XML parser
var parser = new xml2js.Parser({ normalize : false, trim : false, explicitRoot : true });

// Constants for our own querystring.escape(...) since that doesn't do what we want it to do

// set up the hex digits and a hexMap[0..255] = ( '00', '01', ...,  'FF' )
var hexDigits = '0123456789ABCDEF';
var hexMap = [];
for ( var i = 0; i < 256; i++ ) {
	hexMap[i] = hexDigits.charAt(i >> 4) + hexDigits.charAt(i & 15);
}
var doNotEsc = /[A-Za-z0-9_.~-]/;

// --------------------------------------------------------------------------------------------------------------------
// constructor

var Amazon = function(accessKeyId, secretAccessKey, awsAccountId, region) {
    var self = this;

    // call the superclass for initialisation
    Amazon.super_.call(this);

    // check that we have each of these values
    if ( ! accessKeyId ) {
        throw MARK + 'accessKeyID is required';
    }
    if ( ! secretAccessKey ) {
        throw MARK + 'secretAccessKey is required';
    }
    if ( ! awsAccountId ) {
        throw MARK + 'awsAccountId is required';
    }
    if ( ! region ) {
        throw MARK + 'region is required';
    }

    // allow access to (but not change) these variables
    self.accessKeyId     = function() { return accessKeyId;     };
    self.secretAccessKey = function() { return secretAccessKey; };
    self.awsAccountId    = function() { return awsAccountId;    };
    self.region          = function() { return region;          };

    return self;
}

// inherit from AwsSum
util.inherits(Amazon, awssum.AwsSum);

// --------------------------------------------------------------------------------------------------------------------
// utility/helper functions

Amazon.prototype.addParam = function(params, name, value) {
    params.push({ 'name' : name, 'value' : value });
}

Amazon.prototype.addParamIfDefined = function(params, name, value) {
    if ( ! _.isUndefined(value) ) {
        params.push({ 'name' : name, 'value' : value });
    }
}

Amazon.prototype.addHeader = function(header, name, value) {
    header[name] = value;
}

Amazon.prototype.addHeaderIfDefined = function(header, name, value) {
    if ( ! _.isUndefined(value) ) {
        header[name] = value;
    }
}

// --------------------------------------------------------------------------------------------------------------------
// functions to be overriden by inheriting class

// function verb()                 -> string (the default verb for the HTTP request)
// function host()                 -> string (the host for this service/region)
// function path()                 -> string (the default path for this service)
// function signatureVersion()     -> string (the signature version used)
// function signatureMethod()      -> string (the signature method used)
// function addCommonOptions(options) -> side effect, adds the common headers/params for this service
// function version()              -> string (the version of this service)
// function strToSign(options)     -> string (the string that needs to be signed)
// function signature(strToSign)   -> string (the signature itself)
// function addSignature(options, signature)  -> side effect, adds the signature to the 'options'
// function statusCode()           -> number (expected HTTP Status Code)
// function decodeBody()           -> boolean

Amazon.prototype.verb = function() {
    return 'GET';
};

Amazon.prototype.host = function() {
    return '';
};

Amazon.prototype.path = function() {
    return '/';
};

Amazon.prototype.signatureVersion = function() {
    return 2;
};

Amazon.prototype.signatureMethod = function() {
    return 'HmacSHA256';
};

Amazon.prototype.addCommonOptions = function(options) {
    var self = this;

    // get the date in UTC : %Y-%m-%dT%H:%M:%SZ
    var date = (new Date).toISOString();

    // add in the common params
    options.params.push({ 'name' : 'AWSAccessKeyId', 'value' : self.accessKeyId() });
    options.params.push({ 'name' : 'Version', 'value' : self.version() });
    options.params.push({ 'name' : 'Timestamp', 'value' : date });
    options.params.push({ 'name' : 'SignatureVersion', 'value' : self.signatureVersion() });
    options.params.push({ 'name' : 'SignatureMethod', 'value' : self.signatureMethod() });
};

Amazon.prototype.strToSign = function(options) {
    var self = this;

    // create the strToSign for this request
    var strToSign = options.verb + "\n" + options.host.toLowerCase() + "\n" + options.path + "\n";

    // now add on all of the params (after being sorted)
    var self = this;
    var pvPairs = _(options.params)
        .chain()
        .sortBy(function(p) { return p.name })
        .map(function(v, i) { return '' + self.escape(v.name) + '=' + self.escape(v.value) })
        .join('&')
        .value()
    ;
    strToSign += pvPairs;

    // console.log('StrToSign:', strToSign);

    return strToSign;
};

Amazon.prototype.signature = function(strToSign) {
    var self = this;

    // sign the request string
    var signature = crypto
        .createHmac('sha256', self.secretAccessKey())
        .update(strToSign)
        .digest('base64');

    // console.log('Signature :', signature);

    return signature;
}

Amazon.prototype.addSignature = function(options, signature) {
    options.params.push({ 'name' : 'Signature', 'value' : signature });
};

Amazon.prototype.statusCode = function() {
    return 200;
};

Amazon.prototype.decodeBody = function() {
    return true;
};

// --------------------------------------------------------------------------------------------------------------------

// Our own version of URI escape/encode, since things like '*' don't get encoded when using querystring.stringify().
//
// From: http://docs.amazonwebservices.com/AmazonSimpleDB/latest/DeveloperGuide/HMACAuth.html
//
// * Do not URL encode any of the unreserved characters that RFC 3986 defines. These unreserved characters are A-Z,
//   a-z, 0-9, hyphen ( - ), underscore ( _ ), period ( . ), and tilde ( ~ ).
// * Percent encode all other characters with %XY, where X and Y are hex characters 0-9 and uppercase A-F.
// * Percent encode extended UTF-8 characters in the form %XY%ZA....
// * Percent encode the space character as %20 (and not +, as common encoding schemes do).
Amazon.prototype.escape = function(str) {
    // force a string (since some things might just be a number, e.g. 2)
    str = '' + str;

    // console.log('Escaping :', str);

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

// do our own strigify query, since querystring.stringify doesn't do what we want for AWS
Amazon.prototype.stringifyQuery = function(params) {
    var self = this;
    // console.log('Params :', params);
    var query = _(params)
        .chain()
        .map(function(v, i) {
            return _.isUndefined(v.value) ?
                self.escape(v.name)
                : self.escape(v.name) + '=' + self.escape(v.value)
                ;
        })
        .join('&')
        .value()
    ;
    // console.log('Query :', query);
    return query;
}

Amazon.prototype.performRequest = function(options, callback) {
    var self = this;

    // set some defaults on the various input params
    options.verb    = options.verb || self.verb();
    options.host    = options.host || self.host();
    options.path    = options.path || self.path();
    options.headers = options.headers || {};
    options.params  = options.params || [];
    // no default for options.body
    options.statusCode = options.statusCode || self.statusCode();
    if ( _.isUndefined(options.decodeBody) ) {
        options.decodeBody = self.decodeBody();
    }

    // add common headers and then sign the request
    self.addCommonOptions(options);
    var strToSign = self.strToSign(options);
    var signature = self.signature(strToSign);
    self.addSignature(options, signature);

    // console.log('Options :', options);

    // convert from our request to the https.request()
    var reqOptions = {
        method: options.verb,
        host: options.host,
        path: options.path + '?' + self.stringifyQuery( options.params ),
        headers: options.headers,
    };

    // console.log('ReqOptions :', reqOptions);

    // now do the request
    var req = https.request( reqOptions, function(res) {
        var called = false;

        // do everything in utf8 (and therefore the 'data' event emits a UTF8 string)
        res.setEncoding('utf8');

        var resBody = '';

        // when we get some data back, store it
        res.on('data', function(data) {
            resBody += data;
        });

        // if the connection terminates before end is emitted, it's an error
        res.on('close', function(err) {
            // Not sure why but for some reason both 'end' and 'close' can be called. Not sure why but I presume it
            // should be one or the other - not both!
            //
            // If we have already called the callback, then don't call this here!
            if ( called ) {
                return;
            }

            // console.log('Response closed, calling callback with error');
            called = true;
            callback(err, null);
        });

        // when we get our data back, then decode it
        res.on('end', function() {
            // used when _not_ decoding the body, but declared here since it's the top of the function :)
            var result = {};

            // console.log('Status :', res.statusCode);
            // console.log('ResHeaders :', res.headers);
            // console.log('ResBody :', resBody);

            // first thing we check is the return code
            if ( res.statusCode !== options.statusCode ) {
                // console.log('ResHeaders :', res.headers);

                // decode the returned XML
                parser.parseString(resBody, _.once(function (err, result) {
                    if ( err ) {
                        // error parsing the XML will be an error
                        // console.log('error parsing the error xml, calling callback with error');
                        called = true;
                        callback({
                            Code : 'AwsSum',
                            Message : 'Failed to Parse the XML: ' + err.message,
                            OriginalError : err
                        }, null);
                        return;
                    }

                    // if we didn't receive XML with this response, make an empty object
                    if ( _.isNull(result) ) {
                        result = {};
                    }

                    // ok, we have the error data (parsed)
                    // console.log('parsed error data ok, calling callback with that error');
                    called = true;
                    callback(result, null);
                }));
                return;
            }

            // the returned statusCode is what we expect, so check whether we should parse or leave the body alone
            if ( options.decodeBody ) {
                // the returned statusCode was ok, so parse the result out
                parser.parseString(resBody, _.once(function (err, result) {
                    if ( err ) {
                        // error parsing the XML will be an error
                        // console.log('failed to parse the result xml, calling callback with error');
                        called = true;
                        callback({
                            Code : 'AwsSum',
                            Message : 'Failed to Parse the XML: ' + err.message,
                            OriginalError : err
                        }, null);
                        return;
                    }

                    // everything looks ok
                    if ( _.isNull(result) ) {
                        // this was fine, except we should return an empty hash (which makes it easier for the callee)
                        result = {};
                    }

                    // console.log('Result :', result);
                    called = true;
                    callback(null, result);
                }));
            }
            else {
                // we've been asked _not_ to decode the body, so just return it
                result.Body = resBody;

                // console.log('got response body ok (not decoding), calling callback');
                callback( null, result );
                return;
            }
        });
    });

    // if there is an error with the formation of the request, call the callback
    req.on('error', function(err) {
        // console.log('error called, calling callback with that error');
        called = true;
        callback({
            Code : 'AwsSum-' + err.code,
            Message : err.message,
            OriginalError : err
        }, null);
    });

    // tell the request it's over (but also pass the body if we have it)
    if ( ! _.isUndefined(options.body) ) {
        req.write(options.body);
    }
    req.end();
};

// --------------------------------------------------------------------------------------------------------------------
// exports

// constants
exports.US_EAST_1 = US_EAST_1;
exports.US_WEST_1 = US_WEST_1;
exports.EU_WEST_1 = EU_WEST_1;
exports.AP_SOUTHEAST_1 = AP_SOUTHEAST_1;
exports.AP_NORTHEAST_1 = AP_NORTHEAST_1;
// exports.US_GOVCLOUD_1 = US_GOVCLOUD_1;

exports.Region = Region;

// object constructor
exports.Amazon = Amazon;

// --------------------------------------------------------------------------------------------------------------------
