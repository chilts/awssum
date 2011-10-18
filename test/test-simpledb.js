// --------------------------------------------------------------------------------------------------------------------
//
// test-simpledb.js - test for AWS SimpleDB
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
    plan = tap.plan,
    _ = require('underscore');
var amazon;
var simpledb;

// --------------------------------------------------------------------------------------------------------------------
// basic tests

test("load simpledb", function (t) {
    simpledb = require("../lib/simpledb");
    t.ok(simpledb, "object loaded");

    amazon = require("../lib/amazon");
    t.ok(amazon, "object loaded");

    t.end();
});

test("create simpledb object", function (t) {
    var sdb = new simpledb.SimpleDB('access_key_id', 'secret_access_key', amazon.US_WEST_1);

    t.equal('access_key_id', sdb.accessKeyId(), 'Access Key ID set properly');
    t.equal('secret_access_key', sdb.secretAccessKey(), 'Secret Access Key set properly');
    t.equal(2, sdb.region(), 'Region is set properly');

    t.end();
});

test("test all endpoints", function (t) {
    var sdb1 = new simpledb.SimpleDB('access_key_id', 'secret_access_key', amazon.US_EAST_1);
    var sdb2 = new simpledb.SimpleDB('access_key_id', 'secret_access_key', amazon.US_WEST_1);
    var sdb3 = new simpledb.SimpleDB('access_key_id', 'secret_access_key', amazon.EU_WEST_1);
    var sdb4 = new simpledb.SimpleDB('access_key_id', 'secret_access_key', amazon.AP_SOUTHEAST_1);
    var sdb5 = new simpledb.SimpleDB('access_key_id', 'secret_access_key', amazon.AP_NORTHEAST_1);

    t.equal('sdb.amazonaws.com', sdb1.endPoint(), '1) Endpoint is correct');
    t.equal('sdb.us-west-1.amazonaws.com', sdb2.endPoint(), '2) Endpoint is correct');
    t.equal('sdb.eu-west-1.amazonaws.com', sdb3.endPoint(), '3) Endpoint is correct');
    t.equal('sdb.ap-southeast-1.amazonaws.com', sdb4.endPoint(), '4) Endpoint is correct');
    t.equal('sdb.ap-northeast-1.amazonaws.com', sdb5.endPoint(), '5) Endpoint is correct');

    t.end();
});

test("test signature", function (t) {
    var sdb = new simpledb.SimpleDB('access_key_id', 'secret_access_key', amazon.US_WEST_1);

    var paramsEmpty = [];
    var sigEmpty = sdb.signature(paramsEmpty);
    t.equal(sigEmpty, '5HvhU2YfRnYOIcSCUHb5e6IbSj/zPcWzh6G+W7r76b4=', 'Signature of empty params');

    var paramsCommon = [];
    paramsCommon.push({ 'name' : 'AWSAccessKeyId', 'value' : sdb.accessKeyId() });
    paramsCommon.push({ 'name' : 'Version', 'value' : '2009-04-15' });
    paramsCommon.push({ 'name' : 'Timestamp', 'value' : '2011-10-17T18:35:02.878Z' });
    paramsCommon.push({ 'name' : 'SignatureVersion', 'value' : 2 });
    paramsCommon.push({ 'name' : 'SignatureMethod', 'value' : 'HmacSHA256' });
    var sigCommon = sdb.signature(paramsCommon);
    t.equal(sigEmpty, '5HvhU2YfRnYOIcSCUHb5e6IbSj/zPcWzh6G+W7r76b4=', 'Signature of common params');

    t.end();
});

test("test param values", function (t) {
    var sdb = new simpledb.SimpleDB('access_key_id', 'secret_access_key', amazon.US_WEST_1);

    var params1 = sdb.dataToAttributes({ 'username' : 'chilts' });
    var result1 = [
        { 'name' : 'Attribute.0.Name',  'value' : 'username' },
        { 'name' : 'Attribute.0.Value', 'value' : 'chilts'   }
    ];
    t.ok(_.isEqual(params1, result1), '1) Deep compare of params');

    var params2 = sdb.dataToAttributes([{ 'name' : 'username', 'value' : 'chilts' }]);
    var result2 = [
        { 'name' : 'Attribute.0.Name',  'value' : 'username' },
        { 'name' : 'Attribute.0.Value', 'value' : 'chilts'   }
    ];
    t.ok(_.isEqual(params2, result2), '2) Deep compare of params');

    var params3 = sdb.dataToAttributes([{ name : 'username', value : 'chilts', replace : true }]);
    var result3 = [
        { 'name' : 'Attribute.0.Name',  'value' : 'username' },
        { 'name' : 'Attribute.0.Value', 'value' : 'chilts'   },
        { 'name' : 'Attribute.0.Replace', 'value' : 'true'   }
    ];
    t.ok(_.isEqual(params3, result3), '3) Deep compare of params');

    var params4 = sdb.dataToAttributes([{ name : 'username', value : 'chilts', exists : false }]);
    var result4 = [
        { 'name' : 'Attribute.0.Name',  'value' : 'username' },
        { 'name' : 'Attribute.0.Value', 'value' : 'chilts'   },
        { 'name' : 'Expected.0.Name',   'value' : 'username' },
        { 'name' : 'Expected.0.Exists', 'value' : 'false'    }
    ];
    t.ok(_.isEqual(params4, result4), '4) Deep compare of params');

    var params5 = sdb.dataToAttributes([{ name : 'username', value : 'chilts', expected : 'pie' }]);
    var result5 = [
        { 'name' : 'Attribute.0.Name',  'value' : 'username' },
        { 'name' : 'Attribute.0.Value', 'value' : 'chilts'   },
        { 'name' : 'Expected.0.Name',   'value' : 'username' },
        { 'name' : 'Expected.0.Value',  'value' : 'pie'      }
    ];
    t.ok(_.isEqual(params5, result5), '5) Deep compare of params');

    var params6 = sdb.dataToAttributes([{ name : 'username', value : 'chilts', exists : true, expected : 'pie' }]);
    var result6 = [
        { 'name' : 'Attribute.0.Name',  'value' : 'username' },
        { 'name' : 'Attribute.0.Value', 'value' : 'chilts'   },
        { 'name' : 'Expected.0.Name',   'value' : 'username' },
        { 'name' : 'Expected.0.Value',  'value' : 'pie'      }
    ];
    t.ok(_.isEqual(params6, result6), '6) Deep compare of params');

    t.end();
});

test("test failed param conversion", function (t) {
    // ToDo: check when we pass the wrong thing in
    t.end();
});

// --------------------------------------------------------------------------------------------------------------------
