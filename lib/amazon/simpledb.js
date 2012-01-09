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
var awssum = require('../awssum');
var amazon = require('./amazon');
var operations = require('./simpledb-config');

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 'simpledb: ';

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html
var endPoint = {};
endPoint[amazon.US_EAST_1]      = "sdb.amazonaws.com";
endPoint[amazon.US_WEST_1]      = "sdb.us-west-1.amazonaws.com";
endPoint[amazon.US_WEST_2]      = "sdb.us-west-2.amazonaws.com";
endPoint[amazon.EU_WEST_1]      = "sdb.eu-west-1.amazonaws.com";
endPoint[amazon.AP_SOUTHEAST_1] = "sdb.ap-southeast-1.amazonaws.com";
endPoint[amazon.AP_NORTHEAST_1] = "sdb.ap-northeast-1.amazonaws.com";
endPoint[amazon.SA_EAST_1]      = "sdb.sa-east-1.amazonaws.com";
// endPoint[amazon.US_GOV_WEST_1]  = "...";

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

SimpleDB.prototype.host = function() {
    return endPoint[this.region()];
};

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

// --------------------------------------------------------------------------------------------------------------------
// operations on the service

_.each(operations, function(operation, operationName) {
    SimpleDB.prototype[operationName] = awssum.makeOperation(operation);
});

// ToDo: batchDeleteAttributes()

// ToDo: batchPutAttributes()

SimpleDB.prototype.createDomain = function(args, callback) {
    var self = this;

    // check that we have a domain name
    if ( ! args.domainName ) {
        callback({ Code : 'AwsSumCheck', Message : 'No domain name given' }, null);
        return;
    }

    // set up our params
    var params = [];
    self.addParam( params, 'DomainName', args.domainName );

    self.addParam( params, 'Action', 'CreateDomain' );
    this.performRequest({ params : params }, callback);
};

SimpleDB.prototype.deleteAttributes = function(args, callback) {
    var self = this;

    // check that we have a domain name
    if ( ! args.domainName ) {
        callback({ Code : 'AwsSumCheck', Message : 'No domain name given' }, null);
        return;
    }

    // check that we have an item name
    if ( ! args.itemName ) {
        callback({ Code : 'AwsSumCheck', Message : 'No item name given' }, null);
        return;
    }

    // make our params
    var params = this.dataToDeleteAttributes(args.data);

    // add our domain and item names
    self.addParam( params, 'DomainName', args.domainName );
    self.addParam( params, 'ItemName', args.itemName );

    self.addParam( params, 'Action', 'DeleteAttributes' );
    self.performRequest({ params : params }, callback);
};

SimpleDB.prototype.deleteDomain = function(args, callback) {
    var self = this;

    // check that we have a domain name
    if ( ! args.domainName ) {
        callback({ Code : 'AwsSumCheck', Message : 'No domain name given' }, null);
        return;
    }

    // set up our params
    var params = [];
    self.addParam( params, 'DomainName', args.domainName );

    self.addParam( params, 'Action', 'DeleteDomain' );
    self.performRequest({ params : params }, callback);
};

SimpleDB.prototype.domainMetadata = function(args, callback) {
    var self = this;

    // check that we have a domain name
    if ( ! args.domainName ) {
        callback({ Code : 'AwsSumCheck', Message : 'No domain name given' }, null);
        return;
    }

    // make our params
    var params = [];
    self.addParam( params, 'DomainName', args.domainName );

    self.addParam( params, 'Action', 'DomainMetadata' );
    self.performRequest({ params : params }, callback);
};

SimpleDB.prototype.getAttributes = function(args, callback) {
    var self = this;

    // check that we have a domain name
    if ( ! args.domainName ) {
        callback({ Code : 'AwsSumCheck', Message : 'No domain name given' }, null);
        return;
    }

    // check that we have an item name
    if ( ! args.itemName ) {
        callback({ Code : 'AwsSumCheck', Message : 'No item name given' }, null);
        return;
    }

    // make our params
    var params = [];
    self.addParam( params, 'DomainName', args.domainName );
    self.addParam( params, 'ItemName', args.itemName );

    if ( typeof args.attr !== 'undefined' ) {
        self.addParam( params, 'AttributeName', args.attr );
    }

    self.addParam( params, 'ConsistentRead', args.consistentRead ? true : false );

    // console.log(params);

    self.addParam( params, 'Action', 'GetAttributes' );
    self.performRequest({ params : params }, callback);
};

SimpleDB.prototype.listDomains = function(args, callback) {
    var self = this;

    args = args || {};

    // Optional: MaxnumberOfDomains, NextToken
    var params = [];
    if ( args.NextToken ) {
        self.addParam( params, 'NextToken', NextToken );
    }
    if ( args.MaxNumberOfDomains ) {
        self.addParam( params, 'MaxNumberOfDomains', parseInt(args.MaxNumberOfDomains) );
    }

    self.addParam( params, 'Action', 'ListDomains' );
    self.performRequest({ params : params }, callback);
};

SimpleDB.prototype.putAttributes = function(args, callback) {
    var self = this;

    // check that we have a domain name
    if ( ! args.domainName ) {
        callback({ Code : 'AwsSumCheck', Message : 'No domain name given' }, null);
        return;
    }

    // check that we have an item name
    if ( ! args.itemName ) {
        callback({ Code : 'AwsSumCheck', Message : 'No item name given' }, null);
        return;
    }

    // make our params
    // console.log(args.data);
    var params = this.dataToPutAttributes(args.data);

    // add our domain and item names
    self.addParam( params, 'DomainName', args.domainName );
    self.addParam( params, 'ItemName', args.itemName );

    // console.log(params);

    self.addParam( params, 'Action', 'PutAttributes' );
    self.performRequest({ params : params }, callback);
};

SimpleDB.prototype.select = function(args, callback) {
    var self = this;

    // check that we have a domain name
    if ( ! args.selectExpression ) {
        callback({ Code : 'AwsSumCheck', Message : 'No select expression given' }, null);
        return;
    }

    // make our params
    var params = [];
    self.addParam( params, 'SelectExpression', args.selectExpression );

    // do ConsistentRead if we have one
    if ( typeof args.consistentRead !== 'undefined' ) {
        if ( typeof args.consistentRead !== 'boolean' ) {
            callback({ Code : 'AwsSumCheck', Message : 'No consistent read must be a boolean value' }, null);
            return;
        }
        self.addParam( params, 'ConsistentRead', '' + args.consistentRead );
    }

    // do NextToken if we have one
    if ( typeof args.nextToken !== 'undefined' ) {
        self.addParam( params, 'NextToken', '' + args.nextToken );
    }

    self.addParam( params, 'Action', 'Select' );
    self.performRequest({ params : params }, callback);
};

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.SimpleDB = SimpleDB;

// --------------------------------------------------------------------------------------------------------------------
