// --------------------------------------------------------------------------------------------------------------------
//
// amazon.js - the base class for all Amazon Web Services
//
// Copyright (c) 2011 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
// requires

var util = require("util");
var awssum = require ("./awssum");

// --------------------------------------------------------------------------------------------------------------------
// constants

var MARK = 'amazon: ';

var US_EAST_1 = 1;
var US_WEST_1 = 2;
var EU_WEST_1 = 3;
var AP_SOUTHEAST_1 = 4;
var AP_NORTHEAST_1 = 5;
var US_GOVCLOUD_1 = 6;

var Region = {
    US_EAST_1 : true,
    US_WEST_1 : true,
    EU_WEST_1 : true,
    AP_SOUTHEAST_1 : true,
    AP_SOUTHWEST_1 : true,
    US_GOVCLOUD_1 : true,
};

// --------------------------------------------------------------------------------------------------------------------
// constructor

var Amazon = function(accessKeyId, secretAccessKey, region) {
    var self = this;

    // call the superclass for initialisation
    Amazon.super_.call(this);

    // allow access to (but not change) these variables
    self.accessKeyId     = function() { return accessKeyId;     };
    self.secretAccessKey = function() { return secretAccessKey; };
    self.region          = function() { return region;          };

    return self;
}

// inherit from AwsSum
util.inherits(Amazon, awssum.AwsSum);

// --------------------------------------------------------------------------------------------------------------------
// functions to be overriden by inheriting class

Amazon.prototype.signature = function() {
    // default signature method for Amazon
    throw MARK + 'ToDo: signature()';
};

// --------------------------------------------------------------------------------------------------------------------
// exports

// constants
exports.US_EAST_1 = US_EAST_1;
exports.US_WEST_1 = US_WEST_1;
exports.EU_WEST_1 = EU_WEST_1;
exports.AP_SOUTHEAST_1 = AP_SOUTHEAST_1;
exports.AP_NORTHEAST_1 = AP_NORTHEAST_1;
exports.US_GOVCLOUD_1 = US_GOVCLOUD_1;

exports.Region = Region;

// object constructor
exports.Amazon = Amazon;

// --------------------------------------------------------------------------------------------------------------------
