// --------------------------------------------------------------------------------------------------------------------
//
// amazon.js - test for AWS Amazon
//
// Copyright (c) 2011 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
// requires

var tap = require("tap"),
    test = tap.test,
    plan = tap.plan;
var amazon;

// --------------------------------------------------------------------------------------------------------------------
// basic tests

test("load simpledb", function (t) {
    amazon = require("../lib/amazon");
    t.ok(amazon, "object loaded");
    t.end();
})

test("create amazon object", function (t) {
    t.equal(1, amazon.US_EAST_1, 'US East 1');
    t.equal(2, amazon.US_WEST_1, 'US West 1');
    t.equal(3, amazon.EU_WEST_1, 'EU West 1');
    t.equal(4, amazon.AP_SOUTHEAST_1, 'AP SouthEast 1');
    t.equal(5, amazon.AP_NORTHEAST_1, 'AP NorthEast 1');
    t.end();
});

test("test signature", function (t) {
    var amz = new amazon.Amazon('access_key_id', 'secret_access_key', amazon.US_WEST_1);

    console.log('here1');

    var paramsEmpty = [];
    console.log('here3', amz);
    var sigEmpty = amz.signature(paramsEmpty);
    console.log('here4');
    t.equal(sigEmpty, '26rngow7dRJeRbdBLvzbpUUy58PcZ9QrWh+4KUr8eiE=', 'Signature of empty params');

    console.log('here2');

    // doesn't matter _what_ these values are, we just need something (ie. 'version' doesn't matter if it's wrong)
    var paramsCommon = [];
    paramsCommon.push({ 'name' : 'AWSAccessKeyId', 'value' : amz.accessKeyId() });
    paramsCommon.push({ 'name' : 'Version', 'value' : '2009-04-15' });
    paramsCommon.push({ 'name' : 'Timestamp', 'value' : '2011-10-17T18:35:02.878Z' });
    paramsCommon.push({ 'name' : 'SignatureVersion', 'value' : 2 });
    paramsCommon.push({ 'name' : 'SignatureMethod', 'value' : 'HmacSHA256' });
    var sigCommon = amz.signature(paramsCommon);
    t.equal(sigEmpty, '26rngow7dRJeRbdBLvzbpUUy58PcZ9QrWh+4KUr8eiE=', 'Signature of common params');

    t.end();
});

// --------------------------------------------------------------------------------------------------------------------
