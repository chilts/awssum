// --------------------------------------------------------------------------------------------------------------------
//
// sqs.js - class for AWS SQS
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

var MARK = 'sqs: ';

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html
var endPoint = {};
endPoint[amazon.US_EAST_1]      = "sqs.us-east-1.amazonaws.com";
endPoint[amazon.US_WEST_1]      = "sqs.us-west-1.amazonaws.com";
endPoint[amazon.US_WEST_2]      = "sqs.us-west-2.amazonaws.com";
endPoint[amazon.EU_WEST_1]      = "sqs.eu-west-1.amazonaws.com";
endPoint[amazon.AP_SOUTHEAST_1] = "sqs.ap-southeast-1.amazonaws.com";
endPoint[amazon.AP_NORTHEAST_1] = "sqs.ap-northeast-1.amazonaws.com";
// endPoint[amazon.US_GOV_WEST_1]  = "...";
endPoint[amazon.SA_EAST_1]      = "sqs.sa-east-1.amazonaws.com";

var version = '2011-10-01';

// --------------------------------------------------------------------------------------------------------------------
// constructor

var Sqs = function(accessKeyId, secretAccessKey, awsAccountId, region) {
    var self = this;

    // call the superclass for initialisation
    Sqs.super_.call(this, accessKeyId, secretAccessKey, awsAccountId, region);

    // check the region is valid
    if ( ! endPoint[region] ) {
        throw MARK + "invalid region '" + region + "'";
    }

    return self;
};

// inherit from Amazon
util.inherits(Sqs, amazon.Amazon);

// --------------------------------------------------------------------------------------------------------------------
// methods we need to implement from awssum.js/amazon.js

Sqs.prototype.host = function() {
    return endPoint[this.region()];
};

Sqs.prototype.version = function() {
    return version;
}

// --------------------------------------------------------------------------------------------------------------------
// operations on the service

// This list from: http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Operations.html
//
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryAddPermission.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryChangeMessageVisibility.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryChangeMessageVisibilityBatch.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryCreateQueue.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryDeleteMessage.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryDeleteMessageBatch.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryDeleteQueue.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryGetQueueUrl.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryGetQueueAttributes.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryListQueues.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryReceiveMessage.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryRemovePermission.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QuerySendMessage.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QuerySendMessageBatch.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QuerySetQueueAttributes.html

Sqs.prototype.addPermission = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.queueName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    if ( _.isUndefined(args.label) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a label' }, null);
        return;
    }

    var params = [];
    self.addParam(params, 'Label', args.label);

    var i = 1;
    _.each(args.policies, function(policy) {
        self.addParam(params, 'AWSAccountId.' + i, policy.awsAccountId);
        self.addParam(params, 'ActionName.' + i, policy.actionName);
        i++;
    });

    // create the path to this queue
    var path = '/' + self.awsAccountId() + '/' + args.queueName;

    self.addParam( params, 'Action', 'AddPermission' );
    self.performRequest({
        path : path,
        params : params,
    }, callback);
};

Sqs.prototype.changeMessageVisibility = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.queueName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    if ( _.isUndefined(args.receiptHandle) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a receiptHandle' }, null);
        return;
    }

    if ( _.isUndefined(args.visibilityTimeout) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a visibilityTimeout' }, null);
        return;
    }

    var params = [];
    self.addParam(params, 'ReceiptHandle', args.receiptHandle);
    self.addParam(params, 'VisibilityTimeout', args.visibilityTimeout);

    // create the path to this queue
    var path = '/' + self.awsAccountId() + '/' + args.queueName;

    self.addParam( params, 'Action', 'ChangeMessageVisibility' );
    self.performRequest({
        path : path,
        params : params,
    }, callback);
}

Sqs.prototype.changeMessageVisibilityBatch = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.queueName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    if ( ! _.isArray(args.messages) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide an array of messages (with receiptHandles)' }, null);
        return;
    }

    var params = [];

    var i = 1;
    _.each(args.messages, function(msg) {
        self.addParam(params, 'ChangeMessageVisibilityBatchRequestEntry.' + i + '.Id', msg.id || i);
        self.addParam(params, 'ChangeMessageVisibilityBatchRequestEntry.' + i + '.ReceiptHandle', msg.receiptHandle);
        self.addParamIfDefined(
            params,
            'ChangeMessageVisibilityBatchRequestEntry.' + i + '.VisibilityTimeout',
            msg.visibilityTimeout
        );
        i++;
    });

    // create the path to this queue
    var path = '/' + self.awsAccountId() + '/' + args.queueName;

    self.addParam( params, 'Action', 'ChangeMessageVisibilityBatch' );
    self.performRequest({
        path : path,
        params : params,
    }, callback);
}

