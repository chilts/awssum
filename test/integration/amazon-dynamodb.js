// --------------------------------------------------------------------------------------------------------------------
//
// integration/amazon-dynamodb.js - integration tests for Amazon DynamoDB
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
var DynamoDB = awssum.load('amazon/dynamodb').DynamoDB;
var inspect = require('eyes').inspector();

// --------------------------------------------------------------------------------------------------------------------

var env = process.env;
var dynamodb;
try {
    dynamodb = new DynamoDB({
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
// Amazon:DynamoDB operations

// just check one request, checks the signature to be honest
test('DynamoDB:ListTables - (1) Standard', function(t) {
    var opts = {};
    dynamodb.ListTables(function(err, data) {
        t.notOk(err, 'DynamoDB:ListTables - (1) Standard : no error');
        t.equal(data.StatusCode, 200, 'StatusCode is 200');
        t.equal(data.Headers['content-type'], 'application/x-amz-json-1.0', 'ContentType is json v1.0 (not v1.1)');
        t.end();
    });
});

test('DynamoDB:PutItem - (2) without unicode character', function(t) {
    var opts = {};

    dynamodb.PutItem({
        TableName : 'test',
        Item : {
            id : { S : '1' },
            data : { S : 'Munich' },
        },
    }, function(err, data) {
        console.log(data);
        t.ok(err, 'DynamoDB:PutItem - (2) without unicode character');
        t.equal(err.StatusCode, 400, 'Table test does not exist');
        t.equal(err.Body.message, 'Requested resource not found', 'Error message');
        t.end();
    });

});

test('DynamoDB:PutItem - (3) with unicode character', function(t) {
    var opts = {};

    dynamodb.PutItem({
        TableName : 'test',
        Item : {
            id : { S : '1' },
            data : { S : 'München' },
        },
    }, function(err, data) {
        console.log(err);
        t.ok(err, 'DynamoDB:PutItem - (2) without unicode character');
        t.equal(err.StatusCode, 400, 'Table test does not exist');
        t.equal(err.Body.message, 'Requested resource not found', 'Error message');
        t.end();
    });

});

// --------------------------------------------------------------------------------------------------------------------
