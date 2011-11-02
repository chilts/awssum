// --------------------------------------------------------------------------------------------------------------------
//
// route53.js - class for AWS Route 53
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
var data2xml = require('data2xml').data2xml;

// our own
var amazon = require('./amazon');

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 'route53: ';

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html
var endPoint = {};
endPoint[amazon.US_EAST_1]      = "route53.amazonaws.com";
// endPoint[amazon.US_WEST_1]      = "...";
// endPoint[amazon.EU_WEST_1]      = "...";
// endPoint[amazon.AP_SOUTHEAST_1] = "...";
// endPoint[amazon.AP_NORTHEAST_1] = "...";
// endPoint[amazon.US_GOVCLOUD_1]  = "...";

var version = '2011-05-05';
var signatureMethod = 'HmacSHA256';
var signatureVersion = 2;

// create our XML parser
var parser = new xml2js.Parser({ normalize : false, trim : false, explicitRoot : true });

// --------------------------------------------------------------------------------------------------------------------
// constructor

var Route53 = function(accessKeyId, secretAccessKey, awsAccountId, region) {
    var self = this;

    // call the superclass for initialisation
    Route53.super_.call(this, accessKeyId, secretAccessKey, awsAccountId, region);

    // check the region is valid
    if ( ! endPoint[region] ) {
        throw MARK + "invalid region '" + region + "'";
    }

    return self;
};

// inherit from Amazon
util.inherits(Route53, amazon.Amazon);

// --------------------------------------------------------------------------------------------------------------------
// methods we need to implement from amazon.js

Route53.prototype.signatureVersion = function() {
    return signatureVersion;
};

Route53.prototype.signatureMethod = function() {
    return signatureMethod;
};

Route53.prototype.endPoint = function() {
    return endPoint[this.region()];
};

Route53.prototype.version = function() {
    return version;
};

// From: http://docs.amazonwebservices.com/Route53/latest/APIReference/Headers.html
//
// Adds the common headers to this request.
Route53.prototype.addCommonHeaders = function(options) {
    var self = this;

    // add in the date
    var date = (new Date).toString();
    options.headers.Date = dateFormat(new Date(), "UTC:ddd, dd mmm yyyy HH:MM:ss Z");
};

// From: http://docs.amazonwebservices.com/Route53/latest/DeveloperGuide/RESTAuthentication.html#StringToSign
//
// Returns a strToSign for this request.
Route53.prototype.strToSign = function(options) {
    var self = this;
    return options.headers.Date;
};

// From: http://docs.amazonwebservices.com/Route53/latest/DeveloperGuide/RESTAuthentication.html#Signature
//
// Returns a signature for this request.
Route53.prototype.signature = function(strToSign) {
    // sign the request string
    var signature = crypto
        .createHmac('sha256', this.secretAccessKey())
        .update(strToSign)
        .digest('base64');

    // console.log('Signature :', signature);

    return signature;
};

// From: http://docs.amazonwebservices.com/Route53/latest/DeveloperGuide/RESTAuthentication.html#AuthorizationHeader
//
// Adds the signature to the request.
Route53.prototype.addSignature = function(options, signature) {
    var self = this;
    options.headers['X-Amzn-Authorization'] = 'AWS3-HTTPS AWSAccessKeyId=' + self.accessKeyId()
        + ',Algorithm=' + self.signatureMethod()
        + ',Signature=' + signature;
};

