// --------------------------------------------------------------------------------------------------------------------
//
// cloudfront.js - class for AWS CloudFront
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

// dependencies
var _ = require('underscore');
var dateFormat = require('dateformat');

// our own
var amazon = require('./amazon');
var operations = require('./cloudfront-config');

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 'cloudfront: ';

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html
var endPoint = {};
endPoint[amazon.US_EAST_1]      = "cloudfront.amazonaws.com";
// endPoint[amazon.US_WEST_1]      = "...";
// endPoint[amazon.US_WEST_2]      = "...";
// endPoint[amazon.EU_WEST_1]      = "...";
// endPoint[amazon.AP_SOUTHEAST_1] = "...";
// endPoint[amazon.AP_NORTHEAST_1] = "...";
// endPoint[amazon.US_GOVCLOUD_1]  = "...";

var version = '2010-11-01';

// --------------------------------------------------------------------------------------------------------------------
// constructor

var CloudFront = function(accessKeyId, secretAccessKey, awsAccountId, region) {
    var self = this;

    // call the superclass for initialisation
    CloudFront.super_.call(this, accessKeyId, secretAccessKey, awsAccountId, region);

    // check the region is valid
    if ( ! endPoint[region] ) {
        throw MARK + "invalid region '" + region + "'";
    }

    return self;
};

// inherit from Amazon
util.inherits(CloudFront, amazon.Amazon);

// --------------------------------------------------------------------------------------------------------------------
// methods we need to implement from awssum.js/amazon.js

CloudFront.prototype.host = function() {
    return endPoint[this.region()];
};

CloudFront.prototype.version = function() {
    return version;
}

// From: http://docs.amazonwebservices.com/AmazonCloudFront/latest/DeveloperGuide/RESTAuthentication.html
//
// Adds the common headers to this request.
CloudFront.prototype.addCommonOptions = function(options) {
    var self = this;

    // add in the date
    var date = (new Date).toUTCString();
    options.headers.Date = dateFormat(new Date(), "UTC:ddd, dd mmm yyyy HH:MM:ss Z");
};

// From: http://docs.amazonwebservices.com/AmazonCloudFront/latest/DeveloperGuide/RESTAuthentication.html
//
// Returns a strToSign for this request.
CloudFront.prototype.strToSign = function(options) {
    var self = this;
    return options.headers.Date;
};

CloudFront.prototype.signature = function(strToSign) {
    var self = this;

    // sign the request string
    var signature = crypto
        .createHmac('sha1', self.secretAccessKey())
        .update(strToSign)
        .digest('base64');

    // console.log('Signature :', signature);

    return signature;
}

// From: http://docs.amazonwebservices.com/AmazonCloudFront/latest/DeveloperGuide/RESTAuthentication.html
//
// Adds the signature to the request.
CloudFront.prototype.addSignature = function(options, signature) {
    var self = this;
    options.headers['Authorization'] = 'AWS ' + self.accessKeyId() + ':' + signature;
};

// --------------------------------------------------------------------------------------------------------------------
// operations on the service

// generic handler for this service
function makeOperation(name) {
    var operation = operations[name];
    return function(args, callback) {
        var self = this;
        if ( callback == null ) {
            callback = args;
            args = {};
        }
        args = args || {};

        // our list of params to this operation
        var params = [];
        var headers = {};

        // loop through all the possible argNames in this operation
        for ( var argName in operation.args ) {
            var spec = operation.args[argName];

            // see if this is required
            if ( spec.required && _.isUndefined(args[argName]) ) {
                callback({ Code : 'AwsSumCheck', Message : 'Provide a ' + argName });
                return;
            }

            // if this is a param type, add it there
            if ( spec.type === 'param' ) {
                self.addParamIfDefined( params, argName, args[argName] );
            }
            else if ( spec.type === 'array' ) {
                self.addArrayParam( params, argName, args[argName], 'member' );
            }
            else if ( spec.type === 'header' ) {
                self.setHeaderIfDefined( headers, argName, args[argName] );
            }
            else if ( spec.type === 'special' ) {
                // this will be dealth with specifically later on - all ok
            }
            else {
                // since this is a program error, we're gonna throw this one
                throw 'Unknown argument type : ' + spec.type;
            }
        }

        // build the path
        var path;
        if ( operation.path ) {
            if ( typeof operation.path === 'function' ) {
                path = operation.path.apply(self, [ args ]);
            }
            else if ( typeof operation.path === 'string' ) {
                path = operation.path;
            }
            else {
                // since this is a program error, we're gonna throw this one
                throw 'Unknown path type : ' + typeof operation.path;
            }
        }
        else {
            path = '/' + self.version() + '/distribution';
            if ( args.DistributionId ) {
                path += '/' + args.DistributionId;
            }
        }

        // now send the request
        self.performRequest({
            method     : operation.method || 'GET',
            path       : path,
            headers    : headers,
            params     : params,
            statusCode : operation.statusCode || 200,
        }, callback);
    };
};

// From : http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/

CloudFront.prototype.ListDistributions     = makeOperation('ListDistributions');
CloudFront.prototype.GetDistribution       = makeOperation('GetDistribution');
CloudFront.prototype.GetDistributionConfig = makeOperation('GetDistributionConfig');
CloudFront.prototype.DeleteDistribution = makeOperation('DeleteDistribution');

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.CloudFront = CloudFront;

// --------------------------------------------------------------------------------------------------------------------
