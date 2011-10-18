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
var xml2js = require('xml2js');

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

SimpleDB.prototype.endPoint = function() {
    return endPoint[this.region()];
};

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

SimpleDB.prototype.performRequest = function(action, params, callBack) {
    // SimpleDB is pretty straightforward for requests:
    //
    // * verb = GET (always)
    // * headers = none
    // * params = just what we add
    //
    // It _always_ returns XML, so we decode that only. It also should always give a 200 when the response is ok.
    //
    // There is nothing else :)

    // get the date in UTC : %Y-%m-%dT%H:%M:%SZ
    var date = (new Date).toISOString();

    // add in the common params
    params.push({ 'name' : 'Action', 'value' : action });
    params.push({ 'name' : 'AWSAccessKeyId', 'value' : this.accessKeyId() });
    params.push({ 'name' : 'Version', 'value' : version });
    params.push({ 'name' : 'Timestamp', 'value' : date });
    params.push({ 'name' : 'SignatureVersion', 'value' : signatureVersion });
    params.push({ 'name' : 'SignatureMethod', 'value' : signatureMethod });

    // sign this request
    var signature = this.signature(params);
    params.push({ 'name' : 'Signature', 'value' : signature });

    // console.log('Params :', params);

    // create the query for this request
    var query = {};
    _.each(params, function(v, i) {
        query[v.name] = v.value;
    });

    // console.log('Query :', query);

    var req = https.get({
        host : this.endPoint(),
        path : '/?' + querystring.stringify( query ),
    }, function(res) {
        // 'res' is a http://nodejs.org/docs/v0.4.10/api/http.html#http.ClientResponse

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
            // create the XML parser
            var parser = new xml2js.Parser({ normalize : false, trim : false, explicitRoot : true });
            // console.log('Xml :', xml);

            // first thing we check is the return code
            if ( res.statusCode !== 200 ) {
                // decode the returned XML
                parser.parseString(xml, _.once(function (err, result) {
                    if ( err ) {
                        // error parsing the XML will be an error
                        callBack({
                            Code : 'AwsSum',
                            Message : 'Failed to Parse the XML: ' + err.message,
                            OriginalError : err
                        }, null);
                        return;
                    }

                    // ok, we have the error data (parsed)
                    // console.log('Error Data :', result);
                    callBack({
                        Code : result.Response.Errors.Error.Code,
                        Message : result.Response.Errors.Error.Message,
                        RequestId : result.Response.RequestID
                    }, null);
                }));
                return;
            }

            // the returned statusCode was ok, so parse the result out
            parser.parseString(xml, _.once(function (err, result) {
                if ( err ) {
                    // error parsing the XML will be an error
                    callBack({
                        Code : 'AwsSum',
                        Message : 'Failed to Parse the XML: ' + err.message,
                        OriginalError : err
                    }, null);
                    return;
                }

                // everything looks ok
                callBack(null, result);
            }));
        });
    });

    // if there is an error with the formation of the request, call the callBack
    req.on('error', function(err) {
        callBack({
            Code : 'AwsSum-' + err.code,
            Message : err.message,
            OriginalError : err
        }, null);
    });
}

SimpleDB.prototype.dataToPutAttributes = function(data) {
    var arr = [];

    var i = 0;

    // if this is an array, loop through it now
    if ( Array.isArray(data) ) {
        _.each(data, function(attr, key) {
            // do the name and value
            arr.push({
                'name' : 'Attribute.' + i + '.Name',
                'value' : attr.name
            });
            arr.push({
                'name' : 'Attribute.' + i + '.Value',
                'value' : attr.value
            });

            // if we are specifying whether to replace this value
            if ( typeof attr.replace !== 'undefined' ) {
                arr.push({
                    'name' : 'Attribute.' + i + '.Replace',
                    'value' : '' + (attr.replace ? true : false) // force to a boolean string
                });
            }

            // if we have either an expected value or an exists
            if ( typeof attr.exists !== 'undefined' || typeof attr.expected !== 'undefined' ) {
                arr.push({
                    'name' : 'Expected.' + i + '.Name',
                    'value' : attr.name
                });
            }

            // Here are the scenarios!
            //
            // * if 'exists' is false, we _mustn't_ do an 'expected'
            // * if 'exists' is true, we _must_ do an 'expected'
            // * if only 'expected', we don't use an 'exists'

            if ( typeof attr.exists !== 'undefined' ) {
                // check if exists is true
                if ( attr.exists ) {
                    // 'exists' is true, so we _must_ give an expected
                    if ( typeof attr.expected === 'undefined' ) {
                        throw MARK + 'Since exists is true (for '
                            + attr.name
                            + '), you must specify an expected value';
                    }

                    // set the expected value (no need to set exists to true, it's implicit - save some bandwidth)
                    arr.push({
                        'name' : 'Expected.' + i + '.Value',
                        'value' : '' + attr.expected
                    });
                }
                else {
                    // 'exists' is false, so we _mustn't_ give an 'expected'
                    if ( typeof attr.expected !== 'undefined' ) {
                        throw MARK + 'Since exists is false (for '
                            + attr.name
                            + '), you must NOT specify an expected value';
                    }

                    // ... and set the .Exists to false
                    arr.push({
                        'name' : 'Expected.' + i + '.Exists',
                        'value' : 'false'
                    });
                }
            }
            else if ( typeof attr.expected !== 'undefined' ) {
                // set the expected value (no need to set the exists to true, it's implicit - save some bandwidth)
                arr.push({
                    'name' : 'Expected.' + i + '.Value',
                    'value' : '' + attr.expected
                });
            }
            else {
                // neither 'exists' nor 'expected' was specified
            }

            // move onto the next index
            i++;
        });
    }
    else if ( typeof data === 'object' ) {
        // if this is an object, loop through it now ... for objects though, we can't do Replace or Expected
        _.each(data, function(v, key) {
            arr.push({
                'name' : 'Attribute.' + i + '.Name',
                'value' : key
            });
            arr.push({
                'name' : 'Attribute.' + i + '.Value',
                'value' : v
            });
            i++;
        });
    }

    return arr;
}

