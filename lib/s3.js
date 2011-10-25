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

var validSubresource = {
    acl            : true,
    policy         : true,
    location       : true,
    logging        : true,
    notification   : true,
    versions       : true,
    // torrent        : true,
    // versionid      : true,
    requestPayment : true,
    versioning     : true,
    website        : true,
};

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

    // add the sub-resources (such as versioning, location, acl, torrent, versionid) but not things like max-keys,
    // prefix or other query parameters
    if ( params.length ) {
        strToSign += _(params)
            .chain()
            .filter(function(pair) { return validSubresource[pair.name]; } )
            // .tap(function(sdf) { console.log('HELLO1', sdf); })
            .sortBy(function(pair) { return pair.name; } )
            // .tap(function(sdf) { console.log('HELLO2', sdf); })
            .map(function(pair){
                return _.isUndefined(pair.value) ? pair.name : pair.name + '=' + pair.value;
            })
            // .tap(function(sdf) { console.log('HELLO3', sdf); })
            .reduce(function(memo, pairStr) {
                return memo === '' ? '?' + pairStr : memo + '&' + pairStr;
            }, '')
            .value()
        ;
    }

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

    // console.log('BucketName :', bucketName);
    // console.log('ObjectName :', objectName);
    // console.log('Verb :', verb);
    // console.log('Path :', path);
    // console.log('Headers :', headers);
    // console.log('Params :', params);

    // console.log('Stringify :', self.stringifyQuery( params ));

    var options = {
        method: verb,
        host: bucketName ? bucketName + '.' + self.endPoint() : self.endPoint(),
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
            // console.log('StatusCode :', res.statusCode);
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
        // console.log('Got an error - RIGHT HERE');
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
// generic operations

// for the next acl, policy, location, logging, notification, versions, requestPayment, versioning, website
function makeGetBucketWithSubresource(subresource) {
    return makeGetBucketWithParams([{ name : subresource }]);
}

function makeGetBucketWithParams(params) {
    return function(options, callback) {
        var self = this;
        if ( callback == null ) {
            callback = options;
            options = {};
        }
        options = options || {};

        // check we have a BucketName
        if ( _.isUndefined(options.BucketName) ) {
            callBack({ Code : 'AwsSumCheck', Message : 'Provide a BucketName' }, null);
            return;
        }

        this.performRequest(options.BucketName, undefined, 'GET', '/', {}, params, callback);
    }
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

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTServiceGET.html
S3.prototype.listBuckets = function(data, callback) {
    var self = this;
    if ( callback == null ) {
        callback = data;
        data = {};
    }
    data = data || {};

    this.performRequest(undefined, undefined, 'GET', '/', {}, [], callback);
};

// ToDo: RESTBucketDELETE.html
// ToDo: RESTBucketDELETEpolicy.html
// ToDo: RESTBucketDELETEwebsite.html

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGET.html
S3.prototype.listObjects = function(options, callback) {
    var self = this;
    if ( callback == null ) {
        callback = options;
        options = {};
    }
    options = options || {};

    // check we have a BucketName
    if ( _.isUndefined(options.BucketName) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a BucketName' }, null);
        return;
    }

    // do any other params
    var params = [];
    self.addParamIfDefined(params, 'marker', options.Marker);
    self.addParamIfDefined(params, 'max-keys', options.MaxKeys);
    self.addParamIfDefined(params, 'delimiter', options.Delimiter);
    self.addParamIfDefined(params, 'prefix', options.Prefix);

    this.performRequest(options.BucketName, undefined, 'GET', '/', {}, params, callback);
};

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETacl.html
S3.prototype.getBucketAcl = makeGetBucketWithSubresource('acl');

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETpolicy.html
S3.prototype.getBucketPolicy = makeGetBucketWithSubresource('policy');

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETlocation.html
S3.prototype.getBucketLocation = makeGetBucketWithSubresource('location');

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETlogging.html
S3.prototype.getBucketLogging = makeGetBucketWithSubresource('logging');

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETnotification.html
S3.prototype.getBucketNotification = makeGetBucketWithSubresource('notification');

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETVersion.html
S3.prototype.getBucketVersions = function(options, callback) {
    var self = this;
    if ( callback == null ) {
        callback = options;
        options = {};
    }
    options = options || {};

    // check we have a BucketName
    if ( _.isUndefined(options.BucketName) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a BucketName' }, null);
        return;
    }

    var params = [];
    params.push({ name : 'versions' });

    // set the other params if there are any
    self.addParamIfDefined(params, 'delimiter', options.Delimiter);
    self.addParamIfDefined(params, 'key-marker', options.KeyMarker);
    self.addParamIfDefined(params, 'max-keys', options.MaxKeys);
    self.addParamIfDefined(params, 'prefix', options.Prefix);
    self.addParamIfDefined(params, 'version-id-marker', options.VersionIdMarker);

    this.performRequest(options.BucketName, undefined, 'GET', '/', {}, params, callback);
}

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTrequestPaymentGET.html
S3.prototype.getBucketRequestPayment = makeGetBucketWithSubresource('requestPayment');

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETversioningStatus.html
S3.prototype.getBucketVersioning = makeGetBucketWithSubresource('versioning');

// ToDo: http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETwebsite.html
S3.prototype.getBucketWebsite = makeGetBucketWithSubresource('website');

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
