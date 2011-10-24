// --------------------------------------------------------------------------------------------------------------------
//
// s3.js - class for AWS Simple Storage Service
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
var crypto = require('crypto');
var https = require('https');
var http = require('http');

// dependencies
var _ = require('underscore');
var request = require('request');
var xml2js = require('xml2js');
var dateFormat = require('dateformat');

// our own
var amazon = require('./amazon');

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 's3: ';

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html
var endPoint = {};
endPoint[amazon.US_EAST_1]      = "s3.amazonaws.com";
endPoint[amazon.US_WEST_1]      = "s3.us-west-1.amazonaws.com";
endPoint[amazon.EU_WEST_1]      = "s3.eu-west-1.amazonaws.com";
endPoint[amazon.AP_SOUTHEAST_1] = "s3.ap-southeast-1.amazonaws.com";
endPoint[amazon.AP_NORTHEAST_1] = "s3.ap-northeast-1.amazonaws.com";
// US_GOVCLOUD_1 not defined for public consumption

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html#s3_region
var locationConstraint = {};
locationConstraint[amazon.US_EAST_1]      = "";
locationConstraint[amazon.US_WEST_1]      = "us-west-1";
locationConstraint[amazon.EU_WEST_1]      = "EU";
locationConstraint[amazon.AP_SOUTHEAST_1] = "ap-southeast-1";
locationConstraint[amazon.AP_NORTHEAST_1] = "ap-northeast-1";
// US_GOVCLOUD_1 not defined for public consumption

var version = '2010-03-31';

// --------------------------------------------------------------------------------------------------------------------
// constructor

var S3 = function(accessKeyId, secretAccessKey, awsAccountId, region) {
    var self = this;

    // call the superclass for initialisation
    S3.super_.call(this, accessKeyId, secretAccessKey, awsAccountId, region);

    // check the region is valid
    if ( ! endPoint[region] ) {
        throw MARK + "invalid region '" + region + "'";
    }

    return self;
};

// inherit from Amazon
util.inherits(S3, amazon.Amazon);

// --------------------------------------------------------------------------------------------------------------------
// methods we need to implement from awssum.js/amazon.js

S3.prototype.endPoint = function() {
    return endPoint[this.region()];
};

S3.prototype.verb = function() {
    return 'GET';
};

S3.prototype.version = function() {
    return version;
};

S3.prototype.makeErrorFromParsedXml = function(result) {
    return {
        Code          : result.Error.Code,
        Message       : result.Error.Message,
        ArgumentName  : result.Error.ArgumentName,
        ArgumentValue : result.Error.ArgumentValue,
        RequestId     : result.Error.RequestId,
        HostId        : result.Error.HostId,
    };
};

// From: http://docs.amazonwebservices.com/AmazonS3/latest/dev/RESTAuthentication.html
//
// Returns a signature for this request.
S3.prototype.signature = function(strToSign) {
    // sign the request string
    var signature = crypto
        .createHmac('sha1', this.secretAccessKey())
        .update(strToSign)
        .digest('base64');

    // console.log('Signature :', signature);

    return signature;
};

// From: http://docs.amazonwebservices.com/AmazonS3/latest/dev/RESTAuthentication.html
//
// Returns a strToSign for this request.
S3.prototype.strToSign = function(bucketName, objectName, verb, path, headers, params) {
    var self = this;

    // start creating the string we need to sign
    var strToSign = '';
    strToSign += verb + "\n";

    // add the following headers (if available)
    _.each(['Content-MD5', 'Content-Type', 'Date'], function(hdrName) {
        if ( _.isString( headers[hdrName] ) ) {
            strToSign += headers[hdrName];
        }
        strToSign += "\n";
    });

    // add the CanonicalizedAmzHeaders
    var amzHeaders = _(headers)
        .chain()
        .keys()
        .map( function(h) { return h.toLowerCase(); } )
        .select( function(h) {
            return h.match(/^x-amz-/) ? true : false;
        })
        .value();

    _.each(amzHeaders, function(h) {
        strToSign += h + ':';

        // ToDo: cheat for now (presume there is only ever one header)
        var headerValue;
        if ( _.isArray(headers[h]) ) {
            headerValue = _(headers[h])
                .chain()
                .map(function(h) { return h.replace(/^\s+|\s+$/g, ''); })
                .value()
                .join(',');
        }
        else {
            headerValue = headers[h];
        }

        // condense all whitespace into a single space
        headerValue.replace(/\s+/g, ' ');

        strToSign += headerValue + "\n";
    });

    // add the CanonicalizedResource (bucket, path and sub-resource)
    strToSign += '/';
    if ( ! _.isUndefined(bucketName) ) {
        strToSign += bucketName + '/';
    }
    if ( ! _.isUndefined(objectName) ) {
        strToSign += objectName + '/';
    }

    // ToDo: append the params (or in S3 terms, the sub-resources)

    // console.log('StrToSign :', strToSign + '(Ends)');

    return strToSign;
};