// --------------------------------------------------------------------------------------------------------------------
// public methods

SimpleDB.prototype.createDomain = function(domainName, callBack) {
    // check that we have a domain name
    if ( ! domainName ) {
        callBack({ Code : 'AwsSumCheck', Message : 'No domain name given' }, null);
        return;
    }

    // set up our params
    var params = [];
    params.push({ 'name' : 'DomainName', 'value' : domainName });

    this.performRequest('CreateDomain', params, callBack);
};

SimpleDB.prototype.deleteDomain = function(domainName, callBack) {
    // check that we have a domain name
    if ( ! domainName ) {
        callBack({ Code : 'AwsSumCheck', Message : 'No domain name given' }, null);
        return;
    }

    // set up our params
    var params = [];
    params.push({ 'name' : 'DomainName', 'value' : domainName });

    this.performRequest('DeleteDomain', params, callBack);
};

SimpleDB.prototype.listDomains = function(options, callBack) {
    // Optional: MaxnumberOfDomains, NextToken
    var params = [];
    if ( options.NextToken ) {
        params.push({ 'name' : 'NextToken', 'value' : NextToken });
    }
    if ( options.MaxNumberOfDomains ) {
        params.push({ 'name' : 'MaxNumberOfDomains', 'value' : parseInt(options.MaxNumberOfDomains) });
    }

    this.performRequest('ListDomains', params, callBack);
};

SimpleDB.prototype.putAttributes = function(domainName, itemName, data, callBack) {
    // check that we have a domain name
    if ( ! domainName ) {
        callBack({ Code : 'AwsSumCheck', Message : 'No domain name given' }, null);
        return;
    }

    // check that we have an item name
    if ( ! itemName ) {
        callBack({ Code : 'AwsSumCheck', Message : 'No item name given' }, null);
        return;
    }

    // make our params
    // console.log(data);
    var params = this.dataToPutAttributes(data);

    // add our domain and item names
    params.push({ 'name' : 'DomainName', 'value' : domainName });
    params.push({ 'name' : 'ItemName',   'value' : itemName });

    // console.log(params);

    this.performRequest('PutAttributes', params, callBack);
};

SimpleDB.prototype.getAttributes = function(domainName, itemName, attr, consistentRead, callBack) {
    // check that we have a domain name
    if ( ! domainName ) {
        callBack({ Code : 'AwsSumCheck', Message : 'No domain name given' }, null);
        return;
    }

    // check that we have an item name
    if ( ! itemName ) {
        callBack({ Code : 'AwsSumCheck', Message : 'No item name given' }, null);
        return;
    }

    // make our params
    var params = [];
    params.push({ 'name' : 'DomainName', 'value' : domainName });
    params.push({ 'name' : 'ItemName',   'value' : itemName });

    if ( typeof attr !== 'undefined' ) {
        params.push({ 'name' : 'AttributeName', 'value' : attr });
    }

    params.push({ 'name' : 'ConsistentRead', 'value' : '' + (consistentRead ? true : false) });

    // console.log(params);

    this.performRequest('GetAttributes', params, callBack);
};

SimpleDB.prototype.domainMetadata = function(domainName, callBack) {
    // check that we have a domain name
    if ( ! domainName ) {
        callBack({ Code : 'AwsSumCheck', Message : 'No domain name given' }, null);
        return;
    }

    // make our params
    var params = [];
    params.push({ 'name' : 'DomainName', 'value' : domainName });

    this.performRequest('DomainMetadata', params, callBack);
};

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.SimpleDB = SimpleDB;

// --------------------------------------------------------------------------------------------------------------------
