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
var operations = require('./elasticache-config');

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 'elasticache: ';

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html
var endPoint = {};
endPoint[amazon.US_EAST_1]      = "elasticache.us-east-1.amazonaws.com";
endPoint[amazon.US_WEST_1]      = "elasticache.us-west-1.amazonaws.com";
// endPoint[amazon.US_WEST_2]      = "...";
endPoint[amazon.EU_WEST_1]      = "elasticache.eu-west-1.amazonaws.com";
endPoint[amazon.AP_SOUTHEAST_1] = "elasticache.ap-southeast-1.amazonaws.com";
endPoint[amazon.AP_NORTHEAST_1] = "elasticache.ap-northeast-1.amazonaws.com";
// endPoint[amazon.US_GOV_WEST_1]  = "...";

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

ElastiCache.prototype.processArgsToParams = function(args, opts, params, callback) {
    var self = this;

    var i, paramName;
    opts.required = opts.required || [];
    opts.optional = opts.optional || [];
    opts.array    = opts.array    || [];

    // all required params
    for ( i = 0; i < opts.required.length; i++ ) {
        paramName = opts.required[i];
        if ( _.isUndefined(args[paramName]) ) {
            callback('Provide a ' + paramName);
            return;
        }
        self.addParam( params, paramName, args[paramName] );
    }

    // all optional params
    for ( i = 0; i < opts.required.length; i++ ) {
        paramName = opts.optional[i];
        self.addParamIfDefined( params, paramName, args[paramName] );
    }

    // all array params
    for ( i = 0; i < opts.array.length; i++ ) {
        paramName = opts.array[i];
        self.addArrayParam( params, paramName, args[paramName], 'member' );
    }

    callback();
}

// generic handler for this service
function makeOperation(name) {
    return function(args, callback) {
        var self = this;
        if ( callback == null ) {
            callback = args;
            args = {};
        }
        args = args || {};

        // our list of params to this operation
        var params = [];
        self.processArgsToParams( args, operations[name], params, function(err) {
            if ( err ) {
                callback({ Code : 'AwsSumCheck', Message : err }, null);
                return;
            }
            self.addParam( params, 'Action', name );
            self.performRequest({ params : params, }, callback);
        });
    };
};

// This list from: http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_Operations.html

// http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_AuthorizeCacheSecurityGroupIngress.html
// http://docs.htmlamazonwebservices.com/AmazonElastiCache/latest/APIReference/API_CreateCacheCluster.html
// http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_CreateCacheParameterGroup.html
// http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_CreateCacheSecurityGroup.html
// http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_DeleteCacheCluster.html
// http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_DeleteCacheParameterGroup.html
// http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_DeleteCacheSecurityGroup.html
// http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheClusters.html
// http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheParameterGroups.html
// http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheParameters.html
// http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheSecurityGroups.html
// http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_DescribeEngineDefaultParameters.html
// http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_DescribeEvents.html
// http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_ModifyCacheCluster.html
// http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_ModifyCacheParameterGroup.html
// http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_RebootCacheCluster.html
// http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_ResetCacheParameterGroup.html
// http://docs.amazonwebservices.com/AmazonElastiCache/latest/APIReference/API_RevokeCacheSecurityGroupIngress.html

ElastiCache.prototype.AuthorizeCacheSecurityGroupIngress = makeOperation('AuthorizeCacheSecurityGroupIngress');
ElastiCache.prototype.CreateCacheCluster                 = makeOperation('CreateCacheCluster');
ElastiCache.prototype.CreateCacheParameterGroup          = makeOperation('CreateCacheParameterGroup');
ElastiCache.prototype.CreateCacheSecurityGroup           = makeOperation('Createcachesecuritygroup');
ElastiCache.prototype.DeleteCacheCluster                 = makeOperation('DeleteCacheCluster');
ElastiCache.prototype.DeleteCacheParameterGroup          = makeOperation('DeleteCacheParameterGroup');
ElastiCache.prototype.DeleteCacheSecurityGroup           = makeOperation('DeleteCacheSecurityGroup');
ElastiCache.prototype.DescribeCacheClusters              = makeOperation('DescribeCacheClusters');
ElastiCache.prototype.DescribeCacheParameterGroups       = makeOperation('DescribeCacheParameterGroups');
ElastiCache.prototype.DescribeCacheParameters            = makeOperation('DescribeCacheParameters');
ElastiCache.prototype.DescribeCacheSecurityGroups        = makeOperation('DescribeCacheSecurityGroups');
ElastiCache.prototype.DescribeEngineDefaultParameters    = makeOperation('DescribeEngineDefaultParameters');
ElastiCache.prototype.DescribeEvents                     = makeOperation('DescribeEvents');
ElastiCache.prototype.ModifyCacheCluster                 = makeOperation('ModifyCacheCluster');
ElastiCache.prototype.ModifyCacheParameterGroup          = makeOperation('ModifyCacheParameterGroup');
ElastiCache.prototype.RebootCacheCluster                 = makeOperation('RebootCacheCluster');
ElastiCache.prototype.ResetCacheParameterGroup           = makeOperation('ResetCacheParameterGroup');
ElastiCache.prototype.RevokeCacheSecurityGroupIngress    = makeOperation('RevokeCacheSecurityGroupIngress');

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.ElastiCache = ElastiCache;

// --------------------------------------------------------------------------------------------------------------------
