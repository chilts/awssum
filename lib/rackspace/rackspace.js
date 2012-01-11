// --------------------------------------------------------------------------------------------------------------------
//
// rackspace.js - the base class for all Rackspace Cloud Services
//
// Copyright (c) 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
// requires

var util = require('util');

var awssum = require ("../awssum");

// --------------------------------------------------------------------------------------------------------------------
// constants

var MARK = 'rackspace: ';

var ORD = 'ORD';
var UK  = 'UK';

var Region = {
    ORD : true,
    UK  : true,
};

// --------------------------------------------------------------------------------------------------------------------
// constructor

var Rackspace = function(options) {
    var self = this;

    // call the AwsSum superclass for initialisation
    Rackspace.super_.call(this);

    // at the moment, we don't care about having an auth token since we may actually be trying to get one

    return self;
}

// inherit from AwsSum
util.inherits(Rackspace, awssum.AwsSum);

// --------------------------------------------------------------------------------------------------------------------
// methods specific to Rackspace

Rackspace.prototype.setAuthToken = function(token) {
    this._authToken = token;
}

Rackspace.prototype.authToken = function() {
    return this._authToken;
}

// --------------------------------------------------------------------------------------------------------------------
// overiding functions

Rackspace.prototype.extractBody = function() {
    // all Rackspace services return JSON
    return 'json';
};

Rackspace.prototype.addCommonOptions = function(options, args) {
    var self = this;

    // always add a Content-Type header for 'application/json'
    options.headers['Content-Type'] = 'application/json';
};

// --------------------------------------------------------------------------------------------------------------------
// exports

// constants
exports.ORD = ORD;
exports.UK  = UK;

// object constructor
exports.Rackspace = Rackspace;

// --------------------------------------------------------------------------------------------------------------------
