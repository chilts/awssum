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
endPoint[amazon.EU_WEST_1]      = "sqs.eu-west-1.amazonaws.com";
endPoint[amazon.AP_SOUTHEAST_1] = "sqs.ap-southeast-1.amazonaws.com";
endPoint[amazon.AP_NORTHEAST_1] = "sqs.ap-northeast-1.amazonaws.com";
// US_GOVCLOUD_1 not defined for public consumption

var version = '2009-02-01';

// Constants for our own querystring.escape(...) since that doesn't do what we want it to do

// set up the hex digits and a hexMap[0..255] = ( '00', '01', ...,  'FF' )
var hexDigits = '0123456789ABCDEF';
var hexMap = [];
for ( var i = 0; i < 256; i++ ) {
	hexMap[i] = hexDigits.charAt(i >> 4) + hexDigits.charAt(i & 15);
}
var doNotEsc = /[A-Za-z0-9_.~-]/;

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

Sqs.prototype.endPoint = function() {
    return endPoint[this.region()];
};

Sqs.prototype.verb = function() {
    return 'GET';
}

Sqs.prototype.version = function() {
    return version;
}

Sqs.prototype.makeErrorFromParsedXml = function(result) {
    return {
        Code : result.ErrorResponse.Error.Code,
        Message : result.ErrorResponse.Error.Message,
        RequestId : result.ErrorResponse.RequestId
    };
}

// --------------------------------------------------------------------------------------------------------------------
// operations on the service

// This list from: http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Operations.html
//
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryAddPermission.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryChangeMessageVisibility.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryCreateQueue.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryDeleteMessage.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryDeleteQueue.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryGetQueueAttributes.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryListQueues.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryReceiveMessage.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QueryRemovePermission.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QuerySendMessage.html
// * http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/Query_QuerySetQueueAttributes.html

// ToDo: addPermission()

