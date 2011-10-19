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
var awssum = require ("./awssum");
var crypto = require('crypto');
var _ = require('underscore');

// --------------------------------------------------------------------------------------------------------------------
// constants

var MARK = 'amazon: ';

var US_EAST_1 = 1;
var US_WEST_1 = 2;
var EU_WEST_1 = 3;
var AP_SOUTHEAST_1 = 4;
var AP_NORTHEAST_1 = 5;
var US_GOVCLOUD_1 = 6;

var Region = {
    US_EAST_1 : true,
    US_WEST_1 : true,
    EU_WEST_1 : true,
    AP_SOUTHEAST_1 : true,
    AP_SOUTHWEST_1 : true,
    US_GOVCLOUD_1 : true,
};

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

var Amazon = function(accessKeyId, secretAccessKey, region) {
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
    if ( ! region ) {
        throw MARK + 'region is required';
    }

    // allow access to (but not change) these variables
    self.accessKeyId     = function() { return accessKeyId;     };
    self.secretAccessKey = function() { return secretAccessKey; };
    self.region          = function() { return region;          };

    return self;
}

// inherit from AwsSum
util.inherits(Amazon, awssum.AwsSum);

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

// This default signature method is used for:
//
// * SimpleDB
// * SQS
//
// Returns a signature for this request.
Amazon.prototype.signature = function(params) {
    // sign the request (remember this is SignatureVersion '2')
    var strToSign = this.verb() + "\n" + this.endPoint().toLowerCase() + "\n" + "/\n";

    // console.log('in here - 2');

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

    // sign the request string
    var signature = crypto
        .createHmac('sha256', this.secretAccessKey())
        .update(strToSign)
        .digest('base64');

    // console.log('Signature :', signature);

    return signature;
}

// --------------------------------------------------------------------------------------------------------------------
// exports

// constants
exports.US_EAST_1 = US_EAST_1;
exports.US_WEST_1 = US_WEST_1;
exports.EU_WEST_1 = EU_WEST_1;
exports.AP_SOUTHEAST_1 = AP_SOUTHEAST_1;
exports.AP_NORTHEAST_1 = AP_NORTHEAST_1;
exports.US_GOVCLOUD_1 = US_GOVCLOUD_1;

exports.Region = Region;

// object constructor
exports.Amazon = Amazon;

// --------------------------------------------------------------------------------------------------------------------
