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
    _ = require('underscore'),
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
    t.equal('Virginia',   amazon.US_EAST_1,      'US East 1'     );
    t.equal('California', amazon.US_WEST_1,      'US West 1'     );
    t.equal('Dublin',     amazon.EU_WEST_1,      'EU West 1'     );
    t.equal('Singapore',  amazon.AP_SOUTHEAST_1, 'AP SouthEast 1');
    t.equal('Tokyo',      amazon.AP_NORTHEAST_1, 'AP NorthEast 1');
    t.end();
});

test("test addParam", function (t) {
    var amz = new amazon.Amazon('access_key_id', 'secret_access_key', 'aws_account_id', amazon.US_WEST_1);

    var params = [];
    var result = [
        { 'name' : 'Name',  'value' : 'Value' }
    ];
    amz.addParam(params, 'Name', 'Value');
    t.ok(_.isEqual(params, result), 'Deep compare of params');

    t.end();
});

test("test addParamIfDefined", function (t) {
    var amz = new amazon.Amazon('access_key_id', 'secret_access_key', 'aws_account_id', amazon.US_WEST_1);

    var params1 = [];
    var result1 = [
        { 'name' : 'Name',  'value' : 'Value' }
    ];
    amz.addParamIfDefined(params1, 'Name', 'Value');
    t.ok(_.isEqual(params1, result1), 'Deep compare of params');

    var params2 = [];
    var result2 = [];
    amz.addParamIfDefined(params2, 'Name', undefined);
    t.ok(_.isEqual(params2, result2), 'Deep compare of (empty) params');

    t.end();
});

test("test strToSign", function (t) {
    var amz = new amazon.Amazon('access_key_id', 'secret_access_key', 'aws_account_id', amazon.US_WEST_1);

    var paramsEmpty = [];
    var strToSignEmpty = amz.strToSign('/', paramsEmpty);
    t.equal(strToSignEmpty, "\n\n/\n", 'strToSign of empty params');

    // doesn't matter _what_ these values are, we just need something (ie. 'version' doesn't matter if it's wrong)
    var paramsCommon = [];
    paramsCommon.push({ 'name' : 'AWSAccessKeyId', 'value' : amz.accessKeyId() });
    paramsCommon.push({ 'name' : 'Version', 'value' : '2009-04-15' });
    paramsCommon.push({ 'name' : 'Timestamp', 'value' : '2011-10-17T18:35:02.878Z' });
    paramsCommon.push({ 'name' : 'SignatureVersion', 'value' : 2 });
    paramsCommon.push({ 'name' : 'SignatureMethod', 'value' : 'HmacSHA256' });
    var strToSignCommon = amz.strToSign('/', paramsCommon);
    t.equal(strToSignCommon, "\n\n/\nAWSAccessKeyId=access_key_id&SignatureMethod=HmacSHA256&SignatureVersion=2&Timestamp=2011-10-17T18%3A35%3A02.878Z&Version=2009-04-15", 'strToSign of common params');

    t.end();
});

test("test signature", function (t) {
    var amz = new amazon.Amazon('access_key_id', 'secret_access_key', 'aws_account_id', amazon.US_WEST_1);
    var strToSign;

    var paramsEmpty = [];
    strToSign = amz.strToSign('/', paramsEmpty);
    var sigEmpty = amz.signature(strToSign);
    t.equal(sigEmpty, '26rngow7dRJeRbdBLvzbpUUy58PcZ9QrWh+4KUr8eiE=', 'Signature of empty params');

    // doesn't matter _what_ these values are, we just need something (ie. 'version' doesn't matter if it's wrong)
    var paramsCommon = [];
    paramsCommon.push({ 'name' : 'AWSAccessKeyId', 'value' : amz.accessKeyId() });
    paramsCommon.push({ 'name' : 'Version', 'value' : '2009-04-15' });
    paramsCommon.push({ 'name' : 'Timestamp', 'value' : '2011-10-17T18:35:02.878Z' });
    paramsCommon.push({ 'name' : 'SignatureVersion', 'value' : 2 });
    paramsCommon.push({ 'name' : 'SignatureMethod', 'value' : 'HmacSHA256' });
    strToSign = amz.strToSign('/', paramsCommon);
    var sigCommon = amz.signature(strToSign);
    t.equal(sigEmpty, '26rngow7dRJeRbdBLvzbpUUy58PcZ9QrWh+4KUr8eiE=', 'Signature of common params');

    t.end();
});

// --------------------------------------------------------------------------------------------------------------------