Sqs.prototype.createQueue = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.queueName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    var params = [];
    params.push({ 'name' : 'QueueName', 'value' : args.queueName });

    if ( ! _.isUndefined(args.defaultVisibilityTimeout) ) {
        if ( _.isNumber(args.defaultVisibilityTimeout) ) {
            // this is fine
            params.push({ 'name' : 'DefaultVisibilityTimeout', 'value' : args.defaultVisibilityTimeout });
        }
        else {
            callback({ Code : 'AwsSumCheck', Message : 'defaultVisibilityTimeout must an integer' }, null);
            return;
        }
    }

    self.addParam( params, 'Action', 'CreateQueue' );
    self.performRequest({
        params : params,
    }, callback);
};

Sqs.prototype.deleteMessage = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.queueName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    if ( _.isUndefined(args.receiptHandle) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a receiptHandle' }, null);
        return;
    }

    var params = [];
    self.addParam(params, 'ReceiptHandle', args.receiptHandle);

    // create the path to this queue
    var path = '/' + self.awsAccountId() + '/' + args.queueName;

    self.addParam( params, 'Action', 'DeleteMessage' );
    self.performRequest({
        path : path,
        params : params,
    }, callback);
}

Sqs.prototype.deleteMessageBatch = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.queueName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    if ( ! _.isArray(args.messages) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide an array of messages (with receiptHandles)' }, null);
        return;
    }

    var params = [];

    var i = 1;
    _.each(args.messages, function(msg) {
        self.addParam(params, 'DeleteMessageBatchRequestEntry.' + i + '.Id', msg.id || i);
        self.addParam(params, 'DeleteMessageBatchRequestEntry.' + i + '.ReceiptHandle', msg.receiptHandle);
        i++;
    });

    // create the path to this queue
    var path = '/' + self.awsAccountId() + '/' + args.queueName;

    self.addParam( params, 'Action', 'DeleteMessageBatch' );
    self.performRequest({
        path : path,
        params : params,
    }, callback);
}

Sqs.prototype.deleteQueue = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.queueName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    var params = [];

    // create the path to this queue
    var path = '/' + self.awsAccountId() + '/' + args.queueName;

    self.addParam( params, 'Action', 'DeleteQueue' );
    self.performRequest({
        path : path,
    }, callback);
};

Sqs.prototype.getQueueAttributes = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.queueName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    if ( _.isUndefined(args.attribute) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide an attribute name or an object' }, null);
        return;
    }

    var params = [];
    var i = 0;
    if ( _.isString(args.attribute) ) {
        params.push({ name : 'AttributeName.' + i, value : args.attribute });
        i++;
    }
    else if ( _.isArray(args.attribute) ) {
        i = 1;
        // just read the keys of the object
        _.each(args.attribute, function(v) {
            params.push({ name : 'AttributeName.' + i, value : v });
            i++;
        });
    }
    else if ( _.isObject(args.attribute) ) {
        i = 1;
        _.each(args.attribute, function(v, k) {
            params.push({ name : 'AttributeName.' + i, value : k });
            i++;
        });
    }

    // create the path to this queue
    var path = '/' + self.awsAccountId() + '/' + args.queueName;

    self.addParam( params, 'Action', 'GetQueueAttributes' );
    self.performRequest({
        path : path,
        params : params,
    }, callback);
};

Sqs.prototype.getQueueUrl = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.queueName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    var params = [];
    self.addParam(params, 'QueueName', args.queueName);
    self.addParamIfDefined(params, 'QueueOwnerAwsAccountId', args.queueOwnerAwsAccountId);

    self.addParam( params, 'Action', 'GetQueueUrl' );
    self.performRequest({
        params : params,
    }, callback);
};

Sqs.prototype.listQueues = function(args, callback) {
    var self = this;

    var params = [];

    if ( typeof args.queueNamePrefix !== 'undefined' ) {
        params.push({ 'name' : 'QueueNamePrefix', 'value' : args.queueNamePrefix });
    }

    self.addParam( params, 'Action', 'ListQueues' );
    self.performRequest({
        params : params,
    }, callback);
};

