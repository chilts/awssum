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

AwsSum.prototype.verb = function() {
    return 'GET';
}

AwsSum.prototype.signature = function() {
    // default signature method for Amazon
    throw MARK + 'program error, inheriting class must override signature()';
};

AwsSum.prototype.endPoint = function() {
    throw MARK + 'program error, inheriting class must override endPoint()';
};

AwsSum.prototype.url = function() {
    throw MARK + 'program error, inheriting class must override url()';
};

// --------------------------------------------------------------------------------------------------------------------
// utility methods

AwsSum.prototype.makeRequest = function makeRequest() {
    throw MARK + 'ToDo: makeRequest()';
};

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.AwsSum = AwsSum;

// --------------------------------------------------------------------------------------------------------------------
