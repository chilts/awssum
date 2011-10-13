/**
 * awssum.js - the base class for all web services in node-awssum
 *
 * Copyright (c) 2011 AppsAttic Ltd - http://www.appsattic.com/
 * Written by Andrew Chilton <chilts@appsattic.com>
 *
**/

var AwsSum = exports.AwsSum = function() {
    throw MARK + 'program error, this constructor should never be called';
}

AwsSum.prototype.endPoint = function url() {
    throw MARK + 'program error, inheriting class must override endPoint()';
};

AwsSum.prototype.url = function url() {
    throw MARK + 'program error, inheriting class must override url()';
};

AwsSum.prototype.sign = function() {
    console.log("Signing the AwsSum request");
}
