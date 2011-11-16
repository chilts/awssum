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

Route53.prototype.host = function() {
    return endPoint[this.region()];
};

// From: http://docs.amazonwebservices.com/Route53/latest/APIReference/Headers.html
//
// Adds the common headers to this request.
Route53.prototype.addCommonOptions = function(options) {
    var self = this;

    // add in the date
    var date = (new Date).toString();
    options.headers.Date = dateFormat(new Date(), "UTC:ddd, dd mmm yyyy HH:MM:ss Z");
};

Route53.prototype.version = function() {
    return version;
};

// From: http://docs.amazonwebservices.com/Route53/latest/DeveloperGuide/RESTAuthentication.html#StringToSign
//
// Returns a strToSign for this request.
Route53.prototype.strToSign = function(options) {
    var self = this;
    return options.headers.Date;
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
        method : 'POST',
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
        method : 'GET',
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
        method : 'DELETE',
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
        method : 'POST',
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
