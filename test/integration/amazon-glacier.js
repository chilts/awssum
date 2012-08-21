// --------------------------------------------------------------------------------------------------------------------
//
// integration/amazon-glacier.js - integration tests for Amazon Storage Gateway
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
var Glacier = awssum.load('amazon/glacier').Glacier;
var inspect = require('eyes').inspector();

// --------------------------------------------------------------------------------------------------------------------

var env = process.env;
var glacier;
try {
    glacier = new Glacier({
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
// Amazon:Glacier operations

// just check one request, checks the signature to be honest
test('Glacier:ListVaults - (1) Standard', function(t) {
    var opts = {};
    glacier.ListVaults(function(err, data) {
        t.notOk(err, 'Glacier:ListVaults - standard : no error');
        t.ok(data, 'Glacier:ListVaults - standard : result ok');
        t.end();
    });
});

// --------------------------------------------------------------------------------------------------------------------
