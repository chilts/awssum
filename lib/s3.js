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
var XML = require('xml');

// our own
var amazon = require('./amazon');

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 's3: ';

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html
var endPoint = {};
endPoint[amazon.US_EAST_1]      = "s3.amazonaws.com";
endPoint[amazon.US_WEST_1]      = "s3-us-west-1.amazonaws.com";
endPoint[amazon.EU_WEST_1]      = "s3-eu-west-1.amazonaws.com";
endPoint[amazon.AP_SOUTHEAST_1] = "s3-ap-southeast-1.amazonaws.com";
endPoint[amazon.AP_NORTHEAST_1] = "s3-ap-northeast-1.amazonaws.com";
// US_GOVCLOUD_1 not defined for public consumption

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html#s3_region
var locationConstraint = {};
locationConstraint[amazon.US_EAST_1]      = "";
locationConstraint[amazon.US_WEST_1]      = "us-west-1";
locationConstraint[amazon.EU_WEST_1]      = "EU";
locationConstraint[amazon.AP_SOUTHEAST_1] = "ap-southeast-1";
locationConstraint[amazon.AP_NORTHEAST_1] = "ap-northeast-1";
// US_GOVCLOUD_1 not defined for public consumption

var version = '2011-10-04';

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
    uploads        : true,
};

// create our XML parser
var parser = new xml2js.Parser({ normalize : false, trim : false, explicitRoot : true });

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

