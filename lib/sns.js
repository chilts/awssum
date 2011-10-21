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

Sns.prototype.addPermission = function(topicArn, label, permissions, callBack) {
    var self = this;

    if ( _.isUndefined(topicArn) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a topicArn' }, null);
        return;
    }

    if ( _.isUndefined(label) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a label' }, null);
        return;
    }

    var params = [];
    this.addParam( params, 'TopicArn', topicArn );
    this.addParam( params, 'Label',    label    );

    var i = 1;
    // ok, loop through all the permissions
    if ( _.isArray(permissions) ) {
        _.each(permissions, function(value) {
            // in each permission we should have a 'awsAccountId' and a 'actionName'
            if ( _.isUndefined(value.awsAccountId) ) {
                callBack({
                    Code : 'AwsSumCheck',
                    Message : 'Provide an awsAccountId in position ' + i + ' of permissions'
                }, null);
                return;
            }
            if ( _.isUndefined(value.actionName) ) {
                callBack({
                    Code : 'AwsSumCheck',
                    Message : 'Provide an actionName in position ' + i + ' of permissions'
                }, null);
                return;
            }
            if ( _.isArray(value.actionName) ) {
                // loop through all the action names given
                _.each(value.actionName, function(v) {
                    self.addParam( params, 'AWSAccountId.member.' + i, value.awsAccountId );
                    self.addParam( params, 'ActionName.member.' + i,   v                  );
                    i++;
                });
            }
            else {
                // presume it's a string
                self.addParam( params, 'AWSAccountId.member.' + i, value.awsAccountId );
                self.addParam( params, 'ActionName.member.' + i,   value.actionName   );
                i++;
            }
        });
    }
    else {
        callBack({ Code : 'AwsSumCheck', Message : 'Permissions should be an array' }, null);
        return;
    }

    // console.log(util.inspect(params, true, null));

    this.performRequest('AddPermission', '/', params, callBack);
};

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

Sns.prototype.deleteTopic = function(topicArn, callBack) {
    if ( _.isUndefined(topicArn) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a topicArn' }, null);
        return;
    }

    var params = [];
    this.addParam( params, 'TopicArn', topicArn );

    this.performRequest('DeleteTopic', '/', params, callBack);
};

Sns.prototype.getTopicAttributes = function(topicArn, callBack) {
    if ( _.isUndefined(topicArn) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a topicArn' }, null);
        return;
    }

    var params = [];
    this.addParam(params, 'TopicArn', topicArn);

    this.performRequest('GetTopicAttributes', '/', params, callBack);
}

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

Sns.prototype.removePermission = function(topicArn, label, callBack) {
    if ( _.isUndefined(topicArn) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a topicArn' }, null);
        return;
    }

    if ( _.isUndefined(label) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a label' }, null);
        return;
    }

    var params = [];
    this.addParam(params, 'TopicArn', topicArn);
    this.addParam(params, 'Label',    label   );

    // console.log(util.inspect(params, true, null));

    this.performRequest('RemovePermission', '/', params, callBack);
};

Sns.prototype.setTopicAttributes = function(topicArn, attributeName, attributeValue, callBack) {
    if ( _.isUndefined(topicArn) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a topicArn' }, null);
        return;
    }

    if ( _.isUndefined(attributeName) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide an attributeName' }, null);
        return;
    }

    if ( _.isUndefined(attributeValue) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide an attributeValue' }, null);
        return;
    }

    var params = [];
    this.addParam(params, 'TopicArn',       topicArn);
    this.addParam(params, 'AttributeName',  attributeName);
    this.addParam(params, 'AttributeValue', attributeValue);

    this.performRequest('SetTopicAttributes', '/', params, callBack);
};

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

Sns.prototype.unsubscribe = function(subscriptionArn, callBack) {
    if ( _.isUndefined(subscriptionArn) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a subscriptionArn' }, null);
        return;
    }

    var params = [];
    this.addParam( params, 'SubscriptionArn', subscriptionArn );

    this.performRequest('Unsubscribe', '/', params, callBack);
};

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.Sns = Sns;

// --------------------------------------------------------------------------------------------------------------------
