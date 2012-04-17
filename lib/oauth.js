// --------------------------------------------------------------------------------------------------------------------
//
// oauth.js - the base class for all Oauth 1.0a web services in node-awssum
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
var util = require('util');
var crypto = require('crypto');

// dependencies
var _ = require('underscore');
var passgen = require('passgen');

// our own
var awssum = require('./awssum');
var escape = require('../lib/escape.js');

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 'oauth: ';

var debug = false;

// --------------------------------------------------------------------------------------------------------------------
// constructor

var OAuth = function(oauthConsumerKey, oauthConsumerSecret) {
    var self = this;

    // call the superclass for initialisation
    OAuth.super_.call(this);

    // check that we have each of these values
    if ( ! oauthConsumerKey ) {
        throw MARK + 'oauthConsumerKey is required';
    }
    if ( ! oauthConsumerSecret ) {
        throw MARK + 'oauthConsumerSecret is required';
    }

    // allow setting of these variables
    var oauthTokenVerifier, oauthToken, oauthTokenSecret;
    self.setOAuthTokenVerifier = function(str) { oauthTokenVerifier = str; };
    self.setOAuthToken         = function(str) { oauthToken         = str; };
    self.setOAuthTokenSecret   = function(str) { oauthTokenSecret   = str; };

    // and allow access to them
    self.oauthToken            = function() { return oauthToken;           };
    self.oauthTokenSecret      = function() { return oauthTokenSecret;     };

    // allow access to (but not change) these variables
    self.oauthConsumerKey    = function() { return oauthConsumerKey;    };
    self.oauthConsumerSecret = function() { return oauthConsumerSecret; };

    return self;
};

// inherit from AwsSum
util.inherits(OAuth, awssum.AwsSum);

// --------------------------------------------------------------------------------------------------------------------
// extra request headers

function extrasContentLength(options, args) {
    var self = this;

    // add the Content-Length header we need
    if ( args.ContentLength ) {
        options.headers['Content-Length'] = args.ContentLength;
        return;
    }
    if ( options.body ) {
        options.headers['Content-Length'] = options.body.length;
        return;
    }
    // else, it must be zero
    options.headers['Content-Length'] = 0;
}

// --------------------------------------------------------------------------------------------------------------------
// functions common between all OAuth services

var RequestToken = {
    // request
    'method'      : 'POST',
    'host'        : function() { return this.requestTokenHost(); },
    'path'        : function() { return this.requestTokenPath(); },
    'args'        : {
        'oauth_callback' : {
            required : true,
            type     : 'param',
        },
    },
    'addExtras' : extrasContentLength, // required for Tumblr, Twitter is fine without it
    // response
    // [none]
};

OAuth.prototype['RequestToken'] = awssum.makeOperation(RequestToken);

// --------------------------------------------------------------------------------------------------------------------
// functions to be overriden by inheriting class

// see ./awssum.js, plus additional methods such as:
//
// * requestTokenHost
// * requestTokenPath
// * authorizeHost
// * authorizePath
// * accessTokenHost
// * accessTokenPath

OAuth.prototype.protocol = function() {
    return 'https';
};

OAuth.prototype.parameterTransmission = function() {
    // From: http://tools.ietf.org/html/rfc5849#section-3.5
    // could be 'header', 'body' or 'param'
    return 'param';
};

OAuth.prototype.addCommonOptions = function(options, args) {
    var self = this;

    // get the date in epoch
    var timestamp = parseInt((new Date()).valueOf()/1000);
    var nonce = passgen.create(12);

    // add in the common params for OAuth 1.0a

    // sign ALL of the params, including those passed in and those for OAuth
    var params = [];
    options.params.forEach(function(v, i) {
        params.push(v);
    });
    if ( self.parameterTransmission() === 'param' ) {
        options.params.push({ 'name' : 'oauth_version',          'value' : '1.0'                     });
        options.params.push({ 'name' : 'oauth_consumer_key',     'value' : self.oauthConsumerKey()   });
        // oauth_callback is set in RequestToken
        options.params.push({ 'name' : 'oauth_timestamp',        'value' : timestamp                 });
        options.params.push({ 'name' : 'oauth_nonce',            'value' : nonce                     });
        options.params.push({ 'name' : 'oauth_signature_method', 'value' : 'HMAC-SHA1'               });
    }

    // make the signature
    var strToSign = escape(options.method.toUpperCase()) + '&' + escape(self.protocol() + '://' + self.requestTokenHost() + options.path);
    var pairs = _(options.params)
        .chain()
        .sortBy(function(p) { return p.name })
        .map(function(v, i) { return '' + v.name + '=' + v.value })
        .join('&')
        .value()
    ;
    strToSign += '&' + escape(pairs);

    // sign the request string
    var signatureKey = escape(self.oauthConsumerSecret()) + '&';
    if ( self.oauthTokenSecret() ) {
        signatureKey += escape(self.oauthTokenSecret());
    }

    var signature = crypto
        .createHmac('sha1', signatureKey)
        .update(strToSign)
        .digest('base64');

    // add the 'Authorization' header
    if ( self.parameterTransmission() === 'header' ) {
        options.headers['Authorization'] = 'OAuth ' + [
            'oauth_version="1.0"',
            'oauth_consumer_key="' + escape(self.oauthConsumerKey()) + '"',
            'oauth_callback="' + escape(args.oauth_callback) + '"',
            'oauth_timestamp="' + escape(timestamp)  + '"',
            'oauth_nonce="' + nonce + '"',
            'oauth_signature_method="HMAC-SHA1"',
            'oauth_signature="' + escape(signature) + '"',
        ].join(', ');
    }
    else if ( self.parameterTransmission() === 'param' ) {
        // add the oauth_signature onto the params
        options.params.push({ 'name' : 'oauth_signature', 'value' : signature });
    }

    if ( debug ) {
        console.log('---');
        console.log(signatureKey);
        console.log('---');
        console.log(strToSign);
        console.log('---');
        console.log(signature);
        console.log('---');
        console.log(options.headers);
        console.log('---');
        console.log(options.params);
        console.log('---');
        // process.exit();
    }
};

OAuth.prototype.extractBody = function() {
    // most OAuth things return an encoded form
    return 'application/x-www-form-urlencoded';
};

// --------------------------------------------------------------------------------------------------------------------
// exports

// object constructor
exports.OAuth = OAuth;

// --------------------------------------------------------------------------------------------------------------------
