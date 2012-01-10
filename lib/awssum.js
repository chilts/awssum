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

// built-ins
var querystring = require('querystring');
var https = require('https');

// dependencies
var _ = require('underscore');
var xml2js = require('xml2js');

// --------------------------------------------------------------------------------------------------------------------
// constants

var MARK = 'awssum: ';

var parser = new xml2js.Parser({ normalize : false, trim : false, explicitRoot : true });

// --------------------------------------------------------------------------------------------------------------------
// utility functions

function load(path) {
    // since NodeJS caches requires, we won't cache them here
    return require('./' + path);
}

function addParam(params, name, value) {
    params.push({ 'name' : name, 'value' : value });
}

function addParamIfDefined(params, name, value) {
    if ( ! _.isUndefined(value) ) {
        params.push({ 'name' : name, 'value' : value });
    }
}

// Takes an array and adds params with names like:
//
// * Name.0, Name.1, Name.2, Name.3, ...
//
// or if you specify 'extra', the names will be:
//
// * Name.Extra.0, Name.Extra.1, Name.Extra.2, ...
function addParamArray(params, name, value, prefix) {
    value = value || [];

    var prefix = '' + name + '.' + (prefix ? prefix + '.' : '');

    // if it's a string, just add this single value
    if ( typeof value === 'string' ) {
        params.push({ 'name' : prefix + '1', 'value' : value });
        return;
    }

    // else it's an array, so add them all
    for ( var i = 0; i < value.length; i++ ) {
        params.push({ 'name' : prefix + (i+1), 'value' : value[i] });
    }
}

// Takes an array and adds params with names like (for three calls of 'Id', 'Name', 'Zone'):
//
// * SetName.1.Id,   SetName.2.Id,   SetName.3.Id,   ...
// * SetName.1.Name, SetName.2.Name, SetName.3.Name, ...
// * SetName.1.Zone, SetName.2.Zone, SetName.3.Zone, ...
function addParamArraySet(params, setName, name, value) {
    value = value || [];

    // if it's a string, just add this single value
    if ( typeof value === 'string' ) {
        params.push({ 'name' : setName + '.1.' + name, 'value' : value });
        return;
    }

    // else it's an array, so add them all
    _.each(value, function(v, i) {
        if ( _.isUndefined(v) ) {
            return;
        }
        params.push({ 'name' : setName + '.' + (i+1) + '.' + name, 'value' : v });
    });
}

// Takes an array of arrays and adds params with names like:
//
// * SetName.<i>.Name.<j>
// * Item.<i>.Attribute.<j>
// * Filter.<i>.Value.<j> (e.g. Amazon:EC2:DescribeInstances)
function addParam2dArray(params, setName, name, value) {
    value = value || [];

    if ( typeof value === 'undefined' ) {
        // nothing to do
        return;
    }

    // if it's a string, just add this single value
    if ( typeof value === 'string' ) {
        params.push({ 'name' : setName + '.1.' + name + '.1', 'value' : value });
        return;
    }

    // else it's an array, so add them all
    _.each(value, function(set, i) {
        if ( _.isUndefined(set) ) {
            return;
        }

        _.each(set, function(v, j) {
            params.push({ 'name' : setName + '.' + (i+1) + '.' + name + '.' + (j+1), 'value' : v });
        });
    });
}

// Takes an array of arrays and adds params with names like:
//
// * SetName.X.SubSetName.Y.Id
// * Item.X.Attribute.Y.Id
// * Item.X.Attribute.Y.Id
function addParam2dArraySet(params, setName, subsetName, name, value) {
    value = value || [];

    // if it's a string, just add this single value
    if ( typeof value === 'string' ) {
        params.push({ 'name' : setName + '.1.' + subsetName + '.1.' + name, 'value' : value });
        return;
    }

    // else it's an array, so add them all
    _.each(value, function(set, i) {
        if ( _.isUndefined(set) ) {
            return;
        }

        _.each(set, function(v, j) {
            params.push({ 'name' : setName + '.' + (i+1) + '.' + subsetName + '.' + (j+1) + '.' + name, 'value' : v });
        });
    });
}

function addParamArrayOfObjects(params, setName, array) {
    // loop through all the array elements
    _.each(array, function(obj, i) {
        if ( _.isUndefined(obj) ) {
            return;
        }

        // loop through all the keys in this object
        _.each(obj, function(value, key) {
            params.push({ 'name' : setName + '.' + (i+1) + '.' + key, 'value' : value });
        });
    });
}

function addFormIfDefined(field, name, value) {
    if ( ! _.isUndefined(value) ) {
        field.push({ 'name' : name, 'value' : value });
    }
}

