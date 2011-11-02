// --------------------------------------------------------------------------------------------------------------------
//
// ec2.js - class for AWS Elastic Load Balancing
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

// dependencies
var _ = require('underscore');
var dateFormat = require('dateformat');

// our own
var amazon = require('./amazon');

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 'ec2: ';

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html
var endPoint = {};
endPoint[amazon.US_EAST_1]      = "ec2.us-east-1.amazonaws.com";
endPoint[amazon.US_WEST_1]      = "ec2.us-west-1.amazonaws.com";
endPoint[amazon.EU_WEST_1]      = "ec2.eu-west-1.amazonaws.com";
endPoint[amazon.AP_SOUTHEAST_1] = "ec2.ap-southeast-1.amazonaws.com";
endPoint[amazon.AP_NORTHEAST_1] = "ec2.ap-northeast-1.amazonaws.com";
endPoint[amazon.US_GOVCLOUD_1]  = "ec2.us-gov-west-1.amazonaws.com";

var version = '2011-07-15';

// --------------------------------------------------------------------------------------------------------------------
// constructor

var Ec2 = function(accessKeyId, secretAccessKey, awsAccountId, region) {
    var self = this;

    // call the superclass for initialisation
    Ec2.super_.call(this, accessKeyId, secretAccessKey, awsAccountId, region);

    // check the region is valid
    if ( ! endPoint[region] ) {
        throw MARK + "invalid region '" + region + "'";
    }

    return self;
};

// inherit from Amazon
util.inherits(Ec2, amazon.Amazon);

// --------------------------------------------------------------------------------------------------------------------
// methods we need to implement from awssum.js/amazon.js

Ec2.prototype.signatureVersion = function() {
    return signatureVersion;
};

Ec2.prototype.signatureMethod = function() {
    return signatureMethod;
};

Ec2.prototype.endPoint = function() {
    return endPoint[this.region()];
};

Ec2.prototype.verb = function() {
    return 'GET';
}

Ec2.prototype.version = function() {
    return version;
}

// From: http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/Query-Common-Parameters.html
//
// Adds the common headers and parameters.
Ec2.prototype.addCommonArgs = function(options) {
    // for ec2
    var date = dateFormat(new Date(), "UTC:ddd, dd mmm yyyy HH:MM:ss Z");
    self.addParam( options.params, 'Timestamp', date );
    self.addParam( options.params, 'Version', self.version() );
}

// --------------------------------------------------------------------------------------------------------------------
// operations on the service

// This list from: http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/query-apis.html

// http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeInstances.html
Ec2.prototype.describeInstances = function(args, callback) {
    var self = this;
    if ( callback == null ) {
        callback = args;
        args = {};
    }
    args = args || {};

    // our list of params to this operation
    var params = [];

    // loop through all our instances
    var n = 0;
    _.each(args.instanceIds, function(id) {
        self.addParam( params, 'InstanceId.' + n, id );
        n++;
    });

    // loop through all the filters
    n = 0;
    _.each(args.filters, function(values, name) {
        var m = 0;
        if ( typeof values === 'string' ) {
            self.addParam( params, 'Filter.' + n + '.Name', name );
            self.addParam( params, 'Filter.' + n + '.Value.1', value );
        }
        else {
            _.each(values, function(value) {
                self.addParam( params, 'Filter.' + n + '.Name', name );
                self.addParam( params, 'Filter.' + n + '.Value.' + m, value );
                m++;
            });
        }
    });

    self.performNewRequest({
        action : 'DescribeInstances',
        params : params,
    }, callback);
};

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.Ec2 = Ec2;

// --------------------------------------------------------------------------------------------------------------------
