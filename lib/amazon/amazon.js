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
var awssum = require ("../awssum");

// --------------------------------------------------------------------------------------------------------------------
// constants

var MARK = 'amazon: ';

var US_EAST_1      = 'us-east-1';
var US_WEST_1      = 'us-west-1';
var US_WEST_2      = 'us-west-2';
var EU_WEST_1      = 'eu-west-1';
var AP_SOUTHEAST_1 = 'ap-southeast-1';
var AP_NORTHEAST_1 = 'ap-northeast-1';
var SA_EAST_1      = 'sa-east-1';
var US_GOV_WEST_1  = 'us-gov-west-1'; // See : http://aws.amazon.com/about-aws/globalinfrastructure/

var Region = {
    US_EAST_1      : true,
    US_WEST_1      : true,
    US_WEST_2      : true,
    EU_WEST_1      : true,
    AP_SOUTHEAST_1 : true,
    AP_NORTHEAST_1 : true,
    SA_EAST_1      : true,
    US_GOV_WEST_1  : true,
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
// functions to be overriden by inheriting class

// see ../awssum.js for more details

Amazon.prototype.extractBody = function() {
    // most amazon services return XML, so override in inheriting classes if needed
    return 'xml';
};

Amazon.prototype.addCommonOptions = function(options) {
    var self = this;

    // get the date in UTC : %Y-%m-%dT%H:%M:%SZ
    var date = (new Date).toISOString();

    // add in the common params
    options.params.push({ 'name' : 'AWSAccessKeyId', 'value' : self.accessKeyId() });
    options.params.push({ 'name' : 'SignatureVersion', 'value' : self.signatureVersion() });
    options.params.push({ 'name' : 'SignatureMethod', 'value' : self.signatureMethod() });
    options.params.push({ 'name' : 'Timestamp', 'value' : date });
    options.params.push({ 'name' : 'Version', 'value' : self.version() });

    // make the strToSign, create the signature and sign it
    var strToSign = self.strToSign(options);
    var signature = self.signature(strToSign);
    self.addSignature(options, signature);
};

// --------------------------------------------------------------------------------------------------------------------
// functions to be overriden by inheriting (Amazon) class

// function version()              -> string (the version of this service)
// function signatureVersion()     -> string (the signature version used)
// function signatureMethod()      -> string (the signature method used)
// function strToSign(options)     -> string (the string that needs to be signed)
// function signature(strToSign)   -> string (the signature itself)
// function addSignature(options, signature) -> side effect, adds the signature to the 'options'

// Amazon.prototype.version // no default

Amazon.prototype.signatureVersion = function() {
    return 2;
};

Amazon.prototype.signatureMethod = function() {
    return 'HmacSHA256';
};

Amazon.prototype.strToSign = function(options) {
    var self = this;

    // create the strToSign for this request
    var strToSign = options.method + "\n" + options.host.toLowerCase() + "\n" + options.path + "\n";

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

// --------------------------------------------------------------------------------------------------------------------
// exports

// constants
exports.US_EAST_1      = US_EAST_1;
exports.US_WEST_1      = US_WEST_1;
exports.EU_WEST_1      = EU_WEST_1;
exports.AP_SOUTHEAST_1 = AP_SOUTHEAST_1;
exports.AP_NORTHEAST_1 = AP_NORTHEAST_1;
exports.US_GOV_WEST_1  = US_GOV_WEST_1;
exports.SA_EAST_1      = SA_EAST_1;

// object constructor
exports.Amazon = Amazon;

// --------------------------------------------------------------------------------------------------------------------
