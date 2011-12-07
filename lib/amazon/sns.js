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
endPoint[amazon.US_WEST_2]      = "sns.us-west-2.amazonaws.com";
endPoint[amazon.EU_WEST_1]      = "sns.eu-west-1.amazonaws.com";
endPoint[amazon.AP_SOUTHEAST_1] = "sns.ap-southeast-1.amazonaws.com";
endPoint[amazon.AP_NORTHEAST_1] = "sns.ap-northeast-1.amazonaws.com";
// endPoint[amazon.US_GOV_WEST_1]  = "...";

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

Sns.prototype.host = function() {
    return endPoint[this.region()];
};

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

Sns.prototype.addPermission = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.topicArn) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a topicArn' }, null);
        return;
    }

    if ( _.isUndefined(args.label) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a label' }, null);
        return;
    }

    var params = [];
    self.addParam( params, 'TopicArn', args.topicArn );
    self.addParam( params, 'Label',    args.label    );

    var i = 1;
    // ok, loop through all the permissions
    if ( _.isArray(args.permissions) ) {
        _.each(args.permissions, function(value) {
            // in each permission we should have a 'awsAccountId' and a 'actionName'
            if ( _.isUndefined(value.awsAccountId) ) {
                callback({
                    Code : 'AwsSumCheck',
                    Message : 'Provide an awsAccountId in position ' + i + ' of permissions'
                }, null);
                return;
            }
            if ( _.isUndefined(value.actionName) ) {
                callback({
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
        callback({ Code : 'AwsSumCheck', Message : 'Permissions should be an array' }, null);
        return;
    }

    // console.log(util.inspect(params, true, null));

    self.addParam( params, 'Action', 'AddPermission' );
    self.performRequest({
        params : params,
    }, callback);
};

Sns.prototype.confirmSubscription = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.topicArn) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a topicArn' }, null);
        return;
    }

    if ( _.isUndefined(args.token) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a token' }, null);
        return;
    }

    var params = [];
    params.push({ 'name' : 'TopicArn', 'value' : args.topicArn });
    params.push({ 'name' : 'Token',    'value' : args.token    });

    if ( ! _.isUndefined(args.authenticateOnUnsubscribe) ) {
        params.push({ 'name' : 'AuthenticateOnUnsubscribe', 'value' : args.authenticateOnUnsubscribe });
    }

    self.addParam( params, 'Action', 'ConfirmSubscription' );
    self.performRequest({
        params : params,
    }, callback);
};

Sns.prototype.createTopic = function(args, callback) {
    var self = this;

    var params = [];

    if ( _.isUndefined(args.topicName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a topicName' }, null);
        return;
    }

    params.push({ 'name' : 'Name', 'value' : args.topicName });

    self.addParam( params, 'Action', 'CreateTopic' );
    self.performRequest({
        params : params,
    }, callback);
};

Sns.prototype.deleteTopic = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.topicArn) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a topicArn' }, null);
        return;
    }

    var params = [];
    self.addParam( params, 'TopicArn', args.topicArn );

    self.addParam( params, 'Action', 'DeleteTopic' );
    self.performRequest({
        params : params,
    }, callback);
};

Sns.prototype.getTopicAttributes = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.topicArn) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a topicArn' }, null);
        return;
    }

    var params = [];
    self.addParam(params, 'TopicArn', args.topicArn);

    self.addParam( params, 'Action', 'GetTopicAttributes' );
    self.performRequest({
        params : params,
    }, callback);
}

Sns.prototype.listSubscriptions = function(args, callback) {
    var self = this;

    var params = [];

    if ( ! _.isUndefined(args.nextToken) ) {
        params.push({ 'name' : 'NextToken', 'value' : args.nextToken });
    }

    self.addParam( params, 'Action', 'ListSubscriptions' );
    self.performRequest({
        params : params,
    }, callback);
};

Sns.prototype.listSubscriptionsByTopic = function(args, callback) {
    var self = this;

    var params = [];

    if ( _.isUndefined(args.topicArn) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a topicArn' }, null);
        return;
    }

    params.push({ 'name' : 'TopicArn', 'value' : args.topicArn });

    if ( ! _.isUndefined(args.nextToken) ) {
        params.push({ 'name' : 'NextToken', 'value' : args.nextToken });
    }

    self.addParam( params, 'Action', 'ListSubscriptionsByTopic' );
    self.performRequest({
        params : params,
    }, callback);
};

Sns.prototype.listTopics = function(args, callback) {
    var self = this;

    var params = [];

    if ( ! _.isUndefined(args.nextToken) ) {
        params.push({ 'name' : 'NextToken', 'value' : args.nextToken });
    }

    self.addParam( params, 'Action', 'ListTopics' );
    self.performRequest({
        params : params,
    }, callback);
};

Sns.prototype.publish = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.topicArn) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a topicArn' }, null);
        return;
    }

    if ( _.isUndefined(args.message) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a message' }, null);
        return;
    }

    var params = [];
    self.addParam(params, 'TopicArn', args.topicArn);
    self.addParam(params, 'Message', args.message);
    self.addParamIfDefined(params, 'Subject', args.subject);
    self.addParamIfDefined(params, 'MessageStructure', args.messageStructure);

    self.addParam( params, 'Action', 'Publish' );
    self.performRequest({
        params : params,
    }, callback);
};

Sns.prototype.removePermission = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.topicArn) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a topicArn' }, null);
        return;
    }

    if ( _.isUndefined(args.label) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a label' }, null);
        return;
    }

    var params = [];
    self.addParam(params, 'TopicArn', args.topicArn);
    self.addParam(params, 'Label',    args.label   );

    // console.log(util.inspect(params, true, null));

    self.addParam( params, 'Action', 'RemovePermission' );
    self.performRequest({
        params : params,
    }, callback);
};

Sns.prototype.setTopicAttributes = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.topicArn) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a topicArn' }, null);
        return;
    }

    if ( _.isUndefined(args.attributeName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide an attributeName' }, null);
        return;
    }

    if ( _.isUndefined(args.attributeValue) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide an attributeValue' }, null);
        return;
    }

    var params = [];
    self.addParam(params, 'TopicArn',       args.topicArn);
    self.addParam(params, 'AttributeName',  args.attributeName);
    self.addParam(params, 'AttributeValue', args.attributeValue);

    self.addParam( params, 'Action', 'SetTopicAttributes' );
    self.performRequest({
        params : params,
    }, callback);
};

Sns.prototype.subscribe = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.topicArn) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a topicArn' }, null);
        return;
    }

    if ( _.isUndefined(args.protocol) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a protocol (http, https, email, email-json, sqs)' }, null);
        return;
    }

    if ( _.isUndefined(args.endpoint) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide an endpoint' }, null);
        return;
    }

    var params = [];
    params.push({ 'name' : 'TopicArn', 'value' : args.topicArn });
    params.push({ 'name' : 'Protocol', 'value' : args.protocol });
    params.push({ 'name' : 'Endpoint', 'value' : args.endpoint });

    self.addParam( params, 'Action', 'Subscribe' );
    self.performRequest({
        params : params,
    }, callback);
};

Sns.prototype.unsubscribe = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.subscriptionArn) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a subscriptionArn' }, null);
        return;
    }

    var params = [];
    self.addParam( params, 'SubscriptionArn', args.subscriptionArn );

    self.addParam( params, 'Action', 'Unsubscribe' );
    self.performRequest({
        params : params,
    }, callback);
};

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.Sns = Sns;

// --------------------------------------------------------------------------------------------------------------------
