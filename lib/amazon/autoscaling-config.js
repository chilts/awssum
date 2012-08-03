// --------------------------------------------------------------------------------------------------------------------
//
// autoscaling-config.js - class for AWS AutoScaling
//
// Copyright (c) 2011, 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// From: http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_Operations.html
//
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_CreateAutoScalingGroup.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_CreateLaunchConfiguration.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_CreateOrUpdateTags.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DeleteAutoScalingGroup.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DeleteLaunchConfiguration.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DeleteNotificationConfiguration.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DeletePolicy.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DeleteScheduledAction.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DeleteTags.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DescribeAdjustmentTypes.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DescribeAutoScalingGroups.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DescribeAutoScalingInstances.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DescribeAutoScalingNotificationTypes.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DescribeLaunchConfigurations.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DescribeMetricCollectionTypes.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DescribeNotificationConfigurations.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DescribePolicies.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DescribeScalingActivities.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DescribeScalingProcessTypes.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DescribeScheduledActions.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DescribeTags.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_DisableMetricsCollection.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_EnableMetricsCollection.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_ExecutePolicy.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_PutNotificationConfiguration.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_PutScalingPolicy.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_PutScheduledUpdateGroupAction.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_ResumeProcesses.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_SetDesiredCapacity.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_SetInstanceHealth.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_SuspendProcesses.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_SuspendProcesses.html
// * http://docs.amazonwebservices.com/AutoScaling/latest/APIReference/API_UpdateAutoScalingGroup.html

var required      = { required : true,  type : 'param'       };
var optional      = { required : false, type : 'param'       };
var requiredArray = { required : true,  type : 'param-array' };
var optionalArray = { required : false, type : 'param-array' };
var requiredData  = { required : false, type : 'param-data'  };
var optionalData  = { required : false, type : 'param-data'  };

module.exports = {

    CreateAutoScalingGroup : {
        defaults : {
            Action : 'CreateAutoScalingGroup'
        },
        args : {
            Action : required,
        },
    },

    CreateLaunchConfiguration : {
        defaults : {
            Action : 'CreateLaunchConfiguration'
        },
        args : {
            Action : required,
        },
    },

    CreateOrUpdateTags : {
        defaults : {
            Action : 'CreateOrUpdateTags'
        },
        args : {
            Action : required,
        },
    },

    DeleteAutoScalingGroup : {
        defaults : {
            Action : 'DeleteAutoScalingGroup'
        },
        args : {
            Action : required,
        },
    },

    DeleteLaunchConfiguration : {
        defaults : {
            Action : 'DeleteLaunchConfiguration'
        },
        args : {
            Action : required,
        },
    },

    DeleteNotificationConfiguration : {
        defaults : {
            Action : 'DeleteNotificationConfiguration'
        },
        args : {
            Action : required,
        },
    },

    DeletePolicy : {
        defaults : {
            Action : 'DeletePolicy'
        },
        args : {
            Action : required,
        },
    },

    DeleteScheduledAction : {
        defaults : {
            Action : 'DeleteScheduledAction'
        },
        args : {
            Action : required,
        },
    },

    DeleteTags : {
        defaults : {
            Action : 'DeleteTags'
        },
        args : {
            Action : required,
        },
    },

    DescribeAdjustmentTypes : {
        defaults : {
            Action : 'DescribeAdjustmentTypes'
        },
        args : {
            Action : required,
        },
    },

    DescribeAutoScalingGroups : {
        defaults : {
            Action : 'DescribeAutoScalingGroups'
        },
        args : {
            Action                : required,
            AutoScalingGroupNames : optionalArray,
            MaxRecords            : optional,
            NextToken             : optional,
        },
    },

    DescribeAutoScalingInstances : {
        defaults : {
            Action : 'DescribeAutoScalingInstances'
        },
        args : {
            Action : required,
        },
    },

    DescribeAutoScalingNotificationTypes : {
        defaults : {
            Action : 'DescribeAutoScalingNotificationTypes'
        },
        args : {
            Action : required,
        },
    },

    DescribeLaunchConfigurations : {
        defaults : {
            Action : 'DescribeLaunchConfigurations'
        },
        args : {
            Action : required,
        },
    },

    DescribeMetricCollectionTypes : {
        defaults : {
            Action : 'DescribeMetricCollectionTypes'
        },
        args : {
            Action : required,
        },
    },

    DescribeNotificationConfigurations : {
        defaults : {
            Action : 'DescribeNotificationConfigurations'
        },
        args : {
            Action : required,
        },
    },

    DescribePolicies : {
        defaults : {
            Action : 'DescribePolicies'
        },
        args : {
            Action : required,
        },
    },

    DescribeScalingActivities : {
        defaults : {
            Action : 'DescribeScalingActivities'
        },
        args : {
            Action : required,
        },
    },

    DescribeScalingProcessTypes : {
        defaults : {
            Action : 'DescribeScalingProcessTypes'
        },
        args : {
            Action : required,
        },
    },

    DescribeScheduledActions : {
        defaults : {
            Action : 'DescribeScheduledActions'
        },
        args : {
            Action : required,
        },
    },

    DescribeTags : {
        defaults : {
            Action : 'DescribeTags'
        },
        args : {
            Action : required,
        },
    },

    DisableMetricsCollection : {
        defaults : {
            Action : 'DisableMetricsCollection'
        },
        args : {
            Action : required,
        },
    },

    EnableMetricsCollection : {
        defaults : {
            Action : 'EnableMetricsCollection'
        },
        args : {
            Action : required,
        },
    },

    ExecutePolicy : {
        defaults : {
            Action : 'ExecutePolicy'
        },
        args : {
            Action : required,
        },
    },

    PutNotificationConfiguration : {
        defaults : {
            Action : 'PutNotificationConfiguration'
        },
        args : {
            Action : required,
        },
    },

    PutScalingPolicy : {
        defaults : {
            Action : 'PutScalingPolicy'
        },
        args : {
            Action : required,
        },
    },

    PutScheduledUpdateGroupAction : {
        defaults : {
            Action : 'PutScheduledUpdateGroupAction'
        },
        args : {
            Action : required,
        },
    },

    ResumeProcesses : {
        defaults : {
            Action : 'ResumeProcesses'
        },
        args : {
            Action : required,
        },
    },

    SetDesiredCapacity : {
        defaults : {
            Action : 'SetDesiredCapacity'
        },
        args : {
            Action : required,
        },
    },

    SetInstanceHealth : {
        defaults : {
            Action : 'SetInstanceHealth'
        },
        args : {
            Action : required,
        },
    },

    SuspendProcesses : {
        defaults : {
            Action : 'SuspendProcesses'
        },
        args : {
            Action : required,
        },
    },

    SuspendProcesses : {
        defaults : {
            Action : 'SuspendProcesses'
        },
        args : {
            Action : required,
        },
    },

    UpdateAutoScalingGroup : {
        defaults : {
            Action : 'UpdateAutoScalingGroup'
        },
        args : {
            Action : required,
        },
    },

};

// --------------------------------------------------------------------------------------------------------------------
