// --------------------------------------------------------------------------------------------------------------------
//
// emr-config.js - class for AWS Elastic Map Reduce
//
// Copyright (c) 2011, 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// From: http://docs.amazonwebservices.com/ElasticMapReduce/latest/API/API_Operations.html
//
// * http://docs.amazonwebservices.com/ElasticMapReduce/latest/API/API_AddInstanceGroups.html
// * http://docs.amazonwebservices.com/ElasticMapReduce/latest/API/API_AddJobFlowSteps.html
// * http://docs.amazonwebservices.com/ElasticMapReduce/latest/API/API_DescribeJobFlows.html
// * http://docs.amazonwebservices.com/ElasticMapReduce/latest/API/API_ModifyInstanceGroups.html
// * http://docs.amazonwebservices.com/ElasticMapReduce/latest/API/API_RunJobFlow.html
// * http://docs.amazonwebservices.com/ElasticMapReduce/latest/API/API_SetTerminationProtection.html
// * http://docs.amazonwebservices.com/ElasticMapReduce/latest/API/API_TerminateJobFlows.html

var required      = { required : true,  type : 'param' };
var optional      = { required : false, type : 'param' };
var requiredArray = { required : true,  type : 'param-array', prefix : 'member' };
var optionalArray = { required : false, type : 'param-array', prefix : 'member' };
var requiredData  = { required : true,  type : 'param-data',  prefix : 'member' };
var optionalData  = { required : false, type : 'param-data',  prefix : 'member' };

module.exports = {

   AddInstanceGroups  : {
        defaults : {
            Action : 'AddInstanceGroups',
        },
        args : {
            Action         : required,
            InstanceGroups : requiredData,
            JobFlowId      : required,
        },
    },

    AddJobFlowSteps : {
        defaults : {
            Action : 'AddJobFlowSteps',
        },
        args : {
            Action    : required,
            JobFlowId : required,
            Steps     : requiredData,
        },
    },

    DescribeJobFlows : {
        defaults : {
            Action : 'DescribeJobFlows',
        },
        args : {
            Action        : required,
            CreatedAfter  : optional,
            CreatedBefore : optional,
            JobFlowIds    : optionalArray,
            JobFlowStates : optionalArray,
        },
    },

    ModifyInstanceGroups : {
        defaults : {
            Action : 'ModifyInstanceGroups',
        },
        args : {
            Action         : required,
            InstanceGroups : optionalData,
        },
    },

    RunJobFlow : {
        defaults : {
            Action : 'RunJobFlow',
        },
        args : {
            Action            : required,
            AdditionalInfo    : optional,
            AmiVersion        : optional,
            BootstrapActions  : optionalData,
            Instances         : requiredData,
            LogUri            : optional,
            Name              : required,
            Steps             : optionalData,
            SupportedProducts : optionalArray,
        },
    },

    SetTerminationProtection : {
        defaults : {
            Action : 'SetTerminationProtection',
        },
        args : {
            Action               : required,
            JobFlowIds           : requiredArray,
            TerminationProtected : required,
        },
    },

    TerminateJobFlows : {
        defaults : {
            Action : 'TerminateJobFlows',
        },
        args : {
            Action     : required,
            JobFlowIds : requiredArray,
        },
    },

};

// --------------------------------------------------------------------------------------------------------------------
