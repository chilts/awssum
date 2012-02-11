// --------------------------------------------------------------------------------------------------------------------
//
// dynamodb-config.js - config for Amazon DynamoDB
//
// Copyright (c) 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

var _ = require('underscore');
var data2xml = require('data2xml');

// --------------------------------------------------------------------------------------------------------------------
// utility functions

function bodyCreateTable(options, args) {
    var data = {
        TableName : args.TableName,
        KeySchema : {
            HashKeyElement : {
                AttributeName : args.HashAttrName,
                AttributeType : args.HashAttrType,
            },
        },
        ProvisionedThroughput : {
            ReadCapacityUnits : args.ReadCapacityUnits,
            WriteCapacityUnits : args.WriteCapacityUnits,
        },
    };

    if ( args.RangeAttrName || args.RangeAttrType ) {
        data.KeySchema.RangeKeyElement = {
            AttributeName : args.RangeAttrName,
            AttributeType : args.RangeAttrType,
        };
    }

    // console.log(JSON.stringify(data));

    return JSON.stringify(data);
}

function bodyDescribeTable(options, args) {
    var data = {
        TableName : args.TableName,
    };

    return JSON.stringify(data);
}

function bodyListTables(options, args) {
    var data = {};

    if ( !_.isUndefined(args.Limit) ) {
        data.Limit = args.Limit;
    }

    if ( !_.isUndefined(args.ExclusiveStartTableName) ) {
        data.ExclusiveStartTableName = args.ExclusiveStartTableName;
    }

    return JSON.stringify(data);
}

function bodyPutItem(options, args) {
    var data = {
        TableName : args.TableName,
        Item      : args.Item,
    };

    var optional = [ 'Expected', 'ReturnValues' ];
    optional.forEach(function(v, i) {
        if ( !_.isUndefined(args[v]) ) {
            data[v] = args[v];
        }
    });

    // console.log(JSON.stringify(data));

    return JSON.stringify(data);
}

var optionalQueryArgs = [ 'AttributesToGet', 'Limit', 'ConsistentRead', 'Count', 'ScanIndexForward', 'ExclusiveStartKey' ];
function bodyQuery(options, args) {
    var data = {
        TableName : args.TableName,
        HashKeyValue : args.HashKeyValue,
    };

    var keyName;
    for ( var i = 0; i < optionalQueryArgs.length; i++ ) {
        keyName = optionalQueryArgs[i];
        if ( !_.isUndefined( args[keyName] ) ) {
            data[keyName] = args[keyName];
        }
    }

    if ( args.AttributeValueList || args.ComparisonOperator ) {
        data.RangeKeyCondition = {
            AttributeValueList : args.AttributeValueList,
            ComparisonOperator : args.ComparisonOperator,
        };
    }

    // console.log(JSON.stringify(data));

    return JSON.stringify(data);
}

var optionalScanArgs = [ 'AttributesToGet', 'Count', 'ScanFilter', 'ExclusiveStartKey' ];
function bodyScan(options, args) {
    var data = {
        TableName : args.TableName,
    };

    var keyName;
    for ( var i = 0; i < optionalScanArgs.length; i++ ) {
        keyName = optionalQueryArgs[i];
        if ( !_.isUndefined( args[keyName] ) ) {
            data[keyName] = args[keyName];
        }
    }

    // console.log(JSON.stringify(data));

    return JSON.stringify(data);
}

// --------------------------------------------------------------------------------------------------------------------

// This list from: http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/operationlist.html
//
// * http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_BatchGetItems.html
// * http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_CreateTable.html
// * http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_DeleteItem.html
// * http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_DeleteTable.html
// * http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_DescribeTables.html
// * http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_GetItem.html
// * http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_ListTables.html
// * http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_PutItem.html
// * http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_Query.html
// * http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_Scan.html
// * http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_UpdateItem.html
// * http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_UpdateTable.html

module.exports = {

    CreateTable : {
        defaults : {
            Target : 'CreateTable'
        },
        args : {
            Target : {
                required : true,
                type     : 'special',
            },
            TableName : {
                required : true,
                type     : 'special',
            },
            ReadCapacityUnits : {
                required : true,
                type     : 'special',
            },
            WriteCapacityUnits : {
                required : true,
                type     : 'special',
            },
            HashAttrName : {
                required : true,
                type     : 'special',
            },
            HashAttrType : {
                required : true,
                type     : 'special',
            },
            RangeAttrName : {
                required : false,
                type     : 'special',
            },
            RangeAttrType : {
                required : false,
                type     : 'special',
            },
        },
        body : bodyCreateTable,
    },

    DescribeTable : {
        defaults : {
            Target : 'DescribeTable'
        },
        args : {
            Target : {
                required : true,
                type     : 'special',
            },
            TableName : {
                required : true,
                type     : 'special',
            },
        },
        body : bodyDescribeTable,
    },

    ListTables : {
        defaults : {
            Target : 'ListTables'
        },
        args : {
            Target : {
                required : true,
                type     : 'special',
            },
            Limit : {
                required : false,
                type     : 'special',
            },
            ExclusiveStartTableName : {
                required : false,
                type     : 'special',
            },
        },
        body : bodyListTables,
    },

    PutItem : {
        defaults : {
            Target : 'PutItem'
        },
        args : {
            Target : {
                required : true,
                type     : 'special',
            },
            TableName : {
                required : true,
                type     : 'special',
            },
            Item : {
                required : false,
                type     : 'special',
            },
        },
        body : bodyPutItem,
    },

    Query : {
        defaults : {
            Target : 'Query'
        },
        args : {
            Target : {
                required : true,
                type     : 'special',
            },
            TableName : {
                required : true,
                type     : 'special',
            },
            AttributesToGet : {
                required : false,
                type     : 'special',
            },
            Limit : {
                required : false,
                type     : 'special',
            },
            ConsistentRead : {
                required : false,
                type     : 'special',
            },
            Count : {
                required : false,
                type     : 'special',
            },
            // this is a { 'S' : 'Value' } or { 'N' : 'Value' } combination
            HashKeyValue : {
                required : true,
                type     : 'special',
            },
            // list of value pairs ({ 'S' : 'Value' } or { 'N' : 'Value' })
            AttributeValueList : {
                required : false,
                type     : 'special',
            },
            ComparisonOperator : {
                required : false,
                type     : 'special',
            },
            ScanIndexForward : {
                required : false, // 'true' or 'false'
                type     : 'special',
            },
        },
        body : bodyQuery,
    },

    Scan : {
        defaults : {
            Target : 'Scan'
        },
        args : {
            Target : {
                required : true,
                type     : 'special',
            },
            TableName : {
                required : true,
                type     : 'special',
            },
            AttributesToGet : {
                required : false,
                type     : 'special',
            },
            Limit : {
                required : false,
                type     : 'special',
            },
            Count : {
                required : false,
                type     : 'special',
            },
            AttributeValueList : {
                required : false,
                type     : 'special',
            },
            ComparisonOperator : {
                required : false,
                type     : 'special',
            },
            ExclusiveStartKey : {
                required : false, // of HashKeyElement and RangeKeyElement
                type     : 'special',
            },
        },
        body : bodyScan,
    },

};

// --------------------------------------------------------------------------------------------------------------------
