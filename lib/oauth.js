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

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 'oauth: ';

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

    // allow access to (but not change) these variables
    self.oauthConsumerKey    = function() { return oauthConsumerKey;    };
    self.oauthConsumerSecret = function() { return oauthConsumerSecret; };

    return self;
};

// inherit from AwsSum
util.inherits(OAuth, awssum.AwsSum);

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
    // response
    'statusCode'  : 200,
    'extractBody' : 'blob',
    // 'extractBody' : 'application/x-www-form-urlencoded',
};

OAuth.prototype['RequestToken'] = awssum.makeOperation(RequestToken);

// --------------------------------------------------------------------------------------------------------------------
// functions to be overriden by inheriting class

// see ./awssum.js for more details

OAuth.prototype.addCommonOptions = function(options, args) {
    var self = this;

    // get the date in UTC : %Y-%m-%dT%H:%M:%SZ
    // var timestamp = (new Date()).valueOf();
    var timestamp = parseInt((new Date()).valueOf()/1000);
    // var timestamp = '1333518605';
    var nonce = passgen.create(12);

    // add in the common params for OAuth 1.0a

    // sign ALL of the params, including those passed in and those for OAuth
    var params = [];
    options.params.forEach(function(v, i) {
        params.push(v);
    });
    params.push({ 'name' : 'oauth_version',          'value' : '1.0'                     });
    params.push({ 'name' : 'oauth_consumer_key',     'value' : self.oauthConsumerKey()   });
    // oauth_callback
    params.push({ 'name' : 'oauth_timestamp',        'value' : timestamp                 });
    params.push({ 'name' : 'oauth_nonce',            'value' : nonce                     });
    params.push({ 'name' : 'oauth_signature_method', 'value' : 'HMAC-SHA1'               });

    // make the signature
    var strToSign = options.method + '&' + escape(options.host + options.path) + '&';
    var pairs = _(options.params)
        .chain()
        .sortBy(function(p) { return p.name })
        .map(function(v, i) { return '' + escape(v.name) + '=' + escape(v.value) })
        .join('&')
        .value()
    ;
    strToSign += pairs;

    console.log('strToSign=' + strToSign);

    // sign the request string
    var signature = crypto
        .createHmac('sha256', self.oauthConsumerSecret())
        .update(strToSign)
        .digest('base64');

    // add the 'Authorization' header
    options.headers['Authorization'] = 'OAuth ' + [
        'oauth_version="1.0"',
        'oauth_consumer_key="' + escape(self.oauthConsumerKey()) + '"',
        'oauth_callback="' + escape(args.oauth_callback) + '"',
        'oauth_timestamp="' + escape(timestamp)  + '"',
        'oauth_nonce="' + nonce + '"',
        'oauth_signature_method="HMAC-SHA1"',
        'oauth_signature="' + escape(signature) + '"',
    ].join(', ');
};

// inheriting classes need to implement:
//
// * requestTokenHost
// * requestTokenPath
// * authorizeHost
// * authorizePath
// * accessTokenHost
// * accessTokenPath

// --------------------------------------------------------------------------------------------------------------------
// exports

// object constructor
exports.OAuth = OAuth;

// --------------------------------------------------------------------------------------------------------------------
