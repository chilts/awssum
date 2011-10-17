// --------------------------------------------------------------------------------------------------------------------
//
// test-amazon.js - test for AWS Amazon
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

// --------------------------------------------------------------------------------------------------------------------