// This default performRequest() method is used for:
//
// * SimpleDB
// * SQS
// * SNS
//
// Calls the callBack when we know what has happened.
S3.prototype.performRequest = function(bucketName, objectName, verb, path, headers, params, callBack) {
    var self = this;

    // S3 signatures are a little different to other services, so we do our own performRequest()

    // common headers : http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTCommonRequestHeaders.html

    // add in the date
    var date = (new Date).toString();
    headers.Date = dateFormat(new Date(), "UTC:ddd, dd mmm yyyy HH:MM:ss Z");

    // sign this request
    var strToSign = self.strToSign(bucketName, objectName, verb, path, headers, params);
    var signature = self.signature(strToSign);

    // add this signature to the headers (not the params)
    headers.Authorization = 'AWS ' + self.accessKeyId() + ':' + signature; // OLD

    // console.log('Params :', params);

    // console.log('BucketName :', bucketName);
    // console.log('ObjectName :', objectName);
    // console.log('Verb :', verb);
    // console.log('Path :', path);
    // console.log('Headers :', headers);
    // console.log('params :', params);

    var options = {
        method: verb,
        host: self.endPoint(),
        path: path + '?' + self.stringifyQuery( params ),
        headers: headers,
    };

    var req = https.request( options, function(res) {
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
                console.log("Didn't get a 200");

                console.log('StatusCode :', res.statusCode);
                console.log('Res Headers :', res.headers);
                console.log('Xml :', xml);

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
                    callBack( self.makeErrorFromParsedXml(result), null );
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
        console.log('Got an error - RIGHT HERE');
        callBack({
            Code : 'AwsSum-' + err.code,
            Message : err.message,
            OriginalError : err
        }, null);
    });

    // tell the request it's over
    req.end();
};

// --------------------------------------------------------------------------------------------------------------------
// operations on the service

// This list from: http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTServiceOps.html
//
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTServiceGET.html
//
// This list from: http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketOps.html
//
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketDELETE.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketDELETEpolicy.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketDELETEwebsite.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGET.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETacl.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETpolicy.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETlocation.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETlogging.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETnotification.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETVersion.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTrequestPaymentGET.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETversioningStatus.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETwebsite.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/mpUploadListMPUpload.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUT.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUTacl.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUTpolicy.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUTlogging.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUTnotification.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTrequestPaymentPUT.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUTVersioningStatus.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUTwebsite.html
//
// This list from: http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectOps.html
//
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectDELETE.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectGET.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectGETacl.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectGETtorrent.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectHEAD.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectPOST.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectPUT.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectPUTacl.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectCOPY.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/mpUploadInitiate.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/mpUploadUploadPart.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/mpUploadUploadPartCopy.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/mpUploadComplete.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/mpUploadAbort.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/mpUploadListParts.html

S3.prototype.listBuckets = function(data, callback) {
    var self = this;
    if ( callback == null ) {
        callback = data;
        data = {};
    }
    data = data || {};

    // ok, let's set some things up
    var verb = 'GET';
    var path = '/';
    var headers = {};
    var params = [];
    var body;

    // console.log('Verb :', verb);
    // console.log('Path :', path);
    // console.log('Headers :', util.inspect(headers, true, null));
    // console.log('Params :', util.inspect(params, true, null));
    // console.log('Body :', body);

    this.performRequest(undefined, undefined, verb, path, headers, params, callback);
};

// ToDo: RESTBucketDELETE.html
// ToDo: RESTBucketDELETEpolicy.html
// ToDo: RESTBucketDELETEwebsite.html
// ToDo: RESTBucketGET.html
// ToDo: RESTBucketGETacl.html
// ToDo: RESTBucketGETpolicy.html
// ToDo: RESTBucketGETlocation.html
// ToDo: RESTBucketGETlogging.html
// ToDo: RESTBucketGETnotification.html
// ToDo: RESTBucketGETVersion.html
// ToDo: RESTrequestPaymentGET.html
// ToDo: RESTBucketGETversioningStatus.html
// ToDo: RESTBucketGETwebsite.html
// ToDo: mpUploadListMPUpload.html
// ToDo: RESTBucketPUT.html
// ToDo: RESTBucketPUTacl.html
// ToDo: RESTBucketPUTpolicy.html
// ToDo: RESTBucketPUTlogging.html
// ToDo: RESTBucketPUTnotification.html
// ToDo: RESTrequestPaymentPUT.html
// ToDo: RESTBucketPUTVersioningStatus.html
// ToDo: RESTBucketPUTwebsite.html

// ToDo: RESTObjectDELETE.html
// ToDo: RESTObjectGET.html
// ToDo: RESTObjectGETacl.html
// ToDo: RESTObjectGETtorrent.html
// ToDo: RESTObjectHEAD.html
// ToDo: RESTObjectPOST.html
// ToDo: RESTObjectPUT.html
// ToDo: RESTObjectPUTacl.html
// ToDo: RESTObjectCOPY.html
// ToDo: mpUploadInitiate.html
// ToDo: mpUploadUploadPart.html
// ToDo: mpUploadUploadPartCopy.html
// ToDo: mpUploadComplete.html
// ToDo: mpUploadAbort.html
// ToDo: mpUploadListParts.html

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.S3 = S3;

// --------------------------------------------------------------------------------------------------------------------