function setHeader(header, name, value) {
    header[name] = value;
}

function setHeaderIfDefined(header, name, value) {
    if ( ! _.isUndefined(value) ) {
        header[name] = value;
    }
}

// --------------------------------------------------------------------------------------------------------------------
// AwsSum and functions to be overriden by inheriting class

// function method()               -> string (the default method for the HTTP request)
// function host()                 -> string (the host for this service/region)
// function path()                 -> string (the default path for this service)
// function addExtras()            -> side effect, adds extra whatever
// function addCommonOptions(options, args) -> side effect, adds the common headers/params for this service
// function statusCode()           -> the expected status code
// function extractHeaders()       -> how to extract the headers from the response
// function extractBody()          -> how to extract the body from the response

// constructor

var AwsSum = function() {
    var self = this;
    return self;
}

AwsSum.prototype.method = function() {
    return 'GET';
}

// AwsSum.prototype.host // no default

AwsSum.prototype.path = function() {
    return '/';
};

AwsSum.prototype.addExtras = function() { };

AwsSum.prototype.addCommonOptions = function(options, args) { }

AwsSum.prototype.statusCode = function(options) {
    return 200;
}

// AwsSum.prototype.extractBody // no default

AwsSum.prototype.extractHeaders = function() {
    // default to extracting _all_ of the headers
    return true;
};

// --------------------------------------------------------------------------------------------------------------------
// utility methods

// curry the send function for this operation
function makeOperation(operation, args, callback) {
    return function(args, callback) {
        var self = this;
        self.send(operation, args, callback);
    }
}

