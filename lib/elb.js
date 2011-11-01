// --------------------------------------------------------------------------------------------------------------------
//
// elb.js - class for AWS Elastic Load Balancing
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

var MARK = 'elb: ';

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html
var endPoint = {};
endPoint[amazon.US_EAST_1]      = "elasticloadbalancing.us-east-1.amazonaws.com";
endPoint[amazon.US_WEST_1]      = "elasticloadbalancing.us-west-1.amazonaws.com";
endPoint[amazon.EU_WEST_1]      = "elasticloadbalancing.eu-west-1.amazonaws.com";
endPoint[amazon.AP_SOUTHEAST_1] = "elasticloadbalancing.ap-southeast-1.amazonaws.com";
endPoint[amazon.AP_NORTHEAST_1] = "elasticloadbalancing.ap-northeast-1.amazonaws.com";
// US_GOVCLOUD_1 not defined for public consumption

var version = '2011-08-15';

// --------------------------------------------------------------------------------------------------------------------
// constructor

var Elb = function(accessKeyId, secretAccessKey, awsAccountId, region) {
    var self = this;

    // call the superclass for initialisation
    Elb.super_.call(this, accessKeyId, secretAccessKey, awsAccountId, region);

    // check the region is valid
    if ( ! endPoint[region] ) {
        throw MARK + "invalid region '" + region + "'";
    }

    return self;
};

// inherit from Amazon
util.inherits(Elb, amazon.Amazon);

// --------------------------------------------------------------------------------------------------------------------
// methods we need to implement from awssum.js/amazon.js

Elb.prototype.endPoint = function() {
    return endPoint[this.region()];
};

Elb.prototype.verb = function() {
    return 'GET';
}

Elb.prototype.version = function() {
    return version;
}

Elb.prototype.makeErrorFromParsedXml = function(result) {
    return {
        Code : result.ErrorResponse.Error.Code,
        Message : result.ErrorResponse.Error.Message,
        RequestId : result.ErrorResponse.RequestId
    };
}

// --------------------------------------------------------------------------------------------------------------------
// operations on the service

// This list from: http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_Operations.html
//
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_ConfigureHealthCheck.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_CreateAppCookieStickinessPolicy.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_CreateLBCookieStickinessPolicy.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_CreateLoadBalancer.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_CreateLoadBalancerListeners.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_CreateLoadBalancerPolicy.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_DeleteLoadBalancer.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_DeleteLoadBalancerListeners.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_DeleteLoadBalancerPolicy.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_DeregisterInstancesFromLoadBalancer.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_DescribeInstanceHealth.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_DescribeLoadBalancerPolicies.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_DescribeLoadBalancerPolicyTypes.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_DescribeLoadBalancers.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_DisableAvailabilityZonesForLoadBalancer.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_EnableAvailabilityZonesForLoadBalancer.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_RegisterInstancesWithLoadBalancer.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_SetLoadBalancerListenerSSLCertificate.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_SetLoadBalancerPoliciesForBackendServer.html
// * http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_SetLoadBalancerPoliciesOfListener.html

// http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_DescribeInstanceHealth.html
Elb.prototype.describeInstanceHealth = function(data, callback) {
    var self = this;

    // check we have a LoadBalancerName
    if ( _.isUndefined(data.loadBalancerName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a loadBalancerName' }, null);
        return;
    }

    var params = [];
    self.addParam(params, 'LoadBalancerName', data.loadBalancerName);

    var i = 1;
    _.each(data.Instances, function(v) {
        self.addParam(params, 'Instances.member.' + i + '.InstanceId', v);
        i++;
    });

    console.log(params);

    self.performNewRequest({
        action : 'DescribeInstanceHealth',
        params : params,
    }, callback);
};

// http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/APIReference/API_DescribeLoadBalancers.html
Elb.prototype.describeLoadBalancers = function(data, callback) {
    var self = this;

    self.performNewRequest({
        action : 'DescribeLoadBalancers',
    }, callback);
};

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.Elb = Elb;

// --------------------------------------------------------------------------------------------------------------------
