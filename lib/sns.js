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

Sns.prototype.makeErrorFromParsedXml = function(result) {
    return {
        Code : result.ErrorResponse.Error.Code,
        Message : result.ErrorResponse.Error.Message,
        RequestId : result.ErrorResponse.RequestId
    };
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

Sns.prototype.confirmSubscription = function(topicArn, token, authenticateOnUnsubscribe, callBack) {
    if ( _.isUndefined(topicArn) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a topicArn' }, null);
        return;
    }

    if ( _.isUndefined(token) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a token' }, null);
        return;
    }

    var params = [];
    params.push({ 'name' : 'TopicArn', 'value' : topicArn });
    params.push({ 'name' : 'Token',    'value' : token    });

    if ( ! _.isUndefined(authenticateOnUnsubscribe) ) {
        params.push({ 'name' : 'AuthenticateOnUnsubscribe', 'value' : authenticateOnUnsubscribe });
    }

    this.performRequest('ConfirmSubscription', '/', params, callBack);
};

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

Sns.prototype.listSubscriptionsByTopic = function(topicArn, nextToken, callBack) {
    var params = [];

    if ( _.isUndefined(topicArn) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a topicArn' }, null);
        return;
    }

    params.push({ 'name' : 'TopicArn', 'value' : topicArn });

    if ( ! _.isUndefined(nextToken) ) {
        params.push({ 'name' : 'NextToken', 'value' : nextToken });
    }

    this.performRequest('ListSubscriptionsByTopic', '/', params, callBack);
};

Sns.prototype.listTopics = function(nextToken, callBack) {
    var params = [];

    if ( ! _.isUndefined(nextToken) ) {
        params.push({ 'name' : 'NextToken', 'value' : nextToken });
    }

    this.performRequest('ListTopics', '/', params, callBack);
};

Sns.prototype.publish = function(topicArn, message, subject, messageStructure, callBack) {
    if ( _.isUndefined(topicArn) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a topicArn' }, null);
        return;
    }

    if ( _.isUndefined(message) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a message' }, null);
        return;
    }

    var params = [];
    this.addParam(params, 'TopicArn', topicArn);
    this.addParam(params, 'Message', message);
    this.addParamIfDefined(params, 'Subject', subject);
    this.addParamIfDefined(params, 'MessageStructure', messageStructure);

    this.performRequest('Publish', '/', params, callBack);
};

// ToDo: removePermission()

// ToDo: setTopicAttributes()

Sns.prototype.subscribe = function(topicArn, protocol, endpoint, callBack) {
    if ( _.isUndefined(topicArn) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a topicArn' }, null);
        return;
    }

    if ( _.isUndefined(protocol) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a protocol (http, https, email, email-json, sqs)' }, null);
        return;
    }

    if ( _.isUndefined(endpoint) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide an endpoint' }, null);
        return;
    }

    var params = [];
    params.push({ 'name' : 'TopicArn', 'value' : topicArn });
    params.push({ 'name' : 'Protocol', 'value' : protocol });
    params.push({ 'name' : 'Endpoint', 'value' : endpoint });

    this.performRequest('Subscribe', '/', params, callBack);
};

// ToDo: unsubscribe()

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.Sns = Sns;

// --------------------------------------------------------------------------------------------------------------------
