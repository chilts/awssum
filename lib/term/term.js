// --------------------------------------------------------------------------------------------------------------------
//
// term.js - class for the term.ie OAuth 1.0a test server
//
// Copyright (c) 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
// requires

// built-ins
var util = require("util");

// dependencies
var _ = require('underscore');

// our own library
var awssum = require('../awssum');
var oauth = awssum.load('oauth');
var operations = require('./term-config');

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 'term: ';

// --------------------------------------------------------------------------------------------------------------------
// constructor

var Term = function(oauthConsumerKey, oauthConsumerSecret) {
    var self = this;

    // call the superclass for initialisation
    Term.super_.call(this, oauthConsumerKey, oauthConsumerSecret);

    return self;
};

// inherit from oauth.OAuth
util.inherits(Term, oauth.OAuth);

// --------------------------------------------------------------------------------------------------------------------
// functions to be overriden by inheriting class

Term.prototype.protocol = function() {
    return 'http';
};

Term.prototype.parameterTransmission = function() {
    return 'header';
};

Term.prototype.host = function() {
    return 'term.ie';
};

Term.prototype.requestTokenHost = function() {
    return 'term.ie';
};
Term.prototype.requestTokenPath = function() {
    return '/oauth/example/request_token.php';
};
Term.prototype.accessTokenHost = function() {
    return 'term.ie/';
};
Term.prototype.accessTokenPath = function() {
    return '/oauth/example/access_token.php';
};
Term.prototype.accessTokenHost = function() {
    return 'term.ie';
};
Term.prototype.accessTokenPath = function() {
    return '/oauth/example/access_token.php';
};

// --------------------------------------------------------------------------------------------------------------------
// operations on the service

_.each(operations, function(operation, operationName) {
    Term.prototype[operationName] = awssum.makeOperation(operation);
});

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.Term = Term;

// --------------------------------------------------------------------------------------------------------------------