AwsSum.prototype.send = function(operation, args, callback) {
    var self = this;

    // if args hasn't been given
    var self = this;
    if ( callback == null ) {
        callback = args;
        args = {};
    }
    args = args || {};

    // extend the args with the defaults for this operation (e.g. Action)
    if ( operation.defaults ) {
        for (var key in operation.defaults) {
            if ( typeof operation.defaults[key] === 'function' ) {
                args[key] = operation.defaults[key].apply(self, [ options, args ]);
            }
            else {
                // the default, just copy it over (even if undefined)
                args[key] = operation.defaults[key];
            }
        }
    }

    // check that we have all of the args we expected for this operation
    for ( var argName in operation.args ) {
        var spec = operation.args[argName];

        // see if this is required (and check it exists, even if it is undefined)
        if ( spec.required && !(argName in args) ) {
            callback({ Code : 'AwsSumCheck', Message : 'Provide a ' + argName });
            return;
        }
    }

    // ---

    // BUILD ALL OF THE OPTIONS

    // build all of the request options
    var options = {};

    // ---

    // REQUEST STUFF

    // build the method
    options.method = self.method();
    if ( operation.method ) {
        if ( typeof operation.method === 'string' ) {
            options.method = operation.method
        }
        else if ( typeof operation.method === 'function' ) {
            options.method = operation.method.apply(self, [ options, args ]);
        }
        else {
            // since this is a program error, we're gonna throw this one
            throw 'Unknown operation.method : ' + typeof operation.method;
        }
    }

    // ---

    // build the host
    options.host = self.host(args);
    if ( operation.host ) {
        if ( typeof operation.host === 'function' ) {
            options.host = operation.host.apply(self, [ options, args ]);
        }
        else if ( typeof operation.host === 'string' ) {
            options.host = operation.host;
        }
        else {
            // since this is a program error, we're gonna throw this one
            throw 'Unknown operation.host : ' + typeof operation.host;
        }
    }

    // ---

    // build the path
    options.path = self.path();
    if ( operation.path ) {
        if ( typeof operation.path === 'function' ) {
            options.path = operation.path.apply(self, [ options, args ]);
        }
        else if ( typeof operation.path === 'string' ) {
            options.path = operation.path;
        }
        else {
            // since this is a program error, we're gonna throw this one
            throw 'Unknown operation.path : ' + typeof operation.path;
        }
    }

    // ---

    // build all of the params and headers
    options.params = [];
    options.headers = {};
    options.forms = [];
    for ( var argName in operation.args ) {
        var spec = operation.args[argName];
        var name = spec.name || argName;

        // if this is a param type, add it there
        if ( spec.type === 'param' ) {
            addParamIfDefined( options.params, name, args[argName] );
        }
        else if ( spec.type === 'resource' ) {
            // for Amazon S3 .. things like /?acl, /?policy and /?logging
            addParam( options.params, name, undefined );
        }
        else if ( spec.type === 'param-array' ) {
            addParamArray( options.params, name, args[argName], spec.prefix );
        }
        else if ( spec.type === 'param-array-set' ) {
            addParamArraySet( options.params, spec.setName, name, args[argName] );
        }
        else if ( spec.type === 'param-2d-array' ) {
            addParam2dArray( options.params, spec.setName, name, args[argName] );
        }
        else if ( spec.type === 'param-2d-array-set' ) {
            addParam2dArraySet( options.params, spec.setName, spec.subsetName, name, args[argName] );
        }
        else if ( spec.type === 'param-array-of-objects' ) {
            addParamArrayOfObjects( options.params, spec.setName, args[argName] );
        }
        else if ( spec.type === 'header' ) {
            setHeaderIfDefined( options.headers, name, args[argName] );
        }
        else if ( spec.type === 'header-base64' ) {
            if ( ! _.isUndefined(args[argName]) ) {
                setHeader( options.headers, name, (new Buffer(args[argName])).toString('base64') );
            }
        }
        else if ( spec.type === 'form' ) {
            addFormIfDefined( options.forms, name, args[argName] );
        }
        else if ( spec.type === 'form-array' ) {
            addParamArray( options.forms, name, args[argName], spec.prefix );
        }
        else if ( spec.type === 'form-base64' ) {
            if ( ! _.isUndefined(args[argName]) ) {
                addParam( options.forms, name, (new Buffer(args[argName])).toString('base64') );
            }
        }
        else if ( spec.type === 'body' ) {
            // there should be just one of these
            options.body = args[argName];
        }
        else if ( spec.type === 'special' ) {
            // this will be dealth with specifically later on - all ok
        }
        else {
            // since this is a program error, we're gonna throw this one
            throw 'Unknown argument type : ' + spec.type;
        }
    }

    // ---

    // build the body (if defined)
    if ( operation.body ) {
        if ( typeof operation.body === 'string' ) {
            options.body = operation.body;
        }
        else if ( typeof operation.body === 'function' ) {
            options.body = operation.body.apply(self, [ options, args ]);
        }
        else {
            // since this is a program error, we're gonna throw this one
            throw 'Unknown operation.body : ' + typeof operation.body;
        }
    }

    // ---

    // add anything extra into the request
    var addExtras = operation.addExtras || self.addExtras;
    if ( typeof addExtras === 'function' ) {
        addExtras.apply(self, [ options, args ]);
    }
    else {
        // since this is a program error, we're gonna throw this one
        throw 'Unknown addExtras : ' + typeof addExtras;
    }

    // finally, add the common operations
    self.addCommonOptions(options, args);

    // ---

    // RESPONSE STUFF

    // build the status code we expect
    var statusCode = operation.statusCode || self.statusCode();
    // if this isn't a number or function, it's an error
    if ( ! (_.isNumber(statusCode) || _.isFunction(statusCode)) ) {
        // since this is a program error, we're gonna throw this one
        throw 'Unknown statusCode : ' + typeof statusCode;
    }

    // build which headers to extract
    var extractHeaders = operation.extractHeaders || self.extractHeaders();
    if ( typeof extractHeaders === 'string'
         || Array.isArray(extractHeaders)
         || _.isObject(extractHeaders)
         || _.isRegExp(extractHeaders)
         || _.isFunction(extractHeaders)
         || extractHeaders === true ) {
        // all ok
    }
    else {
        // since this is a program error, we're gonna throw this one
        throw 'Unknown extractHeaders : ' + typeof extractHeaders;
    }

    // build the extractBody stuff
    var extractBody = operation.extractBody || self.extractBody();
    if ( extractBody !== 'xml' &&
         extractBody !== 'json' &&
         extractBody !== 'blob' &&
         extractBody !== 'none' &&
         !_.isFunction(extractBody) ) {
        // since this is a program error, we're gonna throw this one
        throw 'Unknown extractBody : ' + typeof extractBody;
    }

    // ---

    // console.log(options);

    // now send the request
    self.request( options, function(err, res) {
        // an error with the request is an error full-stop
        if ( err ) {
            callback({
                Code : 'AwsSum-Request',
                Message : 'Something went wrong during the request',
                OriginalError : err
            }, null);
            return;
        }

        // save the whole result in here
        var result = {};

        // create the result and parse various things into it
        if ( extractBody === 'xml' ) {
            // decode the returned XML
            var ok = true;
            // Note: parseString is synchronous (not async)
            parser.parseString(res.body, function (err, data) {
                if ( err ) {
                    result.Code    = 'AwsSum-ParseXml';
                    result.Message = 'Something went wrong during the XML parsing';
                    result.Error   = err;
                }
                else {
                    result.Body = data;
                }
            });

            // see if the xml parsing worked
            if ( !result.Body ) {
                callback(result, null);
                return;
            }
        }
        else if ( extractBody === 'json' ) {
            // get the JSON (should this be in a try/catch?)
            result.Body = JSON.parse(res.body);
        }
        else if ( extractBody === 'blob' ) {
            // just return the body
            result.Body = res.body;
        }
        else if ( extractBody === 'none' ) {
            // no body, so just set a blank one
            result.Body = '';
        }
        else if ( typeof extractBody === 'function' ) {
            result.Body = extractBody.apply(self, [ res ]);
        }
        else {
            throw new Error('Invalid option : extractBody');
        }

        // add some headers in there too
        if ( extractHeaders ) {
            // this should be removed in favour of a regex option
            if ( extractHeaders === 'x-amz' ) {
                result.Headers = {};
                _.each(res.headers, function(val, hdr) {
                    if ( hdr.match(/^x-amz-/) ) {
                        // ToDo: it'd be nice if we convert things like:
                        // x-amz-request-id             -> RequestId
                        // x-amz-id-2                   -> Id2
                        // x-amz-server-side-encryption -> ServerSideEncryption
                        // x-amz-version-id             -> VersionId
                        result.Headers[hdr] = val;
                    }
                });
            }
            else if ( _.isRegExp(extractHeaders) ) {
                result.Headers = {};
                _.each(res.headers, function(val, hdr) {
                    if ( hdr.match(extractHeaders) ) {
                        result.Headers[hdr] = val;
                    }
                });
            }
            else if ( Array.isArray(extractHeaders) ) {
                // just return the headers that are in this list
                result.Headers = {};
                extractHeaders.forEach(function(v) {
                    result.Headers[v] = res.headers[v];
                });
            }
            else if ( _.isObject(extractHeaders) ) {
                // just return the headers that are in this list
                result.Headers = {};
                _.each(extractHeaders, function(v, k) {
                    result.Headers[k] = res.headers[k];
                });
            }
            else if ( _.isFunction(extractHeaders) ) {
                // this should return a hash of headers
                result.Headers = extractHeaders.apply(self, [ res ]);
            }
            else if ( extractHeaders === true ) {
                // extract _all_ headers
                result.Headers = res.headers;
            }
        } // else, don't extract any headers

        // add the status code in there too
        result.StatusCode = res.statusCode;

        // check if the status code is what we want, since this will determine whether this was a success or failure
        if ( res.statusCode !== statusCode ) {
            result.Code = 'AwsSum-IncorrectStatusCode';
            result.Message = 'Status code was not expected';
            // this was an error
            callback(result, null);
            return;
        }

        // everything so far looks fine, callback with the result
        callback(null, result);
    });
};

