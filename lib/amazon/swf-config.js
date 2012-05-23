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
// bodies

function bodyJson(options, args) {
    return JSON.stringify(options.json);
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
            'CloseStatusFilter' : {
                'name'     : 'closeStatusFilter',
                'required' : false,
                'type'     : 'json',
            },
            'CloseTimeFilter' : {
                'name'     : 'closeTimeFilter',
                'required' : false,
                'type'     : 'json',
            },
            'Domain' : {
                'name'     : 'domain',
                'required' : true,
                'type'     : 'json',
            },
            'ExecutionFilter' : {
                'name'     : 'executionFilter',
                'required' : false,
                'type'     : 'json',
            },
            'StartTimeFilter' : {
                'name'     : 'startTimeFilter',
                'required' : false,
                'type'     : 'json',
            },
            'TagFilter' : {
                'name'     : 'tagFilter',
                'required' : false,
                'type'     : 'json',
            },
            'TypeFilter' : {
                'name'     : 'typeFilter',
                'required' : false,
                'type'     : 'json',
            },
        },
    },

    CountOpenWorkflowExecutions : {
        defaults : {
            'Target' : 'CountOpenWorkflowExecutions',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
            'Domain' : {
                'name'     : 'domain',
                'required' : true,
                'type'     : 'json',
            },
            'ExecutionFilter' : {
                'name'     : 'executionFilter',
                'required' : false,
                'type'     : 'json',
            },
            'StartTimeFilter' : {
                'name'     : 'startTimeFilter',
                'required' : true,
                'type'     : 'json',
            },
            'TagFilter' : {
                'name'     : 'tagFilter',
                'required' : false,
                'type'     : 'json',
            },
            'TypeFilter' : {
                'name'     : 'typeFilter',
                'required' : false,
                'type'     : 'json',
            },
        },
    },

    CountPendingActivityTasks : {
        defaults : {
            'Target' : 'CountPendingActivityTasks',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
            'Domain' : {
                'name'     : 'domain',
                'required' : true,
                'type'     : 'json',
            },
            'TaskList' : {
                'name'     : 'taskList',
                'required' : true,
                'type'     : 'json',
            },
        },
    },

    CountPendingDecisionTasks : {
        defaults : {
            'Target' : 'CountPendingDecisionTasks',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
            'Domain' : {
                'name'     : 'domain',
                'required' : true,
                'type'     : 'json',
            },
            'TaskList' : {
                'name'     : 'taskList',
                'required' : true,
                'type'     : 'json',
            },
        },
    },

    DeprecateActivityType : {},
    DeprecateDomain : {},
    DeprecateWorkflowType : {},
    DescribeActivityType : {},
    DescribeDomain : {},
    DescribeWorkflowExecution : {},
    DescribeWorkflowType : {},
    GetWorkflowExecutionHistory : {},

    ListActivityTypes : {
        // request
        defaults : {
            'Target' : 'ListActivityTypes',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
            'Domain' : {
                'name'     : 'domain',
                'required' : true,
                'type'     : 'json',
            },
            'MaximumPageSize' : {
                'name'     : 'maximumPageSize',
                'required' : false,
                'type'     : 'json',
            },
            'Name' : {
                'name'     : 'name',
                'required' : false,
                'type'     : 'json',
            },
            'NextPageToken' : {
                'name'     : 'nextPageToken',
                'required' : false,
                'type'     : 'json',
            },
            'RegistrationStatus' : {
                'name'     : 'registrationStatus',
                'required' : true,
                'type'     : 'json',
            },
            'ReverseOrder' : {
                'name'     : 'reverseOrder',
                'required' : false,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    ListClosedWorkflowExecutions : {
        // request
        defaults : {
            'Target' : 'ListClosedWorkflowExecutions',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
            'CloseStatusFilter' : {
                'name'     : 'closeStatusFilter',
                'required' : false,
                'type'     : 'json',
            },
            'CloseTimeFilter' : {
                'name'     : 'closeTimeFilter',
                'required' : false,
                'type'     : 'json',
            },
            'Domain' : {
                'name'     : 'domain',
                'required' : true,
                'type'     : 'json',
            },
            'ExecutionFilter' : {
                'name'     : 'executionFilter',
                'required' : false,
                'type'     : 'json',
            },
            'MaximumPageSize' : {
                'name'     : 'maximumPageSize',
                'required' : false,
                'type'     : 'json',
            },
            'NextPageToken' : {
                'name'     : 'nextPageToken',
                'required' : false,
                'type'     : 'json',
            },
            'ReverseOrder' : {
                'name'     : 'reverseOrder',
                'required' : false,
                'type'     : 'json',
            },
            'StartTimeFilter' : {
                'name'     : 'startTimeFilter',
                'required' : false,
                'type'     : 'json',
            },
            'TagFilter' : {
                'name'     : 'tagFilter',
                'required' : false,
                'type'     : 'json',
            },
            'TypeFilter' : {
                'name'     : 'typeFilter',
                'required' : false,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    ListDomains : {
        // request
        defaults : {
            'Target' : 'ListDomains',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
            'MaximumPageSize' : {
                'name'     : 'maximumPageSize',
                'required' : false,
                'type'     : 'json',
            },
            'NextPageToken' : {
                'name'     : 'nextPageToken',
                'required' : false,
                'type'     : 'json',
            },
            'RegistrationStatus' : {
                'name'     : 'registrationStatus',
                'required' : true,
                'type'     : 'json',
            },
            'ReverseOrder' : {
                'name'     : 'reverseOrder',
                'required' : false,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    ListOpenWorkflowExecutions : {
        // request
        defaults : {
            'Target' : 'ListOpenWorkflowExecutions',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
            'Domain' : {
                'name'     : 'domain',
                'required' : true,
                'type'     : 'json',
            },
            'ExecutionFilter' : {
                'name'     : 'executionFilter',
                'required' : false,
                'type'     : 'json',
            },
            'MaximumPageSize' : {
                'name'     : 'maximumPageSize',
                'required' : false,
                'type'     : 'json',
            },
            'NextPageToken' : {
                'name'     : 'nextPageToken',
                'required' : false,
                'type'     : 'json',
            },
            'ReverseOrder' : {
                'name'     : 'reverseOrder',
                'required' : false,
                'type'     : 'json',
            },
            'StartTimeFilter' : {
                'name'     : 'startTimeFilter',
                'required' : false,
                'type'     : 'json',
            },
            'TagFilter' : {
                'name'     : 'tagFilter',
                'required' : false,
                'type'     : 'json',
            },
            'TypeFilter' : {
                'name'     : 'typeFilter',
                'required' : false,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    ListWorkflowTypes : {
        // request
        defaults : {
            'Target' : 'ListWorkflowTypes',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
            'Domain' : {
                'name'     : 'domain',
                'required' : true,
                'type'     : 'json',
            },
            'MaximumPageSize' : {
                'name'     : 'maximumPageSize',
                'required' : false,
                'type'     : 'json',
            },
            'Name' : {
                'name'     : 'name',
                'required' : false,
                'type'     : 'json',
            },
            'NextPageToken' : {
                'name'     : 'nextPageToken',
                'required' : false,
                'type'     : 'json',
            },
            'RegistrationStatus' : {
                'name'     : 'registrationStatus',
                'required' : false,
                'type'     : 'json',
            },
            'ReverseOrder' : {
                'name'     : 'reverseOrder',
                'required' : false,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

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