S3.prototype.putResponseHeadersIntoObject = function(res, o) {
    o.Headers = o.Headers || {};

    _.each(res.headers, function(val, hdr) {
        if ( hdr.match(/^x-amz-/) ) {
            // ToDo: it'd be nice if we convert things like:
            // x-amz-request-id             -> RequestId
            // x-amz-id-2                   -> Id2
            // x-amz-server-side-encryption -> ServerSideEncryption
            // x-amz-version-id             -> VersionId
            o.Headers[hdr] = val;
        }
    });

    // From: http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTCommonResponseHeaders.html
    _.each(['date', 'etag', 'content-length', 'connection', 'server'], function(h) {
        if ( ! _.isUndefined(res.headers[h]) ) {
            o.Headers[h] = res.headers[h];
        }
    });
}

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
S3.prototype.strToSign = function(bucketName, objectName, verb, headers, params) {
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

    // add the CanonicalizedResource (bucket, path (defined by objectName) and sub-resource (defined by params))
    strToSign += '/';
    if ( ! _.isUndefined(bucketName) ) {
        strToSign += bucketName + '/';
    }
    if ( ! _.isUndefined(objectName) ) {
        strToSign += objectName;
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

// Do our own performRequest() since the other services at Amazon are a lot simpler than S3! :(
S3.prototype.performRequest = function(options, callback) {
    var self = this;

    // set some defaults on the various input params
    // none for options.bucketName
    // none for options.objectName
    options.verb    = options.verb || 'GET';
    options.headers = options.headers || {};
    options.params  = options.params || [];
    // none for options.body
    options.endpoint = options.endpoint || self.endPoint(); // HACK: needed for CreateBucket
    options.statusCode = options.statusCode || 200;
    if ( _.isUndefined(options.decodeBody) ) {
        // only false for getObject(...)
        options.decodeBody = true;
    }

    // S3 signatures are a little different to other services, so we do our own performRequest()

    // common headers : http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTCommonRequestHeaders.html

    // add in the date
    var date = (new Date).toString();
    options.headers.Date = dateFormat(new Date(), "UTC:ddd, dd mmm yyyy HH:MM:ss Z");

    // sign this request
    var strToSign = self.strToSign(
        options.bucketName,
        options.objectName,
        options.verb,
        options.headers,
        options.params
    );
    var signature = self.signature(strToSign);

    // add this signature to the headers (not the params)
    options.headers.Authorization = 'AWS ' + self.accessKeyId() + ':' + signature; // OLD

    // console.log('BucketName :', options.bucketName);
    // console.log('ObjectName :', options.objectName);
    // console.log('Verb :', options.verb);
    // console.log('Headers :', options.headers);
    // console.log('Params :', options.params);
    // console.log('Body :', options.body);
    // console.log('Endpoint :', options.endpoint);
    // console.log('DecodeBody :', options.decodeBody);

    // console.log('Stringify :', self.stringifyQuery( options.params ));

    var reqOptions = {
        method: options.verb,
        host: options.bucketName ? options.bucketName + '.' + options.endpoint : options.endpoint,
        path: '/' + ( options.objectName ? options.objectName : '' ) + '?' + self.stringifyQuery( options.params ),
        headers: options.headers,
    };

    // console.log('ReqOptions :', reqOptions);

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
            // For some reason, with DeleteObject, both the 'end' and then this 'close' is called ... I'm really not
            // sure why but I presume it should be one or the other - not both!
            //
            // If we have already called the callback, then don't call this here!
            if ( called ) {
                return;
            }

            called = true;
            callback(err, null);
        });

        // when we get our data back, then decode it
        res.on('end', function() {
            // used when _not_ decoding the body, but declared here since it's the top of the function :)
            var result = {};

            // first thing we check is the return code
            if ( res.statusCode !== options.statusCode ) {
                // decode the returned XML
                parser.parseString(resBody, _.once(function (err, result) {
                    if ( err ) {
                        // error parsing the XML will be an error
                        called = true;
                        callback({
                            Code : 'AwsSum',
                            Message : 'Failed to Parse the XML: ' + err.message,
                            OriginalError : err
                        }, null);
                        return;
                    }

                    // if we didn't receive XML with this response, make an empty object for the headers below
                    if ( _.isNull(result) ) {
                        result = {};
                    }

                    // make sure we put the headers into the error
                    self.putResponseHeadersIntoObject(res, result);
                    called = true;
                    callback( result, null );
                }));
                return;
            }

            // the returned statusCode is what we expect, so check whether we should parse or leave the body alone
            if ( options.decodeBody ) {
                // ok, parse out the result
                parser.parseString(resBody, _.once(function (err, result) {
                    if ( err ) {
                        // error parsing the XML will be an error
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

                    // get the pertinent headers out of the result
                    self.putResponseHeadersIntoObject(res, result);

                    // console.log('Result :', result);
                    called = true;
                    callback(null, result);
                }));
            }
            else {
                // get the pertinent headers out of the result
                self.putResponseHeadersIntoObject(res, result);

                // we've been asked _not_ to decode the body, so just return it
                result.Body = resBody;

                callback( null, result );
                return;
            }
        });
    });

    // if there is an error with the formation of the request, call the callback
    req.on('error', function(err) {
        // console.log('Got an error - RIGHT HERE');
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
            callback({ Code : 'AwsSumCheck', Message : 'Provide a BucketName' }, null);
            return;
        }

        this.performRequest({
            bucketName : options.BucketName,
            params : params
        }, callback);
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

    this.performRequest({}, callback);
};

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketDELETE.html
S3.prototype.deleteBucket = function(options, callback) {
    var self = this;
    if ( callback == null ) {
        callback = options;
        options = {};
    }
    options = options || {};

    // check we have a BucketName
    if ( _.isUndefined(options.BucketName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a BucketName' }, null);
        return;
    }

    this.performRequest({
        bucketName : options.BucketName,
        verb : 'DELETE'
    }, callback);
}

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketDELETEpolicy.html
S3.prototype.deleteBucketPolicy = function(options, callback) {
    var self = this;
    if ( callback == null ) {
        callback = options;
        options = {};
    }
    options = options || {};

    // check we have a BucketName
    if ( _.isUndefined(options.BucketName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a BucketName' }, null);
        return;
    }

    var params = [{ name : 'policy' }];
    this.performRequest({
        bucketName : options.BucketName,
        verb : 'DELETE',
        params : params,
    }, callback);
}

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketDELETEwebsite.html
S3.prototype.deleteBucketWebsite = function(options, callback) {
    var self = this;
    if ( callback == null ) {
        callback = options;
        options = {};
    }
    options = options || {};

    // check we have a BucketName
    if ( _.isUndefined(options.BucketName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a BucketName' }, null);
        return;
    }

    var params = [{ name : 'website' }];
    this.performRequest({
        bucketName : options.BucketName,
        verb : 'DELETE',
        params : params,
    }, callback);
}

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
        callback({ Code : 'AwsSumCheck', Message : 'Provide a BucketName' }, null);
        return;
    }

    // do any other params
    var params = [];
    self.addParamIfDefined(params, 'marker', options.Marker);
    self.addParamIfDefined(params, 'max-keys', options.MaxKeys);
    self.addParamIfDefined(params, 'delimiter', options.Delimiter);
    self.addParamIfDefined(params, 'prefix', options.Prefix);

    this.performRequest({
        bucketName : options.BucketName,
        params : params,
    }, callback);
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
        callback({ Code : 'AwsSumCheck', Message : 'Provide a BucketName' }, null);
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

    this.performRequest({
        bucketName : options.BucketName,
        params : params,
    }, callback);
}

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTrequestPaymentGET.html
S3.prototype.getBucketRequestPayment = makeGetBucketWithSubresource('requestPayment');

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETversioningStatus.html
S3.prototype.getBucketVersioning = makeGetBucketWithSubresource('versioning');

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETwebsite.html
S3.prototype.getBucketWebsite = makeGetBucketWithSubresource('website');

// http://docs.amazonwebservices.com/AmazonS3/latest/API/mpUploadListMPUpload.html
S3.prototype.listMultipartUploads = function(options, callback) {
    var self = this;
    if ( callback == null ) {
        callback = options;
        options = {};
    }
    options = options || {};

    // check we have a BucketName
    if ( _.isUndefined(options.BucketName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a BucketName' }, null);
        return;
    }

    var params = [];
    params.push({ name : 'uploads' });

    // set the other params if there are any
    self.addParamIfDefined(params, 'delimiter', options.Delimiter);
    self.addParamIfDefined(params, 'max-uploads', options.MaxUploads);
    self.addParamIfDefined(params, 'key-marker', options.KeyMarker);
    self.addParamIfDefined(params, 'prefix', options.Prefix);
    self.addParamIfDefined(params, 'upload-id-marker', options.UploadIdMarker);

    this.performRequest({
        bucketName : options.BucketName,
        params : params,
    }, callback);
};

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUT.html
S3.prototype.createBucket = function(options, callback) {
    var self = this;
    if ( callback == null ) {
        callback = options;
        options = {};
    }
    options = options || {};

    // check we have a BucketName
    if ( _.isUndefined(options.BucketName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a BucketName' }, null);
        return;
    }

    // set some headers
    var headers = {};

    // see if we have an Acl for this bucket
    if ( ! _.isUndefined(options.Acl) ) {
        headers['x-amz-acl'] = options.Acl;
    }

    // for this request, we may have to create some XML if the region is something other than amazon.US_EAST_1
    var body;
    if ( locationConstraint[self.region()] ) {
        body = XML({
            CreateBucketConfiguration : [
                { _attr : { 'xmlns' : 'http://s3.amazonaws.com/doc/2006-03-01/' } },
                { LocationConstraint : locationConstraint[self.region()] },
            ]
        });
    }

    this.performRequest({
        bucketName : options.BucketName,
        verb : 'PUT',
        headers : headers,
        body : body,
        // HACK: due to the fact that all 'CreateBucket' operation should go to US_EAST_1, we need to overwrite the
        // endpoint we're going to use ... that's pretty awesome!
        endpoint : endPoint[amazon.US_EAST_1],
    }, callback);
};

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUTacl.html
// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUTpolicy.html
// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUTlogging.html
// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUTnotification.html
// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTrequestPaymentPUT.html
// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUTVersioningStatus.html

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUTwebsite.html
S3.prototype.putBucketWebsite = function(options, callback) {
    var self = this;
    if ( callback == null ) {
        callback = options;
        options = {};
    }
    options = options || {};

    // check we have a BucketName
    if ( _.isUndefined(options.BucketName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a BucketName' }, null);
        return;
    }

    // check we have an IndexDocument
    if ( _.isUndefined(options.IndexDocument) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide an IndexDocument' }, null);
        return;
    }

    var params = [{ name : 'website' }];

    var cfg = {
        WebsiteConfiguration : [
            { _attr : { 'xmlns' : 'http://s3.amazonaws.com/doc/2006-03-01/' } },
            { IndexDocument : [
                { Suffix : options.IndexDocument }
            ]},
        ]
    };

    // see if we have been given an ErrorDocument
    if ( ! _.isUndefined(options.ErrorDocument) ) {
        cfg.WebsiteConfiguration.push({
            ErrorDocument : [
                { Key : options.ErrorDocument }
            ]
        });
    }

    // create the XML
    var body = XML(cfg);

    // perform the request
    this.performRequest({
        bucketName : options.BucketName,
        verb : 'PUT',
        params : params,
        body : body,
    }, callback);
};

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectDELETE.html
S3.prototype.deleteObject = function(options, callback) {
    var self = this;
    if ( callback == null ) {
        callback = options;
        options = {};
    }
    options = options || {};

    // check we have a BucketName
    if ( _.isUndefined(options.BucketName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a BucketName' }, null);
        return;
    }

    // check we have an ObjectName
    if ( _.isUndefined(options.ObjectName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide an ObjectName' }, null);
        return;
    }

    // do all headers (optional)
    var headers = {};
    self.addHeaderIfDefined( headers, 'x-amz-mfa', options.Mfa );

    // now do the subresource (if we have a VersionId)
    var params = [];
    this.addParamIfDefined(params, 'versionId', options.VersionId);

    // perform the request
    this.performRequest({
        bucketName : options.BucketName,
        objectName : options.ObjectName,
        verb : 'DELETE',
        headers : headers,
        params : params,
        status : 204,
    }, callback);
};

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectGET.html
S3.prototype.getObject = function(options, callback) {
    var self = this;
    if ( callback == null ) {
        callback = options;
        options = {};
    }
    options = options || {};

    // check we have a BucketName
    if ( _.isUndefined(options.BucketName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a BucketName' }, null);
        return;
    }

    // check we have an ObjectName
    if ( _.isUndefined(options.ObjectName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide an ObjectName' }, null);
        return;
    }

    // request headers
    var headers = {};
    // Range would usually be something like 'range=...', such as 'range=0-500'
    self.addHeaderIfDefined( headers, 'Range',               options.Range             );
    self.addHeaderIfDefined( headers, 'If-Modified-Since',   options.IfModifiedSince   );
    self.addHeaderIfDefined( headers, 'If-Unmodified-Since', options.IfUnmodifiedSince );
    self.addHeaderIfDefined( headers, 'If-Match',            options.IfMatch           );
    self.addHeaderIfDefined( headers, 'If-None-Match',       options.IfNoneMatch       );

    // allow the user to override these returned response headers
    var params = [];
    self.addParamIfDefined( params, 'response-content-type',        options.ResponseContentType        );
    self.addParamIfDefined( params, 'response-content-language',    options.ResponseContentLanguage    );
    self.addParamIfDefined( params, 'response-expires',             options.ResponseExpires            );
    self.addParamIfDefined( params, 'response-cache-control',       options.ResponseCacheControl       );
    self.addParamIfDefined( params, 'response-content-disposition', options.ResponseContentDisposition );
    self.addParamIfDefined( params, 'response-content-encoding',    options.ResponseContentEncoding    );

    // perform the request
    this.performRequest({
        bucketName : options.BucketName,
        objectName : options.ObjectName,
        verb : 'GET',
        headers : headers,
        params : params,
        decodeBody : false, // tells performRequest() not to decode the body since it isn't XML
    }, callback);
}

// ToDo: RESTObjectGETacl.html
// ToDo: RESTObjectGETtorrent.html

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectHEAD.html
S3.prototype.objectMetadata = function(options, callback) {
    var self = this;
    if ( callback == null ) {
        callback = options;
        options = {};
    }
    options = options || {};

    // check we have a BucketName
    if ( _.isUndefined(options.BucketName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a BucketName' }, null);
        return;
    }

    // check we have an ObjectName
    if ( _.isUndefined(options.ObjectName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide an ObjectName' }, null);
        return;
    }

    // firstly, do the headers (all optional)
    var headers = {};
    self.addHeaderIfDefined( headers, 'Range',             options.Range             );
    self.addHeaderIfDefined( headers, 'IfModifiedSince',   options.IfModifiedSince   );
    self.addHeaderIfDefined( headers, 'IfUnmodifiedSince', options.IfUnmodifiedSince );
    self.addHeaderIfDefined( headers, 'IfMatch',           options.IfMatch           );
    self.addHeaderIfDefined( headers, 'IfNoneMatch',       options.IfNoneMatch       );

    // perform the request
    this.performRequest({
        bucketName : options.BucketName,
        objectName : options.ObjectName,
        verb : 'HEAD',
        headers : headers,
    }, callback);
};

// ToDo: RESTObjectPOST.html

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectPUT.html
S3.prototype.putObject = function(options, callback) {
    var self = this;
    if ( callback == null ) {
        callback = options;
        options = {};
    }
    options = options || {};

    // check we have a BucketName
    if ( _.isUndefined(options.BucketName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a BucketName' }, null);
        return;
    }

    // check we have an ObjectName
    if ( _.isUndefined(options.ObjectName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide an ObjectName' }, null);
        return;
    }

    // check we have a ContentLength
    if ( _.isUndefined(options.ContentLength) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a ContentLength' }, null);
        return;
    }

    // firstly, do the headers
    var headers = {};
    self.addHeader(headers, 'Content-Length', options.ContentLength);

    // now the optional ones
    self.addHeaderIfDefined( headers, 'Cache-Control',                options.CacheControl         );
    self.addHeaderIfDefined( headers, 'Content-Disposition',          options.ContentDisposition   );
    self.addHeaderIfDefined( headers, 'Content-Encoding',             options.ContentEncoding      );
    self.addHeaderIfDefined( headers, 'Content-MD5',                  options.ContentMd5           );
    self.addHeaderIfDefined( headers, 'Content-Type',                 options.ContentType          );
    self.addHeaderIfDefined( headers, 'Expect',                       options.Expect               );
    self.addHeaderIfDefined( headers, 'Expires',                      options.Expires              );
    self.addHeaderIfDefined( headers, 'x-amz-acl',                    options.Acl                  );
    self.addHeaderIfDefined( headers, 'x-amz-meta',                   options.Meta                 );
    self.addHeaderIfDefined( headers, 'x-amz-server-side-encryption', options.ServerSideEncryption );
    self.addHeaderIfDefined( headers, 'x-amz-storage-class',          options.StorageClass         );

    // ToDo: how do we do a body, stream or pipe!

    // perform the request
    this.performRequest({
        bucketName : options.BucketName,
        objectName : options.ObjectName,
        verb : 'PUT',
        headers : headers,
        body : options.Body, // ToDo: or indeed, something better than this!!!
    }, callback);
}

// ToDo: RESTObjectPUTacl.html

// http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectCOPY.html
S3.prototype.copyObject = function(options, callback) {
    var self = this;
    if ( callback == null ) {
        callback = options;
        options = {};
    }
    options = options || {};

    // check we have a BucketName
    if ( _.isUndefined(options.BucketName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a BucketName' }, null);
        return;
    }

    // check we have an ObjectName
    if ( _.isUndefined(options.ObjectName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide an ObjectName' }, null);
        return;
    }

    // check we have a SourceBucket
    if ( _.isUndefined(options.SourceBucket) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a SourceBucket' }, null);
        return;
    }

    // check we have a SourceObject
    if ( _.isUndefined(options.SourceObject) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a SourceObject' }, null);
        return;
    }

    // firstly, do the headers
    var headers = {};
    self.addHeader(headers, 'x-amz-copy-source', '/' + options.SourceBucket + '/' + options.SourceObject);

    // now the optional ones
    self.addHeaderIfDefined( headers, 'x-amz-acl',                             options.Acl                         );
    self.addHeaderIfDefined( headers, 'x-amz-metadata-directive',              options.MetadataDirective           );
    self.addHeaderIfDefined( headers, 'x-amz-copy-source-if-match',            options.CopySourceIfMatch           );
    self.addHeaderIfDefined( headers, 'x-amz-copy-source-if-none-match',       options.CopySourceIfNoneMatch       );
    self.addHeaderIfDefined( headers, 'x-amz-copy-source-if-unmodified-since', options.CopySourceIfUnmodifiedSince );
    self.addHeaderIfDefined( headers, 'x-amz-copy-source-if-modified-since',   options.CopySourceIfModifiedSince   );
    self.addHeaderIfDefined( headers, 'x-amz-server-side-encryption',          options.ServerSideEncryption        );
    self.addHeaderIfDefined( headers, 'x-amz-storage-class',                   options.StorageClass                );

    // HACK FOR AWS: When doing a request to CopyObject, AWS fails when sending a header of 'Content-Encoding=chunked'
    // which is Nodes default way of doing requests. ("A header you provided implies functionality that is not
    // implemented (Transfer-Encoding).") To work around this, we set a Content-Length of 0 so that the
    // 'Content-Encoding' header is not sent.
    //
    // Note: Found this after I figured out a solution : https://forums.aws.amazon.com/thread.jspa?threadID=50772
    self.addHeader( headers, 'Content-Length', 0 );

    // ToDo: Note that this operation may fail _during_ the copy, in which case the fail is returned in the body of the
    // response (with a 200) rather than in the headers. This should be added to performRequest() somehow!!!

    // perform the request
    this.performRequest({
        bucketName : options.BucketName,
        objectName : options.ObjectName,
        verb : 'PUT',
        headers : headers,
    }, callback);
}

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
