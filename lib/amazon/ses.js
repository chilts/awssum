//-------------------------------------------------------------------------------------------------------------------
//
// ses.js - class for AWS Simple Email Service
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
var https = require('https');
var querystring = require('querystring');
var crypto = require('crypto');

// dependencies
var _ = require('underscore');
var xml2js = require('xml2js');
var dateFormat = require('dateformat');

// our own
var amazon = require('./amazon');

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 'ses: ';

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html
var endPoint = {};
endPoint[amazon.US_EAST_1]      = "email.us-east-1.amazonaws.com";
// US_WEST_1 no such endpoint for SES
// EU_WEST_1 no such endpoint for SES
// AP_SOUTHEAST_1 no such endpoint for SES
// AP_NORTHEAST_1 no such endpoint for SES
// endPoint[amazon.US_GOV_WEST_1]  = "...";

// From: http://aws.amazon.com/releasenotes/Amazon-SES
// var version = '2011-01-24';
var version = '2010-12-01';
var signatureMethod = 'HmacSHA256';
var signatureVersion = 2;

// --------------------------------------------------------------------------------------------------------------------
// constructor

var Ses = function(accessKeyId, secretAccessKey, awsAccountId, region) {
    var self = this;

    // call the superclass for initialisation
    Ses.super_.call(this, accessKeyId, secretAccessKey, awsAccountId, region);

    // check the region is valid
    if ( ! endPoint[region] ) {
        throw MARK + "invalid region '" + region + "'";
    }

    return self;
};

// inherit from Amazon
util.inherits(Ses, amazon.Amazon);

// --------------------------------------------------------------------------------------------------------------------
// methods we need to implement from awssum.js/amazon.js

Ses.prototype.method = function() {
    return 'POST';
}

Ses.prototype.host = function() {
    return endPoint[this.region()];
};

Ses.prototype.version = function() {
    return version;
}

Ses.prototype.addCommonOptions = function(options) {
    var self = this;

    // get the date in both %Y-%m-%dT%H:%M:%SZ and regular
    var date = new Date();
    var dateHeader = dateFormat(new Date(), "UTC:ddd, dd mmm yyyy HH:MM:ss Z");
    var timestamp = date.toISOString();

    // add the date header
    options.headers['Date'] = dateHeader;
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';

    // add in the common params
    options.params.push({ 'name' : 'AWSAccessKeyId', 'value' : this.accessKeyId() });
    options.params.push({ 'name' : 'Action', 'value' : options.action });
    options.params.push({ 'name' : 'Timestamp', 'value' : timestamp });
    options.params.push({ 'name' : 'Version', 'value' : self.version() });
};

// From: http://docs.amazonwebservices.com/ses/latest/DeveloperGuide/index.html?HMACShaSignatures.html
Ses.prototype.strToSign = function(options) {
    var self = this;

    return options.headers.Date;
}

Ses.prototype.addSignature = function(options, signature) {
    // do the extra headers (including the signature)
    options.headers['X-Amzn-Authorization'] = 'AWS3-HTTPS AWSAccessKeyId=' + self.accessKeyId()
        + ', Signature=' + signature
        + ', Algorithm=' + self.signatureMethod()
};

