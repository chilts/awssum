// --------------------------------------------------------------------------------------------------------------------
//
// sns.js - class for AWS Simple Notification Service
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

var MARK = 'sns: ';

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html
var endPoint = {};
endPoint[amazon.US_EAST_1]      = "sns.us-east-1.amazonaws.com";
endPoint[amazon.US_WEST_1]      = "sns.us-west-1.amazonaws.com";
endPoint[amazon.EU_WEST_1]      = "sns.eu-west-1.amazonaws.com";
endPoint[amazon.AP_SOUTHEAST_1] = "sns.ap-southeast-1.amazonaws.com";
endPoint[amazon.AP_NORTHEAST_1] = "sns.ap-northeast-1.amazonaws.com";
// US_GOVCLOUD_1 not defined for public consumption

var version = '2010-03-31';

// --------------------------------------------------------------------------------------------------------------------
// constructor

var Sns = function(accessKeyId, secretAccessKey, awsAccountId, region) {
    var self = this;

    // call the superclass for initialisation
    Sns.super_.call(this, accessKeyId, secretAccessKey, awsAccountId, region);

    // check the region is valid
    if ( ! endPoint[region] ) {
        throw MARK + "invalid region '" + region + "'";
    }

    return self;
};

// inherit from Amazon
util.inherits(Sns, amazon.Amazon);

// --------------------------------------------------------------------------------------------------------------------
// methods we need to implement from awssum.js/amazon.js

Sns.prototype.endPoint = function() {
    return endPoint[this.region()];
};

Sns.prototype.verb = function() {
    return 'GET';
}

Sns.prototype.version = function() {
    return version;
}

// --------------------------------------------------------------------------------------------------------------------
// operations on the service

// This list from: http://docs.amazonwebservices.com/sns/latest/api/API_Operations.html
//
// * http://docs.amazonwebservices.com/sns/latest/api/API_AddPermission.html
// * http://docs.amazonwebservices.com/sns/latest/api/API_ConfirmSubscription.html
// * http://docs.amazonwebservices.com/sns/latest/api/API_CreateTopic.html
// * http://docs.amazonwebservices.com/sns/latest/api/API_DeleteTopic.html
// * http://docs.amazonwebservices.com/sns/latest/api/API_GetTopicAttributes.html
// * http://docs.amazonwebservices.com/sns/latest/api/API_ListSubscriptions.html
// * http://docs.amazonwebservices.com/sns/latest/api/API_ListSubscriptionsByTopic.html
// * http://docs.amazonwebservices.com/sns/latest/api/API_ListTopics.html
// * http://docs.amazonwebservices.com/sns/latest/api/API_Publish.html
// * http://docs.amazonwebservices.com/sns/latest/api/API_RemovePermission.html
// * http://docs.amazonwebservices.com/sns/latest/api/API_SetTopicAttributes.html
// * http://docs.amazonwebservices.com/sns/latest/api/API_Subscribe.html
// * http://docs.amazonwebservices.com/sns/latest/api/API_Unsubscribe.html

// ToDo: addPermission()

// ToDo: confirmSubscription()

Sns.prototype.createTopic = function(topicName, callBack) {
    var params = [];

    if ( _.isUndefined(topicName) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a topicName' }, null);
        return;
    }

    params.push({ 'name' : 'Name', 'value' : topicName });

    this.performRequest('CreateTopic', '/', params, callBack);
};

// ToDo: deleteTopic()

// ToDo: getTopicAttributes()

Sns.prototype.listSubscriptions = function(nextToken, callBack) {
    var params = [];

    if ( ! _.isUndefined(nextToken) ) {
        params.push({ 'name' : 'NextToken', 'value' : nextToken });
    }

    this.performRequest('ListSubscriptions', '/', params, callBack);
};

// ToDo: listSubscriptionsByTopic()

Sns.prototype.listTopics = function(nextToken, callBack) {
    var params = [];

    if ( ! _.isUndefined(nextToken) ) {
        params.push({ 'name' : 'NextToken', 'value' : nextToken });
    }

    this.performRequest('ListTopics', '/', params, callBack);
};

// ToDo: publish()

// ToDo: removePermission()

// ToDo: setTopicAttributes()

// ToDo: subscribe()

// ToDo: unsubscribe()

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.Sns = Sns;

// --------------------------------------------------------------------------------------------------------------------
