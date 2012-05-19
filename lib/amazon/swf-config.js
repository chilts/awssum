// --------------------------------------------------------------------------------------------------------------------
//
// swf-config.js - config for AWS Simple Workflow Service
//
// Copyright (c) 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// built-ins
var querystring = require('querystring');

// dependencies
var _ = require('underscore');

// --------------------------------------------------------------------------------------------------------------------

// paths, bodies and whatevers!

function bodyListDomains(options, args) {
    var data = {
        'RegistrationStatus' : args.RegistrationStatus,
    };

    console.log(JSON.stringify(data));

    return JSON.stringify(data);
}

// --------------------------------------------------------------------------------------------------------------------

// From: http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_Operations.html
//
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_CountClosedWorkflowExecutions.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_CountOpenWorkflowExecutions.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_CountPendingActivityTasks.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_CountPendingDecisionTasks.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_DeprecateActivityType.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_DeprecateDomain.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_DeprecateWorkflowType.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_DescribeActivityType.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_DescribeDomain.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_DescribeWorkflowExecution.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_DescribeWorkflowType.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_GetWorkflowExecutionHistory.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_ListActivityTypes.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_ListClosedWorkflowExecutions.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_ListDomains.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_ListOpenWorkflowExecutions.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_ListWorkflowTypes.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_PollForActivityTask.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_PollForDecisionTask.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_RecordActivityTaskHeartbeat.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_RegisterActivityType.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_RegisterDomain.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_RegisterWorkflowType.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_RequestCancelWorkflowExecution.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_RespondActivityTaskCanceled.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_RespondActivityTaskCompleted.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_RespondActivityTaskFailed.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_RespondDecisionTaskCompleted.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_SignalWorkflowExecution.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_StartWorkflowExecution.html
// * http://docs.amazonwebservices.com/amazonswf/latest/apireference/API_TerminateWorkflowExecution.html

module.exports = {

    CountClosedWorkflowExecutions : {
        defaults : {
            'Target' : 'CountClosedWorkflowExecutions',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
        },
    },

    CountOpenWorkflowExecutions : {},
    CountPendingActivityTasks : {},
    CountPendingDecisionTasks : {},
    DeprecateActivityType : {},
    DeprecateDomain : {},
    DeprecateWorkflowType : {},
    DescribeActivityType : {},
    DescribeDomain : {},
    DescribeWorkflowExecution : {},
    DescribeWorkflowType : {},
    GetWorkflowExecutionHistory : {},
    ListActivityTypes : {},
    ListClosedWorkflowExecutions : {},

    ListDomains : {
        defaults : {
            'Target' : 'ListDomains',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
            'RegistrationStatus' : {
                'required' : true,
                'type'     : 'special',
            },
        },
        body : bodyListDomains,
    },

    ListOpenWorkflowExecutions : {},
    ListWorkflowTypes : {},
    PollForActivityTask : {},
    PollForDecisionTask : {},
    RecordActivityTaskHeartbeat : {},
    RegisterActivityType : {},
    RegisterDomain : {},
    RegisterWorkflowType : {},
    RequestCancelWorkflowExecution : {},
    RespondActivityTaskCanceled : {},
    RespondActivityTaskCompleted : {},
    RespondActivityTaskFailed : {},
    RespondDecisionTaskCompleted : {},
    SignalWorkflowExecution : {},
    StartWorkflowExecution : {},
    TerminateWorkflowExecution : {},

};