// just takes the standard options and calls back with the result (or error)
//
// * options.method
// * options.host
// * options.path
// * options.params
// * options.headers
// * options.body
AwsSum.prototype.request = function(options, callback) {
    var self = this;

    // check here that we have everything

    // since this can be called on both close and end, just do it once
    callback = _.once(callback);

    var reqOptions = {
        method  : options.method,
        host    : options.host,
        path    : options.path,
        headers : options.headers,
    };

    if ( options.params.length ) {
        reqOptions.path += '?' + self.stringifyQuery( options.params );
    }

    // console.log('request(): reqOptions : ', reqOptions);
    // console.log('request(): body       : ', options.body);

    // do the request
    var req = https.request( reqOptions, function(res) {
        // do everything in utf8 (and therefore the 'data' event emits a UTF8 string)
        res.setEncoding('utf8');
        res.body = '';

        // when we get some data back, store it
        res.on('data', function(chunk) {
            res.body += chunk;
        });

        // when we get our full response back, it's all good!
        res.on('end', function() {
            callback(null, res);
        });

        // if the connection terminates before end is emitted, it's an error
        res.on('close', function(err) {
            callback(err, null);
        });
    });

    // if there is an error with the formation of the request, call the callback
    req.on('error', function(err) {
        callback(err, null);
    });

    // tell the request it's over (but also pass the body if we have it)
    if ( ! _.isUndefined(options.body) ) {
        req.write(options.body);
    }
    req.end();
};

// --------------------------------------------------------------------------------------------------------------------
// exports

// utility for users of awssum
exports.load = load;

// utility functions for other awssum modules
exports.addParam = addParam;
exports.addParamIfDefined = addParamIfDefined;
exports.addParamArray = addParamArray
exports.addParamArraySet = addParamArraySet
exports.addParam2dArraySet = addParam2dArraySet
exports.setHeader = setHeader;
exports.setHeaderIfDefined = setHeaderIfDefined;
exports.makeOperation = makeOperation;

// and export Awssum so other modules can inherit from it
exports.AwsSum = AwsSum;

// --------------------------------------------------------------------------------------------------------------------
