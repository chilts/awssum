// --------------------------------------------------------------------------------------------------------------------
//
// iam.js - class for AWS Identity and Access Management
//
// Copyright (c) 2011, 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
// requires

// built-ins
var util = require('util');

// dependencies
var _ = require('underscore');

// our own
var awssum = require('../awssum');
var amazon = require('./amazon');
var operations = require('./iam-config');

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 'iam: ';

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html
var endPoint = {};
endPoint[amazon.US_EAST_1]      = "iam.amazonaws.com";
endPoint[amazon.US_GOV_WEST_1]  = "iam.us-gov.amazonaws.com";

var version = '2010-05-08';

// --------------------------------------------------------------------------------------------------------------------
// constructor

var Iam = function(opts) {
    var self = this;

    // call the superclass for initialisation
    Iam.super_.call(this, opts);

    // check the region is valid
    if ( ! endPoint[opts.region] ) {
        throw MARK + "invalid region '" + opts.region + "'";
    }

    return self;
};

// inherit from Amazon
util.inherits(Iam, amazon.Amazon);

// --------------------------------------------------------------------------------------------------------------------
// methods we need to implement from awssum.js/amazon.js

Iam.prototype.host = function() {
    return endPoint[this.region()];
};

Iam.prototype.version = function() {
    return version;
};

// --------------------------------------------------------------------------------------------------------------------
// operations on the service

_.each(operations, function(operation, operationName) {
    Iam.prototype[operationName] = awssum.makeOperation(operation);
});

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.Iam = Iam;

// --------------------------------------------------------------------------------------------------------------------
