// --------------------------------------------------------------------------------------------------------------------
//
// simpledb.js - class for AWS SimpleDB
//
// Copyright (c) 2011 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
// requires

// built-ins
var util = require('util');
var querystring = require('querystring');
var crypto = require('crypto');
var https = require('https');

// dependencies
var _ = require('underscore');

// our own
var amazon = require('./amazon');

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 'simpledb: ';

var endPoint = {};
endPoint[amazon.US_EAST_1]      = "sdb.amazonaws.com";
endPoint[amazon.US_WEST_1]      = "sdb.us-west-1.amazonaws.com";
endPoint[amazon.EU_WEST_1]      = "sdb.eu-west-1.amazonaws.com";
endPoint[amazon.AP_SOUTHEAST_1] = "sdb.ap-southeast-1.amazonaws.com";
endPoint[amazon.AP_NORTHEAST_1] = "sdb.ap-northeast-1.amazonaws.com";
// US_GOVCLOUD_1 not defined for public consumption

var version = '2009-04-15';
var dateFormat = '%Y-%m-%dT%H:%M:%SZ';
var signatureMethod = 'HmacSHA256';
var signatureVersion = 2;

// --------------------------------------------------------------------------------------------------------------------
// constructor

var SimpleDB = function(accessKeyId, secretAccessKey, region) {
    var self = this;

    // call the superclass for initialisation
    SimpleDB.super_.call(this, accessKeyId, secretAccessKey, region);

    // check the region is valid
    if ( ! endPoint[region] ) {
        throw MARK + "invalid region '" + region + "'";
    }

    // add our methods
    self.accessKeyId = function() {
        return accessKeyId;
    }

    return self;
};

// inherit from Amazon
util.inherits(SimpleDB, amazon.Amazon);

// --------------------------------------------------------------------------------------------------------------------
// methods we need to implement from awssum.js/amazon.js

SimpleDB.prototype.verb = function() {
    return 'GET';
}

// returns the URL to use for this request
SimpleDB.prototype.url = function() {
    return 'https://' + this.endPoint() + '/';
}

// return a signature for this request
SimpleDB.prototype.signature = function(params) {
    // sign the request (remember this is SignatureVersion '2')
    var strToSign = this.verb() + "\n" + this.endPoint().toLowerCase() + "\n" + "/\n";

    // now add on all of the params (after being sorted)
    var pvPairs = _(params)
        .chain()
        .sortBy(function(p) { return p.name })
        .map(function(v, i) { return '' + querystring.escape(v.name) + '=' + querystring.escape(v.value) })
        .join('&')
        .value()
    ;
    strToSign += pvPairs;

    // console.log('StrToSign:', strToSign);

    // sign the request string
    var signature = crypto
        .createHmac('sha256', this.secretAccessKey())
        .update(strToSign)
        .digest('base64');

    // console.log('Signature :', signature);

    return signature;
}

// --------------------------------------------------------------------------------------------------------------------
// public methods

SimpleDB.prototype.createDomain = function(domainName, callBack) {
    //
    // SimpleDB is pretty straightforward for requests:
    //
    // * verb = GET (always)
    // * headers = none
    // * params = just what we add
    //
    // There is nothing else :)

    // set up our params
    var params = [];

    // in UTC -> "%Y-%m-%dT%H:%M:%SZ"
    var date = (new Date).toISOString();
    // var date = (new Date).toISOString().substr(0, 19) + 'Z';
    // var date = '2011-10-16T10:22:54Z';

    // add in the common params
    params.push({ 'name' : 'AWSAccessKeyId', 'value' : this.accessKeyId() });
    params.push({ 'name' : 'Version', 'value' : version });
    params.push({ 'name' : 'Timestamp', 'value' : date });
    params.push({ 'name' : 'SignatureVersion', 'value' : signatureVersion });
    params.push({ 'name' : 'SignatureMethod', 'value' : signatureMethod });

    // add in the params for this operation
    params.push({ 'name' : 'Action', 'value' : 'CreateDomain' });
    params.push({ 'name' : 'DomainName', 'value' : domainName });

    // finally, sign the request
    var signature = this.signature(params);
    params.push({ 'name' : 'Signature', 'value' : signature });

    // console.log('PARAMS :', params);
    // console.log('PARAMS :', JSON.stringify(params));

    // just call the callback when done
    // this.doRequest(callBack);

    // ok, let's create this request
    var query = {};
    _.each(params, function(v, i) {
        query[v.name] = v.value;
    });

    var req = https.get({
        host : this.endPoint(),
        path : '/?' + querystring.stringify( query ),
    }, function(res) {
        // 'res' is a http://nodejs.org/docs/v0.4.10/api/http.html#http.ClientResponse

        // console.log('StatusCode :', res.statusCode);
        // console.log('Headers :', res.headers);

        // do everything in utf8 (and therefore the 'data' event emits a UTF8 string)
        res.setEncoding('utf8');

        var xml = '';

        // when we get some data back, store it
        res.on('data', function(data) {
            xml += data;
        });

        // if the connection terminates before end is emitted, it's an error
        res.on('close', function(err) {
            callBack(err, null);
        });

        // when we get our data back, then decode it
        res.on('end', function() {
            // console.log('Data = ' + xml);
            // console.log('Trailers : ', res.trailers);

            if ( res.statusCode !== 200 ) {
                // ToDo: decode the XML from the 'data' into { code, message, requestId }
                callBack(xml, null);
            }
            else {
                // everything looks ok
                callBack(null, { ok : true });
            }
        });
    });

    // if there is an error with the formation of the request, call the callBack
    req.on('error', function(err) {
        callBack(err);
    });

    // console.log('path :', req.agent.options.path);
    // console.log(req._header);
};

SimpleDB.prototype.endPoint = function() {
    return endPoint[this.region()];
};

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.SimpleDB = SimpleDB;

// --------------------------------------------------------------------------------------------------------------------
