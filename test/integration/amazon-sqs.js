// --------------------------------------------------------------------------------------------------------------------
//
// integration/amazon-sqs.js - integration tests for Amazon SQS
//
// Copyright (c) 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------
// requires

var fs = require('fs');
var test = require('tap').test;
var awssum = require('../../');
var amazon = awssum.load('amazon/amazon');
var Sqs = awssum.load('amazon/sqs').Sqs;

// --------------------------------------------------------------------------------------------------------------------

var env = process.env;
var sqs;
try {
    sqs = new Sqs({
        'accessKeyId'     : env.ACCESS_KEY_ID,
        'secretAccessKey' : env.SECRET_ACCESS_KEY,
        'awsAccountId'    : env.AWS_ACCOUNT_ID,
        'region'          : amazon.US_EAST_1
    });
}
catch(e) {
    // env vars aren't set, so skip these integration tests
    process.exit();
}

// --------------------------------------------------------------------------------------------------------------------
// Amazon:SQS operations

test('Sqs:ListDomains - Standard', function(t) {
    sqs.ListQueues(function(err, data) {
        t.equal(err, null, 'SQS:ListQueues - Standard : error should be null');
        t.ok(data, 'SQS:ListDomains - Standard : data ok');
        t.end();
    });
});

// --------------------------------------------------------------------------------------------------------------------

var params = {
    QueueName : 'my-queue',
    MessageBody : 'Hello, World!',
};

test('Sqs:SendMessage - Standard', function(t) {
    var params = {
        QueueName : 'my-queue',
        MessageBody : 'Hello, World!',
    };

    sqs.SendMessage(params, function(err, data) {
        t.equal(err, null, 'SQS:SendMessage - Standard : error should be null');
        t.ok(data, 'SQS:SendMessage - Standard : data ok');
        t.equal(data.StatusCode, 200, 'SQS:SendMessage - Standard : StatusCode ok');
        t.equal(data.Headers['content-type'], 'text/xml', 'SQS:SendMessage - Standard : StatusCode ok');
        t.equal(
            data.Body.SendMessageResponse.SendMessageResult.MD5OfMessageBody,
            '65a8e27d8879283831b664bd8b7f0ad4',
            'SQS:SendMessage - Standard : md5 of message ok'
        );
        t.equal(
            data.Body.SendMessageResponse.SendMessageResult.MessageId.length,
            36,
            'SQS:SendMessage - Standard : length of message id (uuid)'
        );
        t.end();
    });
});

// --------------------------------------------------------------------------------------------------------------------

test('Sqs:SendMessage - Queue Does Not Exist', function(t) {
    var paramsNoQueue = {
        QueueName : 'queue-does-not-exist',
        MessageBody : '[none]',
    };

    sqs.SendMessage(paramsNoQueue, function(err, data) {
        t.equal(err.StatusCode, 400, 'Sqs:SendMessage - Queue Does Not Exist : status code is 400');
        t.equal(
            err.Body.ErrorResponse.Error.Type,
            'Sender',
            'Sqs:SendMessage - Queue Does Not Exist : error type is Sender'
        );
        t.equal(
            err.Body.ErrorResponse.Error.Code,
            'AWS.SimpleQueueService.NonExistentQueue',
            'Sqs:SendMessage - Queue Does Not Exist : code is NonExistentQueue'
        );
        t.equal(data, null, 'Sqs:SendMessage - Queue Does Not Exist : data should be null');
        t.end();
    });
});

// --------------------------------------------------------------------------------------------------------------------