Sqs.prototype.changeMessageVisibility = function(queueName, receiptHandle, visibilityTimeout, callBack) {
    if ( _.isUndefined(queueName) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    if ( _.isUndefined(receiptHandle) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a receiptHandle' }, null);
        return;
    }

    if ( _.isUndefined(visibilityTimeout) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a visibilityTimeout' }, null);
        return;
    }

    var params = [];
    this.addParam(params, 'ReceiptHandle', receiptHandle);
    this.addParam(params, 'VisibilityTimeout', visibilityTimeout);

    // console.log(util.inspect(params, true, null));

    // create the path to this queue
    var path = '/' + this.awsAccountId() + '/' + queueName;

    this.performRequest('ChangeMessageVisibility', path, params, callBack);
}

Sqs.prototype.createQueue = function(queueName, defaultVisibilityTimeout, callBack) {
    var params = [];

    if ( _.isUndefined(queueName) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    params.push({ 'name' : 'QueueName', 'value' : queueName });

    if ( ! _.isUndefined(defaultVisibilityTimeout) ) {
        if ( _.isNumber(defaultVisibilityTimeout) ) {
            // this is fine
            params.push({ 'name' : 'DefaultVisibilityTimeout', 'value' : defaultVisibilityTimeout });
        }
        else {
            callBack({ Code : 'AwsSumCheck', Message : 'defaultVisibilityTimeout must an integer' }, null);
            return;
        }
    }

    this.performRequest('CreateQueue', '/', params, callBack);
};

Sqs.prototype.deleteMessage = function(queueName, receiptHandle, callBack) {
    if ( _.isUndefined(queueName) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    if ( _.isUndefined(receiptHandle) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a receiptHandle' }, null);
        return;
    }

    var params = [];
    this.addParam(params, 'ReceiptHandle', receiptHandle);

    // console.log(util.inspect(params, true, null));

    // create the path to this queue
    var path = '/' + this.awsAccountId() + '/' + queueName;

    this.performRequest('DeleteMessage', path, params, callBack);
}

Sqs.prototype.deleteQueue = function(queueName, callBack) {
    if ( _.isUndefined(queueName) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    var params = [];

    // console.log(util.inspect(params, true, null));

    // create the path to this queue
    var path = '/' + this.awsAccountId() + '/' + queueName;

    this.performRequest('DeleteQueue', path, params, callBack);
};

Sqs.prototype.getQueueAttributes = function(queueName, attribute, callBack) {
    if ( _.isUndefined(queueName) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    if ( _.isUndefined(attribute) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide an attribute name or an object' }, null);
        return;
    }

    var params = [];
    var i = 0;
    if ( _.isString(attribute) ) {
        params.push({ name : 'AttributeName.' + i, value : attribute });
        i++;
    }
    else if ( _.isArray(attribute) ) {
        i = 1;
        // just read the keys of the object
        _.each(attribute, function(v) {
            params.push({ name : 'AttributeName.' + i, value : v });
            i++;
        });
    }
    else if ( _.isObject(attribute) ) {
        i = 1;
        _.each(attribute, function(v, k) {
            params.push({ name : 'AttributeName.' + i, value : k });
            i++;
        });
    }

    // console.log(util.inspect(params, true, null));

    // create the path to this queue
    var path = '/' + this.awsAccountId() + '/' + queueName;

    this.performRequest('GetQueueAttributes', path, params, callBack);
};

Sqs.prototype.listQueues = function(queueNamePrefix, callBack) {
    var params = [];

    if ( typeof queueNamePrefix !== 'undefined' ) {
        params.push({ 'name' : 'QueueNamePrefix', 'value' : queueNamePrefix });
    }

    this.performRequest('ListQueues', '/', params, callBack);
};

Sqs.prototype.receiveMessage = function(queueName, attribute, maxNumberOfMessages, visibilityTimeout, callBack) {
    if ( _.isUndefined(queueName) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    var params = [];

    // do the attributes
    var i = 1;
    if ( _.isString(attribute) ) {
        params.push({ name : 'AttributeName.' + i, value : attribute });
        i++;
    }
    else if ( _.isArray(attribute) ) {
        i = 1;
        // just read the keys of the object
        _.each(attribute, function(v) {
            params.push({ name : 'AttributeName.' + i, value : v });
            i++;
        });
    }
    else if ( _.isObject(attribute) ) {
        i = 1;
        _.each(attribute, function(v, k) {
            params.push({ name : 'AttributeName.' + i, value : k });
            i++;
        });
    }
    else {
        // nothing to do
    }

    this.addParamIfDefined(params, 'MaxNumberOfMessages', maxNumberOfMessages);
    this.addParamIfDefined(params, 'VisibilityTimeout',   visibilityTimeout);

    // console.log(util.inspect(params, true, null));

    // create the path to this queue
    var path = '/' + this.awsAccountId() + '/' + queueName;

    this.performRequest('ReceiveMessage', path, params, callBack);
};

// ToDo: removePermission()

Sqs.prototype.sendMessage = function(queueName, messageBody, callBack) {
    if ( _.isUndefined(queueName) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    if ( _.isUndefined(messageBody) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a messageBody' }, null);
        return;
    }

    var params = [];
    this.addParam(params, 'MessageBody', messageBody);

    // create the path to this queue
    var path = '/' + this.awsAccountId() + '/' + queueName;

    this.performRequest('SendMessage', path, params, callBack);
};

Sqs.prototype.setQueueAttributes = function(queueName, options, callBack) {
    var params = [];

    if ( _.isUndefined(queueName) ) {
        callBack({ Code : 'AwsSumCheck', Message : 'Provide a queueName' }, null);
        return;
    }

    options = options || {};

    // only add these params if defined (also, no checking since that's up to the user)
    if ( ! _.isUndefined(options.visibilityTimeout) ) {
        this.addParam(params, 'Attribute.Name',  'VisibilityTimeout');
        this.addParam(params, 'Attribute.Value', options.visibilityTimeout);
    }

    if ( ! _.isUndefined(options.policy) ) {
        this.addParam(params, 'Attribute.Name',  'Policy');
        this.addParam(params, 'Attribute.Value', options.policy);
    }

    if ( ! _.isUndefined(options.maximumMessageSize) ) {
        this.addParam(params, 'Attribute.Name',  'MaximumMessageSize');
        this.addParam(params, 'Attribute.Value', options.maximumMessageSize);
    }

    if ( ! _.isUndefined(options.messageRetentionPeriod) ) {
        this.addParam(params, 'Attribute.Name',  'MessageRetentionPeriod');
        this.addParam(params, 'Attribute.Value', options.messageRetentionPeriod);
    }

    // create the path to this queue
    var path = '/' + this.awsAccountId() + '/' + queueName;

    this.performRequest('SetQueueAttributes', path, params, callBack);
};

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.Sqs = Sqs;

// --------------------------------------------------------------------------------------------------------------------
