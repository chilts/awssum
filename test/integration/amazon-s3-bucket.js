// --------------------------------------------------------------------------------------------------------------------
//
// integration/amazon-s3.js - integration tests for Amazon S3
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
var S3 = awssum.load('amazon/s3').S3;

// --------------------------------------------------------------------------------------------------------------------

var env = process.env;
var s3;
try {
    s3 = new S3({
        'accessKeyId'     : env.ACCESS_KEY_ID,
        'secretAccessKey' : env.SECRET_ACCESS_KEY,
        'region'          : amazon.US_EAST_1
    });
}
catch(e) {
    // env vars aren't set, so skip these integration tests
    process.exit();
}

// --------------------------------------------------------------------------------------------------------------------
// Amazon:S3 operations

test('S3:GetBucketTagging - Standard', function(t) {
    s3.GetBucketTagging({ BucketName : 'pie-17' }, function(err, data) {
        t.ok(err, 'S3:GetBucketTagging - NoSuchTagSet');
        t.notOk(data, 'S3:GetBucketTagging - no data');

        t.equal(err.Body.Error.Code, 'NoSuchTagSet', 'S3:GetBucketTagging - checking error code');

        t.end();
    });
});

// --------------------------------------------------------------------------------------------------------------------
