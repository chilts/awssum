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
    plan = tap.plan;
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
})

test("create simpledb object", function (t) {
    var sdb = new simpledb.SimpleDB('access_key_id', 'secret_access_key', amazon.US_WEST_1);

    t.equal('access_key_id', sdb.accessKeyId(), 'Access Key ID set properly');
    t.equal('secret_access_key', sdb.secretAccessKey(), 'Secret Access Key set properly');
    t.equal(2, sdb.region(), 'Region is set properly');

    t.end();
})

// --------------------------------------------------------------------------------------------------------------------
