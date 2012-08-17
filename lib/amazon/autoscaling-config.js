// --------------------------------------------------------------------------------------------------------------------
//
// autoscaling-config.js - config for AWS AutoScaling
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
var requiredArray = { required : true,  type : 'param-array', prefix : 'member' };
var optionalArray = { required : false, type : 'param-array', prefix : 'member' };
var requiredData  = { required : true,  type : 'param-data',  prefix : 'member' };
var optionalData  = { required : false, type : 'param-data',  prefix : 'member' };

module.exports = {

    CreateAutoScalingGroup : {
        defaults : {
            Action : 'CreateAutoScalingGroup'
        },
        args : {
            Action                  : required,
            AutoScalingGroupName    : required,
            AvailabilityZones       : requiredArray,
            DefaultCooldown         : optional,
            DesiredCapacity         : optional,
            HealthCheckGracePeriod  : optional,
            HealthCheckType         : optional,
            LaunchConfigurationName : required,
            LoadBalancerNames       : optionalArray,
            MaxSize                 : required,
            MinSize                 : required,
            PlacementGroup          : optional,
            Tags                    : optionalData,
            VPCZoneIdentifier       : optional,
        },
    },

    CreateLaunchConfiguration : {
        defaults : {
            Action : 'CreateLaunchConfiguration'
        },
        args : {
            Action                  : required,
            BlockDeviceMappings     : optionalData,
            IamInstanceProfile      : optional,
            ImageId                 : required,
            InstanceMonitoring      : optional,
            InstanceType            : required,
            KernelId                : optional,
            KeyName                 : optional,
            LaunchConfigurationName : required,
            RamdiskId               : optional,
            SecurityGroups          : optionalArray,
            SpotPrice               : optional,
            UserData                : optional,
        },
    },

    CreateOrUpdateTags : {
        defaults : {
            Action : 'CreateOrUpdateTags'
        },
        args : {
            Action : required,
            Tags   : requiredData,
        },
    },

    DeleteAutoScalingGroup : {
        defaults : {
            Action : 'DeleteAutoScalingGroup'
        },
        args : {
            Action               : required,
            AutoScalingGroupName : required,
            ForceDelete          : optional,
        },
    },

    DeleteLaunchConfiguration : {
        defaults : {
            Action : 'DeleteLaunchConfiguration'
        },
        args : {
            Action                  : required,
            LaunchConfigurationName : required,
        },
    },

    DeleteNotificationConfiguration : {
        defaults : {
            Action : 'DeleteNotificationConfiguration'
        },
        args : {
            Action               : required,
            AutoScalingGroupName : required,
            TopicARN             : required,
        },
    },

    DeletePolicy : {
        defaults : {
            Action : 'DeletePolicy'
        },
        args : {
            Action               : required,
            AutoScalingGroupName : optional,
            PolicyName           : required,
        },
    },

    DeleteScheduledAction : {
        defaults : {
            Action : 'DeleteScheduledAction'
        },
        args : {
            Action               : required,
            AutoScalingGroupName : optional,
            ScheduledActionName  : required,
        },
    },

    DeleteTags : {
        defaults : {
            Action : 'DeleteTags'
        },
        args : {
            Action : required,
            Tags   : requiredData,
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
            Action      : required,
            InstanceIds : optionalArray,
            MaxRecords  : optional,
            NextToken   : optional,
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
            Action                   : required,
            LaunchConfigurationNames : optionalArray,
            MaxRecords               : optional,
            NextToken                : optional,
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
            Action                : required,
            AutoScalingGroupNames : optionalArray,
            MaxRecords            : optional,
            NextToken             : optional,
        },
    },

    DescribePolicies : {
        defaults : {
            Action : 'DescribePolicies'
        },
        args : {
            Action               : required,
            AutoScalingGroupName : optional,
            MaxRecords           : optional,
            NextToken            : optional,
            PolicyNames          : optionalArray,
        },
    },

    DescribeScalingActivities : {
        defaults : {
            Action : 'DescribeScalingActivities'
        },
        args : {
            Action               : required,
            ActivityIds          : optionalArray,
            AutoScalingGroupName : optional,
            MaxRecords           : optional,
            NextToken            : optional,
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
            Action               : required,
            AutoScalingGroupName : optional,
            EndTime              : optional,
            MaxRecords           : optional,
            NextToken            : optional,
            ScheduledActionNames : optionalArray,
            StartTime            : optional,
        },
    },

    DescribeTags : {
        defaults : {
            Action : 'DescribeTags'
        },
        args : {
            Action     : required,
            Filters    : optionalData,
            MaxRecords : optional,
            NextToken  : optional,
        },
    },

    DisableMetricsCollection : {
        defaults : {
            Action : 'DisableMetricsCollection'
        },
        args : {
            Action               : required,
            AutoScalingGroupName : required,
            Metrics              : optionalArray,
        },
    },

    EnableMetricsCollection : {
        defaults : {
            Action : 'EnableMetricsCollection'
        },
        args : {
            Action               : required,
            AutoScalingGroupName : required,
            Granularity          : required,
            Metrics              : optionalArray,
        },
    },

    ExecutePolicy : {
        defaults : {
            Action : 'ExecutePolicy'
        },
        args : {
            Action               : required,
            AutoScalingGroupName : optional,
            HonorCooldown        : optional,
            PolicyName           : required,
        },
    },

    PutNotificationConfiguration : {
        defaults : {
            Action : 'PutNotificationConfiguration'
        },
        args : {
            Action               : required,
            AutoScalingGroupName : required,
            NotificationTypes    : requiredArray,
            TopicARN             : required,
        },
    },

    PutScalingPolicy : {
        defaults : {
            Action : 'PutScalingPolicy'
        },
        args : {
            Action               : required,
            AdjustmentType       : required,
            AutoScalingGroupName : required,
            Cooldown             : optional,
            MinAdjustmentStep    : optional,
            PolicyName           : required,
            ScalingAdjustment    : required,
        },
    },

    PutScheduledUpdateGroupAction : {
        defaults : {
            Action : 'PutScheduledUpdateGroupAction'
        },
        args : {
            Action               : required,
            AutoScalingGroupName : required,
            DesiredCapacity      : optional,
            EndTime              : optional,
            MaxSize              : optional,
            MinSize              : optional,
            Recurrence           : optional,
            ScheduledActionName  : required,
            StartTime            : optional,
            Time                 : optional,
        },
    },

    ResumeProcesses : {
        defaults : {
            Action : 'ResumeProcesses'
        },
        args : {
            Action               : required,
            AutoScalingGroupName : required,
            ScalingProcesses     : optionalArray,
        },
    },

    SetDesiredCapacity : {
        defaults : {
            Action : 'SetDesiredCapacity'
        },
        args : {
            Action               : required,
            AutoScalingGroupName : required,
            DesiredCapacity      : required,
            HonorCooldown        : optional,
        },
    },

    SetInstanceHealth : {
        defaults : {
            Action : 'SetInstanceHealth'
        },
        args : {
            Action                   : required,
            HealthStatus             : required,
            InstanceId               : required,
            ShouldRespectGracePeriod : optional,
        },
    },

    SuspendProcesses : {
        defaults : {
            Action : 'SuspendProcesses'
        },
        args : {
            Action               : required,
            AutoScalingGroupName : required,
            ScalingProcesses     : optionalArray,
        },
    },

    TerminateInstanceInAutoScalingGroup : {
        defaults : {
            Action : 'TerminateInstanceInAutoScalingGroup'
        },
        args : {
            Action                         : required,
            InstanceId                     : required,
            ShouldDecrementDesiredCapacity : required,
        },
    },

    UpdateAutoScalingGroup : {
        defaults : {
            Action : 'UpdateAutoScalingGroup'
        },
        args : {
            Action                  : required,
            AutoScalingGroupName    : required,
            AvailabilityZones       : optionalArray,
            DefaultCooldown         : optional,
            DesiredCapacity         : optional,
            HealthCheckGracePeriod  : optional,
            HealthCheckType         : optional,
            LaunchConfigurationName : optional,
            MaxSize                 : optional,
            MinSize                 : optional,
            PlacementGroup          : optional,
            VPCZoneIdentifier       : optional,
        },
    },

};

// --------------------------------------------------------------------------------------------------------------------
