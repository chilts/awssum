// --------------------------------------------------------------------------------------------------------------------
//
// simpledb.js - test for AWS SimpleDB
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
    var sdb = new simpledb.SimpleDB('access_key_id', 'secret_access_key', 'aws_account_id', amazon.US_WEST_1);

    t.equal('access_key_id', sdb.accessKeyId(), 'Access Key ID set properly');
    t.equal('secret_access_key', sdb.secretAccessKey(), 'Secret Access Key set properly');
    t.equal('aws_account_id', sdb.awsAccountId(), 'AWS Account ID set properly');
    t.equal('California', sdb.region(), 'Region is set properly');

    t.end();
});

test("test all endpoints", function (t) {
    var sdb1 = new simpledb.SimpleDB('access_key_id', 'secret_access_key', 'aws_account_id', amazon.US_EAST_1);
    var sdb2 = new simpledb.SimpleDB('access_key_id', 'secret_access_key', 'aws_account_id', amazon.US_WEST_1);
    var sdb3 = new simpledb.SimpleDB('access_key_id', 'secret_access_key', 'aws_account_id', amazon.EU_WEST_1);
    var sdb4 = new simpledb.SimpleDB('access_key_id', 'secret_access_key', 'aws_account_id', amazon.AP_SOUTHEAST_1);
    var sdb5 = new simpledb.SimpleDB('access_key_id', 'secret_access_key', 'aws_account_id', amazon.AP_NORTHEAST_1);

    t.equal('sdb.amazonaws.com', sdb1.endPoint(), '1) Endpoint is correct');
    t.equal('sdb.us-west-1.amazonaws.com', sdb2.endPoint(), '2) Endpoint is correct');
    t.equal('sdb.eu-west-1.amazonaws.com', sdb3.endPoint(), '3) Endpoint is correct');
    t.equal('sdb.ap-southeast-1.amazonaws.com', sdb4.endPoint(), '4) Endpoint is correct');
    t.equal('sdb.ap-northeast-1.amazonaws.com', sdb5.endPoint(), '5) Endpoint is correct');

    t.end();
});

test("test our own escape(...)", function (t) {
    var sdb = new simpledb.SimpleDB('access_key_id', 'secret_access_key', 'aws_account_id', amazon.US_WEST_1);

    var query1 = 'DomainName';
    var escQuery1 = sdb.escape(query1);
    t.equal(escQuery1, 'DomainName', 'Simple String (idempotent)');

    var query2 = 2;
    var escQuery2 = sdb.escape(query2);
    t.equal(escQuery2, '2', 'Simple Number Escape (idempotent)');

    var query3 = 'String Value';
    var escQuery3 = sdb.escape(query3);
    t.equal(escQuery3, 'String%20Value', 'Simple With a Space');

    var query4 = 'Hey @andychilton, read this! #liverpool';
    var escQuery4 = sdb.escape(query4);
    t.equal(escQuery4, 'Hey%20%40andychilton%2C%20read%20this%21%20%23liverpool', 'Something akin to a Tweet');

    var query5 = 'SELECT * FROM my_table';
    var escQuery5 = sdb.escape(query5);
    t.equal(escQuery5, 'SELECT%20%2A%20FROM%20my_table', 'Escaping of a select');

    t.end();
});