// Make this performRequest() quite generic.
Route53.prototype.performRequest = function(options, callback) {
    var self = this;

    // set some defaults on the various input params
    options.verb    = options.verb || 'GET';
    options.host    = options.host || self.endPoint();
    options.path    = options.path || '/';
    options.headers = options.headers || {};
    options.params  = options.params || [];
    // none for options.body
    options.statusCode = options.statusCode || 200;
    if ( _.isUndefined(options.decodeBody) ) {
        // only false for getObject(...)
        options.decodeBody = true;
    }

    // add common headers and then sign the request
    self.addCommonHeaders(options);
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

    var req = https.request(reqOptions, function(res) {
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

                    // console.log('Result :', result);
                    called = true;
                    callback(null, result);
                }));
            }
            else {
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
// operations on the service

// This list from: http://docs.amazonwebservices.com/Route53/latest/APIReference/ActionsOnZones.html
//
// * http://docs.amazonwebservices.com/Route53/latest/APIReference/API_CreateHostedZone.html
// * http://docs.amazonwebservices.com/Route53/latest/APIReference/API_GetHostedZone.html
// * http://docs.amazonwebservices.com/Route53/latest/APIReference/API_DeleteHostedZone.html
// * http://docs.amazonwebservices.com/Route53/latest/APIReference/API_ListHostedZones.html
//
// This list from: http://docs.amazonwebservices.com/Route53/latest/APIReference/ActionsOnRRS.html
//
// * http://docs.amazonwebservices.com/Route53/latest/APIReference/API_ChangeResourceRecordSets.html
// * http://docs.amazonwebservices.com/Route53/latest/APIReference/API_ListResourceRecordSets.html
// * http://docs.amazonwebservices.com/Route53/latest/APIReference/API_GetChange.html

// http://docs.amazonwebservices.com/Route53/latest/APIReference/API_CreateHostedZone.html
Route53.prototype.createHostedZone = function(args, callback) {
    var self = this;
    if ( callback == null ) {
        callback = args;
        args = {};
    }
    args = args || {};

    // check we have a Name
    if ( _.isUndefined(args.name) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a name' }, null);
        return;
    }

    // check we have a CallerReference
    if ( _.isUndefined(args.callerReference) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a callerReference' }, null);
        return;
    }

    // create the XML
    var body = data2xml('CreateHostedZoneRequest', {
        _attr : { 'xmlns' : 'https://route53.amazonaws.com/doc/2011-05-05/' },
        Name : args.name,
        CallerReference : args.callerReference,
        HostedZoneConfig : {
            Comment : args.comment,
        },
    });

    console.log('XML :', body);

    this.performRequest({
        verb : 'POST',
        path : '/' + self.version() + '/hostedzone',
        body : body,
        statusCode : 201,
    }, callback);
};

// http://docs.amazonwebservices.com/Route53/latest/APIReference/API_GetHostedZone.html
Route53.prototype.getHostedZone = function(args, callback) {
    var self = this;
    if ( callback == null ) {
        callback = args;
        args = {};
    }
    args = args || {};

    // check we have a HostedZoneId
    if ( _.isUndefined(args.hostedZoneId) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a hostedZoneId' }, null);
        return;
    }

    this.performRequest({
        verb : 'GET',
        path : '/' + self.version() + '/hostedzone/' + args.hostedZoneId,
    }, callback);
};

// http://docs.amazonwebservices.com/Route53/latest/APIReference/API_DeleteHostedZone.html
Route53.prototype.deleteHostedZone = function(args, callback) {
    var self = this;
    if ( callback == null ) {
        callback = args;
        args = {};
    }
    args = args || {};

    // check we have a HostedZoneId
    if ( _.isUndefined(args.hostedZoneId) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a hostedZoneId' }, null);
        return;
    }

    this.performRequest({
        verb : 'DELETE',
        path : '/' + self.version() + '/hostedzone/' + args.hostedZoneId,
    }, callback);
};

// http://docs.amazonwebservices.com/Route53/latest/APIReference/API_ListHostedZones.html
Route53.prototype.listHostedZones = function(args, callback) {
    var self = this;
    if ( callback == null ) {
        callback = args;
        args = {};
    }
    args = args || {};

    var params = [];
    self.addParamIfDefined( params, 'Marker',   args.marker   );
    self.addParamIfDefined( params, 'MaxItems', args.maxItems );

    this.performRequest({
        path : '/' + self.version() + '/hostedzone',
        params : params,
    }, callback);
};

// http://docs.amazonwebservices.com/Route53/latest/APIReference/API_ChangeResourceRecordSets.html
Route53.prototype.changeResourceRecordSets = function(args, callback) {
    var self = this;
    if ( callback == null ) {
        callback = args;
        args = {};
    }
    args = args || {};

    // check we have a HostedZoneId
    if ( _.isUndefined(args.hostedZoneId) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a hostedZoneId' }, null);
        return;
    }

    var params = [];
    // self.addParamIfDefined( params, 'comment', args.comment );

    // create the data structure for the XML
    var data = {
        _attr : { 'xmlns' : 'https://route53.amazonaws.com/doc/2011-05-05/' },
        ChangeBatch : {
            Changes : {
                Change : [],
            }
        }
    };

    // add the comment if we have one
    if ( ! _.isUndefined(args.comment) ) {
        data.ChangeBatch.Comment = args.comment;
    }

    _.each(args.changes, function(change) {
        var c = {
            Action : change.action,
            ResourceRecordSet : {
                Name : change.name,
                Type : change.type,
                TTL : change. ttl,
                ResourceRecords : {
                    ResourceRecord : {
                        Value : [],
                    },
                },
            },
        };

        // now add each resource record
        _.each(change.resourceRecords, function(rr) {
            c.ResourceRecordSet.ResourceRecords.ResourceRecord.Value.push(rr);
        });

        // push this onto the Change array
        data.ChangeBatch.Changes.Change.push(c);
    });

    var body = data2xml('ChangeResourceRecordSetsRequest', data);

    this.performRequest({
        verb : 'POST',
        path : '/' + self.version() + '/hostedzone/' + args.hostedZoneId + '/rrset',
        body : body,
    }, callback);
};

// http://docs.amazonwebservices.com/Route53/latest/APIReference/API_ListResourceRecordSets.html
Route53.prototype.listResourceRecordSets = function(args, callback) {
    var self = this;
    if ( callback == null ) {
        callback = args;
        args = {};
    }
    args = args || {};

    // check we have a HostedZoneId
    if ( _.isUndefined(args.hostedZoneId) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a hostedZoneId' }, null);
        return;
    }

    var params = [];
    self.addParamIfDefined( params, 'name',       args.name );
    self.addParamIfDefined( params, 'type',       args.type );
    self.addParamIfDefined( params, 'identifier', args.identifier );
    self.addParamIfDefined( params, 'maxitems',   args.maxItems ); // yes, the 2nd 'i' should be 'I' - more consistent!

    this.performRequest({
        path : '/' + self.version() + '/hostedzone/' + args.hostedZoneId + '/rrset',
        params : params,
    }, callback);
};

// http://docs.amazonwebservices.com/Route53/latest/APIReference/API_GetChange.html
Route53.prototype.getChange = function(args, callback) {
    var self = this;
    if ( callback == null ) {
        callback = args;
        args = {};
    }
    args = args || {};

    // check we have a ChangeId
    if ( _.isUndefined(args.changeId) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a changeId' }, null);
        return;
    }

    this.performRequest({
        path : '/' + self.version() + '/change/' + args.changeId,
    }, callback);
};

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.Route53 = Route53;

// --------------------------------------------------------------------------------------------------------------------
