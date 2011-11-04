// --------------------------------------------------------------------------------------------------------------------
//
// awssum.js - the base class for all web services in node-awssum
//
// Copyright (c) 2011 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
// constants

var MARK = 'awssum: ';

// --------------------------------------------------------------------------------------------------------------------
// constructor

var AwsSum = function() {
    var self = this;
    return self;
}

// --------------------------------------------------------------------------------------------------------------------
// functions to be overriden by inheriting class

AwsSum.prototype.host = function() {
    throw MARK + 'program error, inheriting class must override host()';
};

AwsSum.prototype.verb = function() {
    return 'GET';
}

AwsSum.prototype.url = function() {
    throw MARK + 'program error, inheriting class must override url()';
};

AwsSum.prototype.signature = function() {
    throw MARK + 'program error, inheriting class must override signature()';
};

// --------------------------------------------------------------------------------------------------------------------
// utility methods

AwsSum.prototype.makeRequest = function makeRequest() {
    throw MARK + 'ToDo: makeRequest()';
};

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.AwsSum = AwsSum;
exports.version = '0.1.0';

// --------------------------------------------------------------------------------------------------------------------
