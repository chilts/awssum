// --------------------------------------------------------------------------------------------------------------------
//
// sqs.js - class for AWS SQS
//
// Copyright (c) 2011 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
// requires

// built-ins
var util = require('util');
var querystring = require('querystring');
var crypto = require('crypto');
var https = require('https');

// dependencies
var _ = require('underscore');
var xml2js = require('xml2js');

// our own
var amazon = require('./amazon');

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 'sqs: ';

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html
var endPoint = {};
endPoint[amazon.US_EAST_1]      = "sqs.us-east-1.amazonaws.com";
endPoint[amazon.US_WEST_1]      = "sqs.us-west-1.amazonaws.com";
endPoint[amazon.EU_WEST_1]      = "sqs.eu-west-1.amazonaws.com";
endPoint[amazon.AP_SOUTHEAST_1] = "sqs.ap-southeast-1.amazonaws.com";
endPoint[amazon.AP_NORTHEAST_1] = "sqs.ap-northeast-1.amazonaws.com";
// US_GOVCLOUD_1 not defined for public consumption

var version = '2009-02-01';
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

var Sqs = function(accessKeyId, secretAccessKey, region) {
    var self = this;

    // call the superclass for initialisation
    Sqs.super_.call(this, accessKeyId, secretAccessKey, region);

    // check the region is valid
    if ( ! endPoint[region] ) {
        throw MARK + "invalid region '" + region + "'";
    }

    return self;
};

// inherit from Amazon
util.inherits(Sqs, amazon.Amazon);

// --------------------------------------------------------------------------------------------------------------------
// methods we need to implement from awssum.js/amazon.js

Sqs.prototype.endPoint = function() {
    return endPoint[this.region()];
};

Sqs.prototype.verb = function() {
    return 'GET';
}

// returns the URL to use for this request
Sqs.prototype.url = function() {
    return 'https://' + this.endPoint() + '/';
}

// Our own version of URI escape/encode, since things like '*' don't get encoded when using querystring.stringify().
//
// From: http://docs.amazonwebservices.com/AmazonSqs/latest/DeveloperGuide/HMACAuth.html
//
// * Do not URL encode any of the unreserved characters that RFC 3986 defines. These unreserved characters are A-Z,
//   a-z, 0-9, hyphen ( - ), underscore ( _ ), period ( . ), and tilde ( ~ ).
// * Percent encode all other characters with %XY, where X and Y are hex characters 0-9 and uppercase A-F.
// * Percent encode extended UTF-8 characters in the form %XY%ZA....
// * Percent encode the space character as %20 (and not +, as common encoding schemes do).
Sqs.prototype.escape = function(str) {
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

Sqs.prototype.stringifyQuery = function(params) {
    var self = this;
    // console.log('Params :', params);
    var query = _(params)
        .chain()
        .map(function(v, i) { return '' + self.escape(v.name) + '=' + self.escape(v.value); } )
        .join('&')
        .value()
    ;
    // console.log('Query :', query);
    return query;
}

Sqs.prototype.performRequest = function(action, params, callBack) {
    // Sqs is pretty straightforward for requests:
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
    params.push({ 'name' : 'Version', 'value' : version });
    params.push({ 'name' : 'Timestamp', 'value' : date });
    params.push({ 'name' : 'SignatureVersion', 'value' : signatureVersion });
    params.push({ 'name' : 'SignatureMethod', 'value' : signatureMethod });

    // sign this request
    var strToSign = this.strToSign(params);
    var signature = this.signature(strToSign);
    params.push({ 'name' : 'Signature', 'value' : signature });

    // console.log('Params :', params);

    var req = https.get({
        host : this.endPoint(),
        path : '/?' + this.stringifyQuery( params ),
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
            callBack(err, null);
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
                        callBack({
                            Code : 'AwsSum',
                            Message : 'Failed to Parse the XML: ' + err.message,
                            OriginalError : err
                        }, null);
                        return;
                    }

                    // ok, we have the error data (parsed)
                    // console.log('Error Data :', result);
                    callBack({
                        Code : result.Response.Errors.Error.Code,
                        Message : result.Response.Errors.Error.Message,
                        RequestId : result.Response.RequestID
                    }, null);
                }));
                return;
            }

            // the returned statusCode was ok, so parse the result out
            parser.parseString(xml, _.once(function (err, result) {
                if ( err ) {
                    // error parsing the XML will be an error
                    callBack({
                        Code : 'AwsSum',
                        Message : 'Failed to Parse the XML: ' + err.message,
                        OriginalError : err
                    }, null);
                    return;
                }

                // everything looks ok
                callBack(null, result);
            }));
        });
    });

    // if there is an error with the formation of the request, call the callBack
    req.on('error', function(err) {
        callBack({
            Code : 'AwsSum-' + err.code,
            Message : err.message,
            OriginalError : err
        }, null);
    });
}

// --------------------------------------------------------------------------------------------------------------------
// operations on the service

// This list from: http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Operations.html
//
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryAddPermission.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryChangeMessageVisibility.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryCreateQueue.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryDeleteMessage.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryDeleteQueue.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryGetQueueAttributes.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryListQueues.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryReceiveMessage.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryRemovePermission.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QuerySendMessage.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QuerySetQueueAttributes.html

// ToDo: addPermission()

// ToDo: changeMessageVisibility()

// ToDo: createQueue()

// ToDo: deleteMessage()

// ToDo: deleteQueue()

// ToDo: getQueueAttributes()

Sqs.prototype.listQueues = function(queueNamePrefix, callBack) {
    var params = [];

    if ( typeof queueNamePrefix !== 'undefined' ) {
        params.push({ 'name' : 'QueueNamePrefix', 'value' : queueNamePrefix });
    }

    this.performRequest('ListQueues', params, callBack);
};

// ToDo: receiveMessage()

// ToDo: removePermission()

// ToDo: sendMessage()

// ToDo: setQueueAttributes()

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.Sqs = Sqs;

// --------------------------------------------------------------------------------------------------------------------
