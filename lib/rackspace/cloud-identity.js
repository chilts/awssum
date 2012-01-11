// --------------------------------------------------------------------------------------------------------------------
//
// rackspace/cloud-identity.js - class for RackspaceCloud Identity Service
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

var _ = require('underscore');

var awssum = require ("../awssum");
var rackspace = awssum.load('rackspace/rackspace');
var operations = require('./cloud-identity-config.js');

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 'rackspace-cloud-identity: ';

// var version = 'v2.0';

// From: http://docs.rackspace.com/cdns/api/v1.0/cdns-devguide/content/Authentication-d1e647.html
var endPoint = {};
endPoint[rackspace.ORD] =     'auth.api.rackspacecloud.com';
endPoint[rackspace.UK]  = 'lon.auth.api.rackspacecloud.com';

// --------------------------------------------------------------------------------------------------------------------
// constructor

var Identity = function(options) {
    var self = this;

    // From: http://docs.rackspace.com/auth/api/v2.0/auth-client-devguide/content/QuickStart-000.html
    // You can use either a username/password or username/apikey combination.

    if ( options.username ) {
        self.username = options.username;
    }
    else {
        throw MARK + 'provide a username';
    }

    if ( options.password ) {
        self.type = 'password';
        self.password = options.password;
    }
    else if ( options.apiKey ) {
        self.type = 'key';
        self.apiKey = options.apiKey;
    }
    else {
        throw MARK + 'provide either a password or an apiKey';
    }

    // check the region is valid
    if ( endPoint[options.region] ) {
        this.region = options.region;
    }
    else {
        throw MARK + "invalid region '" + options.region + "'";
    }

    // call the superclass for initialisation
    // Authentication.super_.call(this, username, apiKey, region);

    return self;
};

// inherit from AwsSum
util.inherits(Identity, rackspace.Rackspace);

// --------------------------------------------------------------------------------------------------------------------
// methods we need to implement from awssum.js

Identity.prototype.host = function() {
    return endPoint[this.region];
};

// --------------------------------------------------------------------------------------------------------------------
// operations on the service

_.each(operations, function(operation, operationName) {
    Identity.prototype[operationName] = awssum.makeOperation(operation);
});

// --------------------------------------------------------------------------------------------------------------------
// exports

module.exports = Identity;

// --------------------------------------------------------------------------------------------------------------------