// This performRequest() is only for Simple Email Service.
//
// Calls the callback when we know what has happened.
Ses.prototype.performRequest = function(options, callback) {
    var self = this;

    // set some defaults on the various input params
    // none for options.action
    options.method  = options.method || self.method();
    options.path    = options.path || '/';
    options.headers = options.headers || {};
    options.params  = options.params || [];
    // none for options.body
    options.host = options.host || self.host();
    options.statusCode = options.statusCode || 200;
    if ( _.isUndefined(options.decodeBody) ) {
        options.decodeBody = true;
    }

    // sign this request
    self.addCommonOptions(options);
    var strToSign = this.strToSign(options);
    var signature = this.signature(strToSign);
    self.addSignature(options, signature);

    // set the body with the params
    var paramsHash = {};
    _.each(options.params, function(v) {
        paramsHash[v.name] = v.value;
    });
    options.body = querystring.stringify(paramsHash);

    // set the length of the POST data
    if ( ! _.isUndefined(options.body) ) {
        options.headers['Content-Length'] = options.body.length;
    }

    // console.log('---');
    // console.log('Method     :', options.method);
    // console.log('Endpoint   :', options.endpoint);
    // console.log('Path       :', options.path);
    // console.log('Headers    :', options.headers);
    // console.log('Params     :', options.params);
    // console.log('Body       :', options.body);
    // console.log('DecodeBody :', options.decodeBody);
    // console.log('---');

    var req = https.request({
        method: options.method,
        host : options.endpoint,
        path : options.path,
        headers: options.headers,
    }, function(res) {
        // 'res' is a http://nodejs.org/docs/v0.4.10/api/http.html#http.ClientResponse

        // console.log(req);
        // console.log(res);

        // do everything in utf8 (and therefore the 'data' event emits a UTF8 string)
        res.setEncoding('utf8');

        var xml = '';

        // when we get some data back, store it
        res.on('data', function(data) {
            xml += data;
        });

        // if the connection terminates before end is emitted, it's an error
        res.on('close', function(err) {
            callback(err, null);
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
                        callback({
                            Code : 'AwsSum',
                            Message : 'Failed to Parse the XML: ' + err.message,
                            OriginalError : err
                        }, null);
                        return;
                    }

                    // ok, we have the error data (parsed)
                    // console.log('Error Data :', result);
                    callback( result, null );
                }));
                return;
            }

            // the returned statusCode was ok, so parse the result out
            parser.parseString(xml, _.once(function (err, result) {
                if ( err ) {
                    // error parsing the XML will be an error
                    callback({
                        Code : 'AwsSum',
                        Message : 'Failed to Parse the XML: ' + err.message,
                        OriginalError : err
                    }, null);
                    return;
                }

                // everything looks ok
                callback(null, result);
            }));
        });
    });

    // if there is an error with the formation of the request, call the callback
    req.on('error', function(err) {
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
}

// --------------------------------------------------------------------------------------------------------------------
// operations on the service

// This list from: http://docs.amazonwebservices.com/ses/latest/APIReference/API_Operations.html
//
// * http://docs.amazonwebservices.com/ses/latest/APIReference/API_DeleteVerifiedEmailAddress.html
// * http://docs.amazonwebservices.com/ses/latest/APIReference/API_GetSendQuota.html
// * http://docs.amazonwebservices.com/ses/latest/APIReference/API_GetSendStatistics.html
// * http://docs.amazonwebservices.com/ses/latest/APIReference/API_ListVerifiedEmailAddresses.html
// * http://docs.amazonwebservices.com/ses/latest/APIReference/API_SendEmail.html
// * http://docs.amazonwebservices.com/ses/latest/APIReference/API_SendRawEmail.html
// * http://docs.amazonwebservices.com/ses/latest/APIReference/API_VerifyEmailAddress.html

// http://docs.amazonwebservices.com/ses/latest/APIReference/API_DeleteVerifiedEmailAddress.html
Ses.prototype.deleteVerifiedEmailAddress = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.emailAddress) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide an emailAddress' }, null);
        return;
    }

    var params = [];
    self.addParam(params, 'EmailAddress', args.emailAddress);

    // console.log(util.inspect(params, true, null));

    self.performRequest({
        action : 'DeleteVerifiedEmailAddress',
        params : params,
    }, callback);
};

// http://docs.amazonwebservices.com/ses/latest/APIReference/API_GetSendQuota.html
Ses.prototype.getSendQuota = function(args, callback) {
    var self = this;

    // console.log(util.inspect(params, true, null));

    self.performRequest({ action : 'GetSendQuota' }, callback);
};

// http://docs.amazonwebservices.com/ses/latest/APIReference/API_GetSendStatistics.html
Ses.prototype.getSendStatistics = function(args, callback) {
    var self = this;

    // console.log(util.inspect(params, true, null));

    self.performRequest({ action : 'GetSendStatistics' }, callback);
};

// http://docs.amazonwebservices.com/ses/latest/APIReference/API_ListVerifiedEmailAddresses.html
Ses.prototype.listVerifiedEmailAddresses = function(args, callback) {
    var self = this;

    // console.log(util.inspect(params, true, null));

    self.performRequest({ action : 'ListVerifiedEmailAddresses' }, callback);
};

