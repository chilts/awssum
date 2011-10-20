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

// dependencies
var _ = require('underscore');

// our own
var amazon = require('./amazon');

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 'simpledb: ';

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html
var endPoint = {};
endPoint[amazon.US_EAST_1]      = "sdb.amazonaws.com";
endPoint[amazon.US_WEST_1]      = "sdb.us-west-1.amazonaws.com";
endPoint[amazon.EU_WEST_1]      = "sdb.eu-west-1.amazonaws.com";
endPoint[amazon.AP_SOUTHEAST_1] = "sdb.ap-southeast-1.amazonaws.com";
endPoint[amazon.AP_NORTHEAST_1] = "sdb.ap-northeast-1.amazonaws.com";
// US_GOVCLOUD_1 not defined for public consumption

var version = '2009-04-15';

// --------------------------------------------------------------------------------------------------------------------
// constructor

var SimpleDB = function(accessKeyId, secretAccessKey, awsAccountId, region) {
    var self = this;

    // call the superclass for initialisation
    SimpleDB.super_.call(this, accessKeyId, secretAccessKey, awsAccountId, region);

    // check the region is valid
    if ( ! endPoint[region] ) {
        throw MARK + "invalid region '" + region + "'";
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

SimpleDB.prototype.version = function() {
    return version;
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

SimpleDB.prototype.dataToDeleteAttributes = function(data) {
    var arr = [];

    var i = 0;

    // if this is an array, loop through it now
    if ( Array.isArray(data) ) {
        _.each(data, function(attr, key) {
            var validField = false;

            // do the name if there is a name defined
            if ( typeof attr.name !== 'undefined' ) {
                arr.push({
                    'name' : 'Attribute.' + i + '.Name',
                    'value' : attr.name
                });

                // since we have a name, this attr is valid
                validField = true;
            }

            // do the value if one is defined
            if ( typeof attr.value !== 'undefined' ) {
                arr.push({
                    'name' : 'Attribute.' + i + '.Value',
                    'value' : attr.value
                });

                // a value alone can't make this attr valid, so leave it out here
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
                // we have a true 'exists'
                if ( attr.exists ) {
                    // 'exists' is true, so we _must_ give an expected
                    if ( typeof attr.expected === 'undefined' ) {
                        throw MARK + 'Since exists is true (for '
                            + attr.name
                            + '), you must specify an expected value';
                    }

                    // set the expected value
                    arr.push({
                        'name' : 'Expected.' + i + '.Value',
                        'value' : '' + attr.expected
                    });

                    // since we have set expected, this attr is now valid
                    validField = true;
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

                    // since we have set exists, this attr is now valid
                    validField = true;
                }
            }
            else if ( typeof attr.expected !== 'undefined' ) {
                arr.push({
                    'name' : 'Expected.' + i + '.Value',
                    'value' : '' + attr.expected
                });

                // since we have set expected, this attr is now valid
                validField = true;
            }
            else {
                // neither 'exists' nor 'expected' was specified
            }

            // if this field isn't valid, then we need to throw up
            if ( ! validField ) {
                throw MARK + "Attribute for deletion (" + attr.name + ") isn't valid";
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

SimpleDB.prototype.makeErrorFromParsedXml = function(result) {
    return {
        Code : result.Response.Errors.Error.Code,
        Message : result.Response.Errors.Error.Message,
        RequestId : result.Response.RequestID
    };
}

// --------------------------------------------------------------------------------------------------------------------
// operations on the service

// This list from: http://docs.amazonwebservices.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_Operations.html
//
// * http://docs.amazonwebservices.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_BatchDeleteAttributes.html
// * http://docs.amazonwebservices.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_BatchPutAttributes.html
// * http://docs.amazonwebservices.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_CreateDomain.html
// * http://docs.amazonwebservices.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_DeleteAttributes.html
// * http://docs.amazonwebservices.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_DeleteDomain.html
// * http://docs.amazonwebservices.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_DomainMetadata.html
// * http://docs.amazonwebservices.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_GetAttributes.html
// * http://docs.amazonwebservices.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_ListDomains.html
// * http://docs.amazonwebservices.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_PutAttributes.html
// * http://docs.amazonwebservices.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_Select.html

// ToDo: batchDeleteAttributes()

// ToDo: batchPutAttributes()

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

SimpleDB.prototype.deleteAttributes = function(domainName, itemName, data, callBack) {
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
    var params = this.dataToDeleteAttributes(data);

    // add our domain and item names
    params.push({ 'name' : 'DomainName', 'value' : domainName });
    params.push({ 'name' : 'ItemName',   'value' : itemName });

    this.performRequest('DeleteAttributes', params, callBack);
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

SimpleDB.prototype.select = function(selectExpression, consistentRead, nextToken, callBack) {
    // check that we have a domain name
    if ( ! selectExpression ) {
        callBack({ Code : 'AwsSumCheck', Message : 'No select expression given' }, null);
        return;
    }

    // make our params
    var params = [];
    params.push({ 'name' : 'SelectExpression', 'value' : selectExpression });

    // do ConsistentRead if we have one
    if ( typeof consistentRead !== 'undefined' ) {
        if ( typeof consistentRead !== 'boolean' ) {
            callBack({ Code : 'AwsSumCheck', Message : 'No consistent read must be a boolean value' }, null);
            return;
        }
        params.push({ 'name' : 'ConsistentRead', 'value' : '' + consistentRead });
    }

    // do NextToken if we have one
    if ( typeof nextToken !== 'undefined' ) {
        params.push({ 'name' : 'NextToken', 'value' : '' + nextToken });
    }

    this.performRequest('Select', params, callBack);
};

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.SimpleDB = SimpleDB;

// --------------------------------------------------------------------------------------------------------------------