test("test PutAttributes", function (t) {
    var sdb = new simpledb.SimpleDB('access_key_id', 'secret_access_key', 'aws_account_id', amazon.US_WEST_1);

    var params1 = sdb.dataToPutAttributes({ 'username' : 'chilts' });
    var result1 = [
        { 'name' : 'Attribute.0.Name',  'value' : 'username' },
        { 'name' : 'Attribute.0.Value', 'value' : 'chilts'   }
    ];
    t.ok(_.isEqual(params1, result1), '1) Deep compare of params');

    var params2 = sdb.dataToPutAttributes([{ 'name' : 'username', 'value' : 'chilts' }]);
    var result2 = [
        { 'name' : 'Attribute.0.Name',  'value' : 'username' },
        { 'name' : 'Attribute.0.Value', 'value' : 'chilts'   }
    ];
    t.ok(_.isEqual(params2, result2), '2) Deep compare of params');

    var params3 = sdb.dataToPutAttributes([{ name : 'username', value : 'chilts', replace : true }]);
    var result3 = [
        { 'name' : 'Attribute.0.Name',  'value' : 'username' },
        { 'name' : 'Attribute.0.Value', 'value' : 'chilts'   },
        { 'name' : 'Attribute.0.Replace', 'value' : 'true'   }
    ];
    t.ok(_.isEqual(params3, result3), '3) Deep compare of params');

    var params4 = sdb.dataToPutAttributes([{ name : 'username', value : 'chilts', exists : false }]);
    var result4 = [
        { 'name' : 'Attribute.0.Name',  'value' : 'username' },
        { 'name' : 'Attribute.0.Value', 'value' : 'chilts'   },
        { 'name' : 'Expected.0.Name',   'value' : 'username' },
        { 'name' : 'Expected.0.Exists', 'value' : 'false'    }
    ];
    t.ok(_.isEqual(params4, result4), '4) Deep compare of params');

    var params5 = sdb.dataToPutAttributes([{ name : 'username', value : 'chilts', expected : 'pie' }]);
    var result5 = [
        { 'name' : 'Attribute.0.Name',  'value' : 'username' },
        { 'name' : 'Attribute.0.Value', 'value' : 'chilts'   },
        { 'name' : 'Expected.0.Name',   'value' : 'username' },
        { 'name' : 'Expected.0.Value',  'value' : 'pie'      }
    ];
    t.ok(_.isEqual(params5, result5), '5) Deep compare of params');

    var params6 = sdb.dataToPutAttributes([{ name : 'username', value : 'chilts', exists : true, expected : 'pie' }]);
    var result6 = [
        { 'name' : 'Attribute.0.Name',  'value' : 'username' },
        { 'name' : 'Attribute.0.Value', 'value' : 'chilts'   },
        { 'name' : 'Expected.0.Name',   'value' : 'username' },
        { 'name' : 'Expected.0.Value',  'value' : 'pie'      }
    ];
    t.ok(_.isEqual(params6, result6), '6) Deep compare of params');

    t.end();
});

test("test DeleteAttributes", function (t) {
    var sdb = new simpledb.SimpleDB('access_key_id', 'secret_access_key', 'aws_account_id', amazon.US_WEST_1);

    var params1 = sdb.dataToDeleteAttributes({ 'username' : 'chilts' });
    var result1 = [
        { 'name' : 'Attribute.0.Name',  'value' : 'username' },
        { 'name' : 'Attribute.0.Value', 'value' : 'chilts'   }
    ];
    t.ok(_.isEqual(params1, result1), '1) Deep compare of params');

    var params2 = sdb.dataToDeleteAttributes([{ 'name' : 'username' }]);
    var result2 = [
        { 'name' : 'Attribute.0.Name',  'value' : 'username' }
    ];
    t.ok(_.isEqual(params2, result2), '2) Deep compare of params');

    var params3 = sdb.dataToDeleteAttributes([{ name : 'username', value : 'chilts', exists : false }]);
    var result3 = [
        { 'name' : 'Attribute.0.Name',  'value' : 'username' },
        { 'name' : 'Attribute.0.Value', 'value' : 'chilts'   },
        { 'name' : 'Expected.0.Name',   'value' : 'username' },
        { 'name' : 'Expected.0.Exists', 'value' : 'false'    }
    ];
    t.ok(_.isEqual(params3, result3), '3) Deep compare of params');

    var params4a = sdb.dataToDeleteAttributes([{ name : 'username', value : 'chilts', expected : 'andychilton' }]);
    var params4b = sdb.dataToDeleteAttributes([
        { name : 'username', value : 'chilts', expected : 'andychilton', exists : true }
    ]);
    var result4 = [
        { 'name' : 'Attribute.0.Name',  'value' : 'username' },
        { 'name' : 'Attribute.0.Value', 'value' : 'chilts'   },
        { 'name' : 'Expected.0.Name',   'value' : 'username' },
        { 'name' : 'Expected.0.Value',  'value' : 'andychilton' }
    ];
    t.ok(_.isEqual(params4a, result4), '4a) Deep compare of params');
    t.ok(_.isEqual(params4b, result4), '4b) Deep compare of params');

    var params5 = sdb.dataToDeleteAttributes([
        { name : 'username', value : 'chilts' },
        { name : 'url',      value : 'http://www.appsattic.com/' },
    ]);
    var result5 = [
        { 'name' : 'Attribute.0.Name',  'value' : 'username' },
        { 'name' : 'Attribute.0.Value', 'value' : 'chilts'   },
        { 'name' : 'Attribute.1.Name',  'value' : 'url'      },
        { 'name' : 'Attribute.1.Value', 'value' : 'http://www.appsattic.com/' },
    ];
    t.ok(_.isEqual(params5, result5), '5) Deep compare of params');

    t.end();
});

test("'failed param conversion' test", function (t) {
    // ToDo: check when we pass the wrong thing in
    t.end();
});

// --------------------------------------------------------------------------------------------------------------------
