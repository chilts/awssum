// --------------------------------------------------------------------------------------------------------------------
//
// elasticache.js - class for AWS Elasticache
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

// our own
var amazon = require('./amazon');

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 'elasticache: ';

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html
var endPoint = {};
endPoint[amazon.US_EAST_1]      = "elasticache.us-east-1.amazonaws.com";
// endPoint[amazon.US_WEST_1]      = "...";
// endPoint[amazon.US_WEST_2]      = "...";
// endPoint[amazon.EU_WEST_1]      = "...";
// endPoint[amazon.AP_SOUTHEAST_1] = "...";
// endPoint[amazon.AP_NORTHEAST_1] = "...";
// endPoint[amazon.US_GOVCLOUD_1]  = "...";

var version = '2011-07-15';

// --------------------------------------------------------------------------------------------------------------------
// constructor

var ElastiCache = function(accessKeyId, secretAccessKey, awsAccountId, region) {
    var self = this;

    // call the superclass for initialisation
    ElastiCache.super_.call(this, accessKeyId, secretAccessKey, awsAccountId, region);

    // check the region is valid
    if ( ! endPoint[region] ) {
        throw MARK + "invalid region '" + region + "'";
    }

    return self;
};

// inherit from Amazon
util.inherits(ElastiCache, amazon.Amazon);

// --------------------------------------------------------------------------------------------------------------------
// methods we need to implement from awssum.js/amazon.js

ElastiCache.prototype.host = function() {
    return endPoint[this.region()];
};

ElastiCache.prototype.version = function() {
    return version;
}

// --------------------------------------------------------------------------------------------------------------------
// operations on the service

// This list from: http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_Operations.html

// http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheClusters.html
ElastiCache.prototype.describeCacheClusters = function(args, callback) {
    var self = this;
    if ( callback == null ) {
        callback = args;
        args = {};
    }
    args = args || {};

    // our list of params to this operation
    var params = [];

    self.addParamIfDefined( params, 'CacheClusterId',    args.CacheClusterId    );
    self.addParamIfDefined( params, 'Marker',            args.Marker            );
    self.addParamIfDefined( params, 'MaxRecords',        args.MaxRecords        );
    self.addParamIfDefined( params, 'ShowCacheNodeInfo', args.ShowCacheNodeInfo );

    self.addParam( params, 'Action', 'DescribeCacheClusters' );
    self.performRequest({ params : params, }, callback);
};

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.ElastiCache = ElastiCache;

// --------------------------------------------------------------------------------------------------------------------
