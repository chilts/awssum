/**
 * simpledb.js - class for AWS SimpleDB
 *
 * Copyright (c) 2011 AppsAttic Ltd - http://www.appsattic.com/
 * Written by Andrew Chilton <chilts@appsattic.com>
 *
**/

var util = require("util");
var amazon = require ("./amazon");

// package variables

var MARK = 'awssum-simpledb: ';

var endPoint = {
    "us-east-1" : "sdb.amazonaws.com",
    "us-west-1" : "sdb.us-west-1.amazonaws.com",
    "eu-west-1" : "sdb.eu-west-1.amazonaws.com",
    "ap-southeast-1" : "sdb.ap-southeast-1.amazonaws.com	",
    "ap-northeast-1" : "sdb.ap-northeast-1.amazonaws.com"
};

var version = "2009-04-15";

var SimpleDB = function(accessKeyId, secretAccessKey, region) {
    var self = this;

    // check the region is valid
    if ( ! endPoint[region] ) {
        throw MARK + "invalid region '" + region + "'";
    }

    // save our private variables
    self.accessKeyId = accessKeyId;
    self.secretAccessKey = secretAccessKey;
    self.region = region;

    return self;
};

// inherit from Amazon
util.inherits(SimpleDB, amazon.Amazon);

SimpleDB.prototype.endPoint = function() {
    return endPoint[this.region];
};

// define our exports
exports.SimpleDB = SimpleDB;
