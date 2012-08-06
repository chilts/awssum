// --------------------------------------------------------------------------------------------------------------------
//
// cloudsearch-config.js - config for AWS CloudSearch
//
// Copyright (c) 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

var data2xml = require('data2xml');

// --------------------------------------------------------------------------------------------------------------------

// paths, bodies, etc

// --------------------------------------------------------------------------------------------------------------------

// From: http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_Operations.html
//
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_CreateDomain.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_DefineIndexField.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_DefineRankExpression.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_DeleteDomain.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_DeleteIndexField.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_DeleteRankExpression.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_DescribeDefaultSearchField.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_DescribeDomains.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_DescribeIndexFields.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_DescribeRankExpressions.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_DescribeServiceAccessPolicies.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_DescribeStemmingOptions.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_DescribeStopwordOptions.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_DescribeSynonymOptions.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_IndexDocuments.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_UpdateDefaultSearchField.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_UpdateServiceAccessPolicies.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_UpdateStemmingOptions.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_UpdateStopwordOptions.html
// * http://docs.amazonwebservices.com/cloudsearch/latest/developerguide/API_UpdateSynonymOptions.html


var optional      = { required : false, type : 'param'                          };
var required      = { required : true,  type : 'param'                          };
var optionalArray = { required : false, type : 'param-array', prefix : 'member' };
var requiredArray = { required : true,  type : 'param-array', prefix : 'member' };

module.exports = {

    DescribeDomains : {
        defaults : {
            Action : 'DescribeDomains'
        },
        args : {
            Action      : required,
            DomainNames : optionalArray,
        },
    },

};

// --------------------------------------------------------------------------------------------------------------------
