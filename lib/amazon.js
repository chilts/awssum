/**
 * amazon.js - the base class for all Amazon Web Services
 *
 * Copyright (c) 2011 AppsAttic Ltd - http://www.appsattic.com/
 * Written by Andrew Chilton <chilts@appsattic.com>
 *
**/

var util = require("util");
var awssum = require ("./awssum");

var Amazon = function(awsAccessKey, awsPrivateKey, region) {
    var self = this;
    console.log('Amazon(): start of constructor');

    // call the superclass for initialisation
    self.super_.call(this);

    // set up out private vars
    self.awsAccessKey = awsAccessKey;
    self.awsPrivateKey = awsPrivateKey;
    self.region = region;

    console.log('amazon(): end of constructor');
    return self;
}

// inherit from AwsSum
util.inherits(Amazon, awssum.AwsSum);

/**
 * Signs this request.
 *
 * @param {Array|Object} docs
 * @param {Object} options (optional)
 * @param {Function} callback (optional)
 * @return {Collection}
 */

Amazon.prototype.sign = function() {
    // this is a default signature method for Amazon
    // ...
    console.log("sign: signing the Amazon request");
};

Amazon.prototype.endPoint = function() {
    throw MARK + 'program error, inheriting class must override url()';
};

// define our exports
exports.Amazon = Amazon;
