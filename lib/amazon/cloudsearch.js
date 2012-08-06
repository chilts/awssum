// --------------------------------------------------------------------------------------------------------------------
//
// cloudsearch.js - class for AWS CloudSearch
//
// Copyright (c) 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------
// requires

// built-ins
var util = require('util');
var crypto = require('crypto');

// dependencies
var _ = require('underscore');
var dateFormat = require('dateformat');

// our own
var awssum = require('../awssum');
var amazon = awssum.load('amazon/amazon');
var operations = require('./cloudsearch-config');
var awsSignatureV4 = require('./aws-signature-v4');

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 'cloudsearch: ';

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html
var endPoint = {};
endPoint[amazon.US_EAST_1]      = "cloudsearch.us-east-1.amazonaws.com";
// endPoint[amazon.US_WEST_1]      = "";
// endPoint[amazon.US_WEST_2]      = "";
// endPoint[amazon.EU_WEST_1]      = "";
// endPoint[amazon.AP_SOUTHEAST_1] = "";
// endPoint[amazon.AP_NORTHEAST_1] = "";
// endPoint[amazon.SA_EAST_1]      = "";
// endPoint[amazon.US_GOV_WEST_1]  = "";

var version = '2011-02-01';

// --------------------------------------------------------------------------------------------------------------------
// constructor

var CloudSearch = function(opts) {
    var self = this;

    // we only have one region for this service, so default it here
    opts.region = amazon.US_EAST_1;

    // call the superclass for initialisation
    CloudSearch.super_.call(this, opts);

    return self;
};

// inherit from Amazon
util.inherits(CloudSearch, amazon.Amazon);

// --------------------------------------------------------------------------------------------------------------------
// methods we need to implement from amazon.js

CloudSearch.prototype.scope = function() {
    return 'cloudsearch';
};

CloudSearch.prototype.serviceName = function() {
    return 'CloudSearch';
};

CloudSearch.prototype.method = function() {
    return 'POST';
};

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html
CloudSearch.prototype.host = function(args) {
    return 'cloudsearch.us-east-1.amazonaws.com';
};

CloudSearch.prototype.version = function() {
    return version;
};

// This service uses the AWS Signature v4.
// Hopefully, it fulfills : http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/requestauth.html
CloudSearch.prototype.strToSign        = awsSignatureV4.strToSign;
CloudSearch.prototype.signature        = awsSignatureV4.signature;
CloudSearch.prototype.addSignature     = awsSignatureV4.addSignature;
CloudSearch.prototype.addCommonOptions = awsSignatureV4.addCommonOptions;

// --------------------------------------------------------------------------------------------------------------------
// operations on the service

_.each(operations, function(operation, operationName) {
    CloudSearch.prototype[operationName] = awssum.makeOperation(operation);
});

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.CloudSearch = CloudSearch;

// --------------------------------------------------------------------------------------------------------------------
