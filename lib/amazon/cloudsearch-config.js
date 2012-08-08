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

var optional        = { required : false, type : 'param'                          };
var required        = { required : true,  type : 'param'                          };
var optionalArray   = { required : false, type : 'param-array', prefix : 'member' };
var requiredArray   = { required : true,  type : 'param-array', prefix : 'member' };
var optionalData    = { required : false, type : 'param-data',  prefix : 'member' };
var requiredData    = { required : true,  type : 'param-data',  prefix : 'member' };
var requiredJson    = { required : true,  type : 'param-json'                     };
var requiredSpecial = { required : true,  type : 'special'                        };

module.exports = {

    // Configuration API

    CreateDomain : {
        defaults : {
            Action : 'CreateDomain'
        },
        args : {
            Action     : required,
            DomainName : required,
        },
    },

    DefineIndexField : {
        defaults : {
            Action : 'DefineIndexField'
        },
        args : {
            Action     : required,
            DomainName : required,
            IndexField : requiredData,
       },
    },

    DefineRankExpression : {
        defaults : {
            Action : 'DefineRankExpression'
        },
        args : {
            Action         : required,
            DomainName     : required,
            RankExpression : requiredData,
        },
    },

    DeleteDomain : {
        defaults : {
            Action : 'DeleteDomain'
        },
        args : {
            Action     : required,
            DomainName : required,
        },
    },

    DeleteIndexField : {
        defaults : {
            Action : 'DeleteIndexField'
        },
        args : {
            Action         : required,
            DomainName     : required,
            IndexFieldName : required,
        },
    },

    DeleteRankExpression : {
        defaults : {
            Action : 'DeleteRankExpression'
        },
        args : {
            Action     : required,
            DomainName : required,
            RankName   : required,
        },
    },

    DescribeDefaultSearchField : {
        defaults : {
            Action : 'DescribeDefaultSearchField'
        },
        args : {
            Action     : required,
            DomainName : required,
        },
    },

    DescribeDomains : {
        defaults : {
            Action : 'DescribeDomains'
        },
        args : {
            Action      : required,
            DomainNames : optionalArray,
        },
    },

    DescribeIndexFields : {
        defaults : {
            Action : 'DescribeIndexFields'
        },
        args : {
            Action     : required,
            DomainName : required,
            FieldNames : optionalArray,
        },
    },

    DescribeRankExpressions : {
        defaults : {
            Action : 'DescribeRankExpressions'
        },
        args : {
            Action     : required,
            DomainName : required,
            RankNames  : optionalArray,
        },
    },

    DescribeServiceAccessPolicies : {
        defaults : {
            Action : 'DescribeServiceAccessPolicies'
        },
        args : {
            Action     : required,
            DomainName : required,
        },
    },

    DescribeStemmingOptions : {
        defaults : {
            Action : 'DescribeStemmingOptions'
        },
        args : {
            Action     : required,
            DomainName : required,
        },
    },

    DescribeStopwordOptions : {
        defaults : {
            Action : 'DescribeStopwordOptions'
        },
        args : {
            Action     : required,
            DomainName : required,
        },
    },

    DescribeSynonymOptions : {
        defaults : {
            Action : 'DescribeSynonymOptions'
        },
        args : {
            Action     : required,
            DomainName : required,
        },
    },

    IndexDocuments : {
        defaults : {
            Action : 'IndexDocuments'
        },
        args : {
            Action     : required,
            DomainName : required,
        },
    },

    UpdateDefaultSearchField : {
        defaults : {
            Action : 'UpdateDefaultSearchField'
        },
        args : {
            Action             : required,
            DefaultSearchField : required,
            DomainName         : required,
        },
    },

    UpdateServiceAccessPolicies : {
        defaults : {
            Action : 'UpdateServiceAccessPolicies'
        },
        args : {
            Action         : required,
            AccessPolicies : requiredJson,
            DomainName     : required,
        },
    },

    UpdateStemmingOptions : {
        defaults : {
            Action : 'UpdateStemmingOptions'
        },
        args : {
            Action     : required,
            DomainName : required,
            Stems      : requiredJson,
        },
    },

    UpdateStopwordOptions : {
        defaults : {
            Action : 'UpdateStopwordOptions'
        },
        args : {
            Action     : required,
            DomainName : required,
            Stopwords  : requiredJson,
        },
    },

    UpdateSynonymOptions : {
        defaults : {
            Action : 'UpdateSynonymOptions'
        },
        args : {
            Action     : required,
            DomainName : required,
            Synonyms   : requiredJson,
        },
    },

};

// --------------------------------------------------------------------------------------------------------------------
