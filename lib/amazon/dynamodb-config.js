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

};

// --------------------------------------------------------------------------------------------------------------------
