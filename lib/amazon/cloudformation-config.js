// --------------------------------------------------------------------------------------------------------------------
//
// cloudformation-config.js - class for AWS CloudFormation
//
// Copyright (c) 2011, 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// From: http://docs.amazonwebservices.com/AWSCloudFormation/latest/APIReference/API_Operations.html
//
// * http://docs.amazonwebservices.com/AWSCloudFormation/latest/APIReference/API_CreateStack.html
// * http://docs.amazonwebservices.com/AWSCloudFormation/latest/APIReference/API_DeleteStack.html
// * http://docs.amazonwebservices.com/AWSCloudFormation/latest/APIReference/API_DescribeStackEvents.html
// * http://docs.amazonwebservices.com/AWSCloudFormation/latest/APIReference/API_DescribeStackResource.html
// * http://docs.amazonwebservices.com/AWSCloudFormation/latest/APIReference/API_DescribeStackResources.html
// * http://docs.amazonwebservices.com/AWSCloudFormation/latest/APIReference/API_DescribeStacks.html
// * http://docs.amazonwebservices.com/AWSCloudFormation/latest/APIReference/API_EstimateTemplateCost.html
// * http://docs.amazonwebservices.com/AWSCloudFormation/latest/APIReference/API_GetTemplate.html
// * http://docs.amazonwebservices.com/AWSCloudFormation/latest/APIReference/API_ListStackResources.html
// * http://docs.amazonwebservices.com/AWSCloudFormation/latest/APIReference/API_ListStacks.html
// * http://docs.amazonwebservices.com/AWSCloudFormation/latest/APIReference/API_UpdateStack.html
// * http://docs.amazonwebservices.com/AWSCloudFormation/latest/APIReference/API_ValidateTemplate.html

var required      = { required : true,  type : 'param'       };
var optional      = { required : false, type : 'param'       };
var requiredArray = { required : true,  type : 'param-array' };
var optionalArray = { required : false, type : 'param-array' };
var requiredData  = { required : true,  type : 'param-data'  };
var optionalData  = { required : false, type : 'param-data'  };

module.exports = {

    CreateStack : {
        defaults : {
            Action : 'CreateStack'
        },
        args : {
            Action           : required,
            Capabilities     : optionalArray,
            DisableRollback  : optional,
            NotificationARNs : optionalArray,
            Parameters       : optionalArray,
            StackName        : required,
            TemplateBody     : optional,
            TemplateURL      : optional,
            TimeoutInMinutes : optional,
        },
    },

    DeleteStack : {
        defaults : {
            Action : 'DeleteStack'
        },
        args : {
            Action    : required,
            StackName : required,
        },
    },

    DescribeStackEvents : {
        defaults : {
            Action : 'DescribeStackEvents'
        },
        args : {
            Action    : required,
            NextToken : optional,
            StackName : optional,
        },
    },

    DescribeStackResource : {
        defaults : {
            Action : 'DescribeStackResource'
        },
        args : {
            Action            : required,
            LogicalResourceId : required,
            StackName         : required,
        },
    },

    DescribeStackResources : {
        defaults : {
            Action : 'DescribeStackResources'
        },
        args : {
            Action             : required,
            LogicalResourceId  : optional,
            PhysicalResourceId : optional,
            StackName          : optional,
        },
    },

    DescribeStacks : {
        defaults : {
            Action : 'DescribeStacks'
        },
        args : {
            Action    : required,
            StackName : optional,
        },
    },

    EstimateTemplateCost : {
        defaults : {
            Action : 'EstimateTemplateCost'
        },
        args : {
            Action       : required,
            Parameters   : optionalArray,
            TemplateBody : optional,
            TemplateURL  : optional,
        },
    },

    GetTemplate : {
        defaults : {
            Action : 'GetTemplate'
        },
        args : {
            Action    : required,
            StackName : required,
        },
    },

    ListStackResources : {
        defaults : {
            Action : 'ListStackResources'
        },
        args : {
            Action    : required,
            NextToken : optional,
            StackName : required,
        },
    },

    ListStacks : {
        defaults : {
            Action : 'ListStacks'
        },
        args : {
            Action            : required,
            NextToken         : optional,
            StackStatusFilter : optionalArray,
        },
    },

    UpdateStack : {
        defaults : {
            Action : 'UpdateStack'
        },
        args : {
            Action       : required,
            Capabilities : optionalArray,
            Parameters   : optionalArray,
            StackName    : required,
            TemplateBody : optional,
            TemplateURL  : optional,
        },
    },

    ValidateTemplate : {
        defaults : {
            Action : 'ValidateTemplate'
        },
        args : {
            Action       : required,
            TemplateBody : optional,
            TemplateURL  : optional,
        },
    },

};

// --------------------------------------------------------------------------------------------------------------------