// http://docs.amazonwebservices.com/ses/latest/APIReference/API_SendEmail.html
Ses.prototype.sendEmail = function(args, callback) {
    var self = this;

    args.to = args.to || [];
    args.cc = args.cc || [];
    args.bcc = args.bcc || [];
    args.replyTo = args.replyTo || [];

    var params = [];

    // add each of the To, Cc and Bcc addresses
    var i = 1;
    _.each(args.to, function(address) {
        self.addParam(params, 'Destination.ToAddresses.member.' + i, address);
        i++;
    });
    _.each(args.cc, function(address) {
        self.addParam(params, 'Destination.CcAddresses.member.' + i, address);
        i++;
    });
    _.each(args.bcc, function(address) {
        self.addParam(params, 'Destination.BccAddresses.member.' + i, address);
        i++;
    });

    // if we have no email addresses, this is a failure
    if ( i === 1 ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide at least one destination email address' }, null);
        return;
    }

    // make sure we have a source
    if ( _.isUndefined(args.source) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a source (email address)' }, null);
        return;
    }

    // make sure we have at least args.text or args.html
    if ( _.isUndefined(args.text) && _.isUndefined(args.html) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide either text or html or both' }, null);
        return;
    }

    // add the subject
    self.addParam(params, 'Message.Subject.Data', args.subject);
    self.addParam(params, 'Message.Subject.Charset', 'UTF-8');

    // add the source and return path
    self.addParam(params, 'Source', args.source);
    self.addParamIfDefined(params, 'ReturnPath', args.returnPath);

    if ( ! _.isUndefined(args.text) ) {
        self.addParam(params, 'Message.Body.Text.Data', args.text);
        self.addParam(params, 'Message.Body.Text.Charset', 'UTF-8');
    }
    if ( ! _.isUndefined(args.html) ) {
        self.addParam(params, 'Message.Body.Html.Data', args.html);
        self.addParam(params, 'Message.Body.Html.Charset', 'UTF-8');
    }
    self.addParam(params, '', args.emailAddress);

    _.each(args.replyTo, function(address) {
        self.addParam(params, 'ReplyToAddresses.member.' + i, args.address);
        i++;
    });

    // console.log(util.inspect(params, true, null));

    self.performRequest({
        action : 'SendEmail',
        params : params,
    }, callback);
};

// http://docs.amazonwebservices.com/ses/latest/APIReference/API_SendRawEmail.html
Ses.prototype.sendRawEmail = function(args, callback) {
    var self = this;

    args.destinations = args.destinations || [];

    // make sure we have a rawMessage
    if ( _.isUndefined(args.rawMessage) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide a rawMessage' }, null);
        return;
    }

    var params = [];

    // add the (base64 encoded) raw message (copying from https://gist.github.com/521313)
    self.addParam( params, 'RawMessage', (new Buffer(args.rawMessage)).toString('base64') );

    // add each of the Destinations
    var i = 1;
    _.each(args.destinations, function(address) {
        self.addParam(params, 'Destination.member.' + i, address);
        i++;
    });

    // add the source if defined
    self.addParamIfDefined(params, 'Source', args.source);

    // console.log(util.inspect(params, true, null));

    self.performRequest({
        action : 'SendRawEmail',
        params : params,
    }, callback);
};

// http://docs.amazonwebservices.com/ses/latest/APIReference/API_VerifyEmailAddress.html
Ses.prototype.verifyEmailAddress = function(args, callback) {
    var self = this;

    if ( _.isUndefined(args.emailAddress) ) {
        callback({ Code : 'AwsSumCheck', Message : 'Provide an emailAddress' }, null);
        return;
    }

    var params = [];
    self.addParam(params, 'EmailAddress', args.emailAddress);

    // console.log(util.inspect(params, true, null));

    self.performRequest({
        action : 'VerifyEmailAddress',
        params : params,
    }, callback);
};

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.Ses = Ses;

// --------------------------------------------------------------------------------------------------------------------
