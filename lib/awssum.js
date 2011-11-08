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

var querystring = require('querystring');
var https = require('https');
var _ = require('underscore');

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

AwsSum.prototype.method = function() {
    return 'GET';
}

AwsSum.prototype.url = function() {
    throw MARK + 'program error, inheriting class must override url()';
};

AwsSum.prototype.addCommonOptions = function(options) { }

AwsSum.prototype.sign = function(options) { }

AwsSum.prototype.statusCode = function(options) {
    return 200;
}

// --------------------------------------------------------------------------------------------------------------------
// utility methods

AwsSum.prototype.performRequest = function(options, callback) {
    var self = this;

    // set some defaults on the various input params
    options.method  = options.method || self.method();
    options.host    = options.host || self.host();
    options.path    = options.path || self.path();
    options.headers = options.headers || {};
    options.params  = options.params || [];
    // no default for options.body
    options.statusCode = options.statusCode || self.statusCode();

    // add common headers and then sign the request
    self.addCommonOptions(options);
    self.sign(options);

    // console.log('Options :', options);

    // convert from our request to the https.request()
    var reqOptions = {
        method: options.method,
        host: options.host,
        path: options.path + '?' + querystring.stringify( options.params ),
        headers: options.headers,
    };

    // console.log('ReqOptions :', reqOptions);

    // now do the request
    var req = https.request( reqOptions, function(res) {
        var called = false;

        // do everything in utf8 (and therefore the 'data' event emits a UTF8 string)
        res.setEncoding('utf8');
        res.body = '';

        // when we get some data back, store it
        res.on('data', function(chunk) {
            res.body += chunk;
        });

        // if the connection terminates before end is emitted, it's an error
        res.on('close', function(err) {
            // Not sure why but for some reason both 'end' and 'close' can be called. Not sure why but I presume it
            // should be one or the other - not both!
            //
            // If we have already called the callback, then don't call this here!
            if ( called ) {
                return;
            }

            // console.log('Response closed, calling callback with error');
            called = true;
            callback(err, null);
        });

        // when we get our data back, then decode it
        res.on('end', function() {
            // console.log('Status :', res.statusCode);
            // console.log('ResHeaders :', res.headers);
            // console.log('ResBody :', res.body);

            // first thing we check is the return code
            if ( res.statusCode !== options.statusCode ) {
                // status code isn't what we expected, so return the response as an error
                callback(res, null);
                return;
            }

            // the return status _was_ what we expected, so return it successfully
            var data = self.decodeResponse(res);
            callback(null, data);
        });
    });

    // if there is an error with the formation of the request, call the callback
    req.on('error', function(err) {
        // console.log('error called, calling callback with that error');
        called = true;
        callback({
            Code : 'AwsSum-' + err.code,
            Message : err.message,
            OriginalError : err
        }, null);
    });

    // tell the request it's over (but also pass the body if we have it)
    if ( ! _.isUndefined(options.body) ) {
        req.write(options.body);
    }
    req.end();
};

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.AwsSum = AwsSum;
exports.version = '0.1.0';

// --------------------------------------------------------------------------------------------------------------------
