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

    DeprecateActivityType : {
        // request
        defaults : {
            'Target' : 'DeprecateActivityType',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
            'ActivityType' : {
                'name'     : 'activityType',
                'required' : true,
                'type'     : 'json',
            },
            'Domain' : {
                'name'     : 'domain',
                'required' : true,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    DeprecateDomain : {
        // request
        defaults : {
            'Target' : 'DeprecateDomain',
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
        },
        body : bodyJson,
    },

    DeprecateWorkflowType : {
        // request
        defaults : {
            'Target' : 'DeprecateWorkflowType',
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
            'WorkflowType' : {
                'name'     : 'workflowType',
                'required' : true,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    DescribeActivityType : {
        // request
        defaults : {
            'Target' : 'DescribeActivityType',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
            'ActivityType' : {
                'name'     : 'activityType',
                'required' : true,
                'type'     : 'json',
            },
            'Domain' : {
                'name'     : 'domain',
                'required' : true,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    DescribeDomain : {
        // request
        defaults : {
            'Target' : 'DescribeDomain',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
            'Name' : {
                'name'     : 'name',
                'required' : true,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    DescribeWorkflowExecution : {
        // request
        defaults : {
            'Target' : 'DescribeWorkflowExecution',
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
            'Execution' : {
                'name'     : 'execution',
                'required' : true,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    DescribeWorkflowType : {
        // request
        defaults : {
            'Target' : 'DescribeWorkflowType',
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
            'WorkflowType' : {
                'name'     : 'workflowType',
                'required' : true,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    GetWorkflowExecutionHistory : {
        // request
        defaults : {
            'Target' : 'DescribeWorkflowExecution',
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
            'Execution' : {
                'name'     : 'execution',
                'required' : true,
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
        },
        body : bodyJson,
    },

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

    PollForActivityTask : {
        // request
        defaults : {
            'Target' : 'PollForActivityTask',
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
            'Identity' : {
                'name'     : 'identity',
                'required' : false,
                'type'     : 'json',
            },
            'TaskList' : {
                'name'     : 'taskList',
                'required' : true,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    PollForDecisionTask : {
        // request
        defaults : {
            'Target' : 'PollForDecisionTask',
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
            'Identity' : {
                'name'     : 'identity',
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
            'TaskList' : {
                'name'     : 'taskList',
                'required' : true,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    RecordActivityTaskHeartbeat : {
        // request
        defaults : {
            'Target' : 'RecordActivityTaskHeartbeat',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
            'Details' : {
                'name'     : 'details',
                'required' : false,
                'type'     : 'json',
            },
            'TaskToken' : {
                'name'     : 'taskToken',
                'required' : true,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    RegisterActivityType : {
        DefaultTaskHeartbeatTimeout : {
            'name'     : 'defaultTaskHeartbeatTimeout',
            'required' : false,
            'type'     : 'json',
        },
        DefaultTaskList : {
            'name'     : 'defaultTaskList',
            'required' : false,
            'type'     : 'json',
        },
        DefaultTaskScheduleToCloseTimeout : {
            'name'     : 'defaultTaskScheduleToCloseTimeout',
            'required' : false,
            'type'     : 'json',
        },
        DefaultTaskScheduleToStartTimeout : {
            'name'     : 'defaultTaskScheduleToStartTimeout',
            'required' : false,
            'type'     : 'json',
        },
        DefaultTaskStartToCloseTimeout : {
            'name'     : 'defaultTaskStartToCloseTimeout',
            'required' : false,
            'type'     : 'json',
        },
        Description : {
            'name'     : 'description',
            'required' : false,
            'type'     : 'json',
        },
        Domain : {
            'name'     : 'domain',
            'required' : true,
            'type'     : 'json',
        },
        Name : {
            'name'     : 'name',
            'required' : true,
            'type'     : 'json',
        },
        Version : {
            'name'     : 'version',
            'required' : true,
            'type'     : 'json',
        },
    },

    RegisterDomain : {
        // request
        defaults : {
            'Target' : 'RegisterDomain',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
            'Description' : {
                'name'     : 'description',
                'required' : false,
                'type'     : 'json',
            },
            'Domain' : {
                'name'     : 'domain',
                'required' : true,
                'type'     : 'json',
            },
            'WorkflowExecutionRetentionPeriodInDays' : {
                'name'     : 'workflowExecutionRetentionPeriodInDays',
                'required' : true,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    RegisterWorkflowType : {
        // request
        defaults : {
            'Target' : 'RegisterWorkflowType',
        },
        args : {
            defaultChildPolicy : {
                'name'     : 'defaultChildPolicy',
                'required' : false,
                'type'     : 'json',
            },
            defaultExecutionStartToCloseTimeout : {
                'name'     : 'defaultExecutionStartToCloseTimeout',
                'required' : false,
                'type'     : 'json',
            },
            defaultTaskList : {
                'name'     : 'defaultTaskList',
                'required' : false,
                'type'     : 'json',
            },
            defaultTaskStartToCloseTimeout : {
                'name'     : 'defaultTaskStartToCloseTimeout',
                'required' : false,
                'type'     : 'json',
            },
            description : {
                'name'     : 'description',
                'required' : false,
                'type'     : 'json',
            },
            domain : {
                'name'     : 'domain',
                'required' : true,
                'type'     : 'json',
            },
            name : {
                'name'     : 'name',
                'required' : true,
                'type'     : 'json',
            },
            version : {
                'name'     : 'version',
                'required' : true,
                'type'     : 'json',
            },
        },
    },

    RequestCancelWorkflowExecution : {
        // request
        defaults : {
            'Target' : 'RequestCancelWorkflowExecution',
        },
        args : {
            domain : {
                'name'     : 'domain',
                'required' : true,
                'type'     : 'json',
            },
            runId : {
                'name'     : 'runId',
                'required' : false,
                'type'     : 'json',
            },
            workflowId : {
                'name'     : 'workflowId',
                'required' : true,
                'type'     : 'json',
            },
        },
    },

    RespondActivityTaskCanceled : {
        // request
        defaults : {
            'Target' : 'RespondActivityTaskCanceled',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
            'Details' : {
                'name'     : 'details',
                'required' : false,
                'type'     : 'json',
            },
            'TaskToken' : {
                'name'     : 'taskToken',
                'required' : true,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    RespondActivityTaskCompleted : {
        // request
        defaults : {
            'Target' : 'RespondActivityTaskCompleted',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
            'Result' : {
                'name'     : 'result',
                'required' : false,
                'type'     : 'json',
            },
            'TaskToken' : {
                'name'     : 'taskToken',
                'required' : true,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    RespondActivityTaskFailed : {
        // request
        defaults : {
            'Target' : 'RespondActivityTaskFailed',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
            'Details' : {
                'name'     : 'details',
                'required' : false,
                'type'     : 'json',
            },
            'Reason' : {
                'name'     : 'reason',
                'required' : false,
                'type'     : 'json',
            },
            'TaskToken' : {
                'name'     : 'taskToken',
                'required' : true,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    RespondDecisionTaskCompleted : {
        // request
        defaults : {
            'Target' : 'RespondDecisionTaskCompleted',
        },
        args : {
            'Target' : {
                'required' : true,
                'type'     : 'special',
            },
            'Decisions' : {
                'name'     : 'decisions',
                'required' : false,
                'type'     : 'json',
            },
            'ExecutionContext' : {
                'name'     : 'executionContext',
                'required' : false,
                'type'     : 'json',
            },
            'TaskToken' : {
                'name'     : 'taskToken',
                'required' : true,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    SignalWorkflowExecution : {
        // request
        defaults : {
            'Target' : 'SignalWorkflowExecution',
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
            'Input' : {
                'name'     : 'input',
                'required' : false,
                'type'     : 'json',
            },
            'RunId' : {
                'name'     : 'runId',
                'required' : false,
                'type'     : 'json',
            },
            'SignalName' : {
                'name'     : 'signalName',
                'required' : true,
                'type'     : 'json',
            },
            'WorkflowId' : {
                'name'     : 'workflowId',
                'required' : true,
                'type'     : 'json',
            },
        },
        body : bodyJson,
    },

    StartWorkflowExecution : {
        // request
        defaults : {
            'Target' : 'StartWorkflowExecution',
        },
        args : {
            childPolicy : {
                'name'     : 'childPolicy',
                'required' : false,
                'type'     : 'json',
            },
            domain : {
                'name'     : 'domain',
                'required' : true,
                'type'     : 'json',
            },
            executionStartToCloseTimeout : {
                'name'     : 'executionStartToCloseTimeout',
                'required' : false,
                'type'     : 'json',
            },
            input : {
                'name'     : 'input',
                'required' : false,
                'type'     : 'json',
            },
            tagList : {
                'name'     : 'tagList',
                'required' : false,
                'type'     : 'json',
            },
            taskList : {
                'name'     : 'taskList',
                'required' : false,
                'type'     : 'json',
            },
            taskStartToCloseTimeout : {
                'name'     : 'taskStartToCloseTimeout',
                'required' : false,
                'type'     : 'json',
            },
            workflowId : {
                'name'     : 'workflowId',
                'required' : true,
                'type'     : 'json',
            },
            workflowType : {
                'name'     : 'workflowType',
                'required' : true,
                'type'     : 'json',
            },
        },
    },

    TerminateWorkflowExecution : {
        // request
        defaults : {
            'Target' : 'TerminateWorkflowExecution',
        },
        args : {
            childPolicy : {
                'name'     : 'childPolicy',
                'required' : false,
                'type'     : 'json',
            },
            details : {
                'name'     : 'details',
                'required' : false,
                'type'     : 'json',
            },
            domain : {
                'name'     : 'domain',
                'required' : true,
                'type'     : 'json',
            },
            reason : {
                'name'     : 'reason',
                'required' : false,
                'type'     : 'json',
            },
            runId : {
                'name'     : 'runId',
                'required' : false,
                'type'     : 'json',
            },
            workflowId : {
                'name'     : 'workflowId',
                'required' : true,
                'type'     : 'json',
            },
        },
    },

};