Sqs.prototype.receiveMessage = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.queueName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    var params = [];

    // do the attributes
    var i = 1;
    if ( _.isString(args.attribute) ) {
        params.push({ name : 'AttributeName.' + i, value : args.attribute });
        i++;
    }
    else if ( _.isArray(args.attribute) ) {
        i = 1;
        // just read the keys of the object
        _.each(args.attribute, function(v) {
            params.push({ name : 'AttributeName.' + i, value : v });
            i++;
        });
    }
    else if ( _.isObject(args.attribute) ) {
        i = 1;
        _.each(args.attribute, function(v, k) {
            params.push({ name : 'AttributeName.' + i, value : k });
            i++;
        });
    }
    else {
        // nothing to do
    }

    self.addParamIfDefined(params, 'MaxNumberOfMessages', args.maxNumberOfMessages);
    self.addParamIfDefined(params, 'VisibilityTimeout',   args.visibilityTimeout);

    // create the path to this queue
    var path = '/' + self.awsAccountId() + '/' + args.queueName;

    self.addParam( params, 'Action', 'ReceiveMessage' );
    self.performRequest({
        path : path,
        params : params,
    }, callback);
};

Sqs.prototype.removePermission = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.queueName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    if ( _.isUndefined(args.label) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a label' }, null);
        return;
    }

    var params = [];
    self.addParam(params, 'Label', args.label);

    // create the path to this queue
    var path = '/' + self.awsAccountId() + '/' + args.queueName;

    self.addParam( params, 'Action', 'RemovePermission' );
    self.performRequest({
        path : path,
        params : params,
    }, callback);
};

Sqs.prototype.sendMessage = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.queueName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    if ( _.isUndefined(args.messageBody) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a messageBody' }, null);
        return;
    }

    var params = [];
    self.addParam(params, 'MessageBody', args.messageBody);
    self.addParamIfDefined(params, 'DelaySeconds', args.delaySeconds);

    // create the path to this queue
    var path = '/' + self.awsAccountId() + '/' + args.queueName;

    self.addParam( params, 'Action', 'SendMessage' );
    self.performRequest({
        path : path,
        params : params,
    }, callback);
};

Sqs.prototype.sendMessageBatch = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.queueName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    var params = [];
    var i = 1;
    _.each(args.messages, function(msg) {
        self.addParam(params, 'SendMessageBatchRequestEntry.' + i + '.Id', msg.id);
        self.addParam(params, 'SendMessageBatchRequestEntry.' + i + '.MessageBody', msg.messageBody);
        self.addParamIfDefined(params, 'SendMessageBatchRequestEntry.' + i + '.DelaySeconds', msg.delaySeconds);
        i++;
    });

    // create the path to this queue
    var path = '/' + self.awsAccountId() + '/' + args.queueName;

    self.addParam( params, 'Action', 'SendMessageBatch' );
    self.performRequest({
        path : path,
        params : params,
    }, callback);
};

Sqs.prototype.setQueueAttributes = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.queueName) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    var params = [];

    // only add these params if defined (also, no checking since that's up to the user)
    if ( ! _.isUndefined(args.visibilityTimeout) ) {
        self.addParam(params, 'Attribute.Name',  'VisibilityTimeout');
        self.addParam(params, 'Attribute.Value', args.visibilityTimeout);
    }

    if ( ! _.isUndefined(args.policy) ) {
        self.addParam(params, 'Attribute.Name',  'Policy');
        self.addParam(params, 'Attribute.Value', args.policy);
    }

    if ( ! _.isUndefined(args.maximumMessageSize) ) {
        self.addParam(params, 'Attribute.Name',  'MaximumMessageSize');
        self.addParam(params, 'Attribute.Value', args.maximumMessageSize);
    }

    if ( ! _.isUndefined(args.messageRetentionPeriod) ) {
        self.addParam(params, 'Attribute.Name',  'MessageRetentionPeriod');
        self.addParam(params, 'Attribute.Value', args.messageRetentionPeriod);
    }

    if ( ! _.isUndefined(args.delaySeconds) ) {
        self.addParam(params, 'Attribute.Name',  'DelaySeconds');
        self.addParam(params, 'Attribute.Value', args.delaySeconds);
    }

    // create the path to this queue
    var path = '/' + self.awsAccountId() + '/' + args.queueName;

    self.addParam( params, 'Action', 'SetQueueAttributes' );
    self.performRequest({
        path : path,
        params : params,
    }, callback);
};

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.Sqs = Sqs;

// --------------------------------------------------------------------------------------------------------------------
