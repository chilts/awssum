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
// var US_GOVCLOUD_1 = '???';

var Region = {
    US_EAST_1 : true,
    US_WEST_1 : true,
    EU_WEST_1 : true,
    AP_SOUTHEAST_1 : true,
    AP_SOUTHWEST_1 : true,
    // US_GOVCLOUD_1 : true,
};

var signatureMethod = 'HmacSHA256';
var signatureVersion = 2;

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

Amazon.prototype.endPoint = function() {
    return '';
};

Amazon.prototype.verb = function() {
    return '';
};

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

// This default strToSign method is used for:
//
// * SimpleDB
// * SQS
// * SNS
//
// Returns a strToSign for this request.
Amazon.prototype.strToSign = function(path, params) {
    // create the strToSign for this request
    var strToSign = this.verb() + "\n" + this.endPoint().toLowerCase() + "\n" + path + "\n";

    // now add on all of the params (after being sorted)
    var self = this;
    var pvPairs = _(params)
        .chain()
        .sortBy(function(p) { return p.name })
        .map(function(v, i) { return '' + self.escape(v.name) + '=' + self.escape(v.value) })
        .join('&')
        .value()
    ;
    strToSign += pvPairs;

    // console.log('StrToSign:', strToSign);

    return strToSign;
}

// This default signature method is used for:
//
// * SimpleDB
// * SQS
//
// Returns a signature for this request.
Amazon.prototype.signature = function(strToSign) {
    // sign the request string
    var signature = crypto
        .createHmac('sha256', this.secretAccessKey())
        .update(strToSign)
        .digest('base64');

    // console.log('Signature :', signature);

    return signature;
}

Amazon.prototype.performNewRequest = function(args, callback) {
    var self = this;

    // set some defaults on the various input params
    args.verb    = args.verb || 'GET';
    args.path = args.path || '/';
    args.headers = args.headers || {};
    args.params  = args.params || [];
    // none for args.body
    args.statusCode = args.statusCode || 200;
    if ( _.isUndefined(args.decodeBody) ) {
        args.decodeBody = true;
    }

    self.performRequest(args.action, args.path, args.params, callback);
};

// This default performRequest() method is used for:
//
// * SimpleDB
// * SQS
// * SNS
//
// Calls the callback when we know what has happened.
Amazon.prototype.performRequest = function(action, path, params, callback) {
    var self = this;

    // SimpleDB/SQS is pretty straightforward for requests:
    //
    // * verb = GET (always)
    // * headers = none
    // * params = just what we add
    //
    // It _always_ returns XML, so we decode that only. It also should always give a 200 when the response is ok.
    //
    // There is nothing else :)

    // get the date in UTC : %Y-%m-%dT%H:%M:%SZ
    var date = (new Date).toISOString();

    // add in the common params
    params.push({ 'name' : 'Action', 'value' : action });
    params.push({ 'name' : 'AWSAccessKeyId', 'value' : this.accessKeyId() });
    params.push({ 'name' : 'Version', 'value' : this.version() });
    params.push({ 'name' : 'Timestamp', 'value' : date });
    params.push({ 'name' : 'SignatureVersion', 'value' : signatureVersion });
    params.push({ 'name' : 'SignatureMethod', 'value' : signatureMethod });

    // sign this request
    var strToSign = this.strToSign(path, params);
    var signature = this.signature(strToSign);
    params.push({ 'name' : 'Signature', 'value' : signature });

    // console.log('Params :', params);

    var req = https.request({
        verb : 'GET',
        host : this.endPoint(),
        path : path + '?' + this.stringifyQuery( params ),
    }, function(res) {
        // 'res' is a http://nodejs.org/docs/v0.4.10/api/http.html#http.ClientResponse

        // do everything in utf8 (and therefore the 'data' event emits a UTF8 string)
        res.setEncoding('utf8');

        var xml = '';

        // when we get some data back, store it
        res.on('data', function(data) {
            xml += data;
        });

        // if the connection terminates before end is emitted, it's an error
        res.on('close', function(err) {
            callback(err, null);
        });

        // when we get our data back, then decode it
        res.on('end', function() {
            // create the XML parser
            var parser = new xml2js.Parser({ normalize : false, trim : false, explicitRoot : true });
            // console.log('Xml :', xml);

            // first thing we check is the return code
            if ( res.statusCode !== 200 ) {
                // decode the returned XML
                parser.parseString(xml, _.once(function (err, result) {
                    if ( err ) {
                        // error parsing the XML will be an error
                        callback({
                            Code : 'AwsSum',
                            Message : 'Failed to Parse the XML: ' + err.message,
                            OriginalError : err
                        }, null);
                        return;
                    }

                    // ok, we have the error data (parsed)
                    // console.log('Error Data :', result);
                    callback( self.makeErrorFromParsedXml(result), null );
                }));
                return;
            }

            // the returned statusCode was ok, so parse the result out
            parser.parseString(xml, _.once(function (err, result) {
                if ( err ) {
                    // error parsing the XML will be an error
                    callback({
                        Code : 'AwsSum',
                        Message : 'Failed to Parse the XML: ' + err.message,
                        OriginalError : err
                    }, null);
                    return;
                }

                // everything looks ok
                callback(null, result);
            }));
        });
    });

    // if there is an error with the formation of the request, call the callback
    req.on('error', function(err) {
        callback({
            Code : 'AwsSum-' + err.code,
            Message : err.message,
            OriginalError : err
        }, null);
    });

    // tell the request it's over
    req.end();
}

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
