// --------------------------------------------------------------------------------------------------------------------
//
// beanstalk-config.js - class for AWS Elastic Compute Cloud
//
// Copyright (c) 2011, 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// From: http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_Operations.html
//
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_CheckDNSAvailability.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_CreateApplication.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_CreateApplicationVersion.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_CreateConfigurationTemplate.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_CreateEnvironment.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_CreateStorageLocation.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_DeleteApplication.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_DeleteApplicationVersion.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_DeleteConfigurationTemplate.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_DeleteEnvironmentConfiguration.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_DescribeApplicationVersions.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_DescribeApplications.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_DescribeConfigurationOptions.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_DescribeConfigurationSettings.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_DescribeEnvironmentResources.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_DescribeEnvironments.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_DescribeEvents.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_ListAvailableSolutionStacks.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_RebuildEnvironment.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_RequestEnvironmentInfo.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_RestartAppServer.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_RetrieveEnvironmentInfo.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_SwapEnvironmentCNAMEs.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_TerminateEnvironment.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_UpdateApplication.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_UpdateApplicationVersion.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_UpdateConfigurationTemplate.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_UpdateEnvironment.html
// * http://docs.amazonwebservices.com/elasticbeanstalk/latest/api/API_ValidateConfigurationSettings.html

var required      = { required : true,  type : 'param'       };
var optional      = { required : false, type : 'param'       };
var requiredArray = { required : true,  type : 'param-array' };
var optionalArray = { required : false, type : 'param-array', prefix : 'member' };
var requiredData  = { required : true,  type : 'param-data'  };
var optionalData  = { required : false, type : 'param-data'  };

module.exports = {

    CheckDNSAvailability : {
        defaults : {
            Action : 'CheckDNSAvailability'
        },
        args : {
            Action      : required,
            CNAMEPrefix : required,
        },
    },

    CreateApplication : {
        defaults : {
            Action : 'CreateApplication'
        },
        args : {
            Action          : required,
            ApplicationName : required,
            Description     : optional,
        },
    },

    CreateApplicationVersion : {
        defaults : {
            Action : 'CreateApplicationVersion'
        },
        args : {
            Action                : required,
            ApplicationName       : required,
            AutoCreateApplication : optional,
            Description           : optional,
            SourceBundle          : optional,
            VersionLabel          : required,
        },
    },

    CreateConfigurationTemplate : {
        defaults : {
            Action : 'CreateConfigurationTemplate'
        },
        args : {
            Action              : required,
            ApplicationName     : required,
            Description         : optional,
            EnvironmentId       : optional,
            OptionSettings      : optionalArray,
            SolutionStackName   : optional,
            SourceConfiguration : optional,
            TemplateName        : required,
        },
    },

    CreateEnvironment : {
        defaults : {
            Action : 'CreateEnvironment'
        },
        args : {
            Action            : required,
            ApplicationName   : required,
            CNAMEPrefix       : optional,
            Description       : optional,
            EnvironmentName   : required,
            OptionSettings    : optionalArray,
            OptionsToRemove   : optionalArray,
            SolutionStackName : optional,
            TemplateName      : optional,
            VersionLabel      : optional,
        },
    },

    CreateStorageLocation : {
        defaults : {
            Action : 'CreateStorageLocation'
        },
        args : {
            Action              : required,
        },
    },

    DeleteApplication : {
        defaults : {
            Action : 'DeleteApplication'
        },
        args : {
            Action              : required,
            ApplicationName     : required,
            TerminateEnvByForce : optional,
        },
    },

    DeleteApplicationVersion : {
        defaults : {
            Action : 'DeleteApplicationVersion'
        },
        args : {
            Action             : required,
            ApplicationName    : required,
            DeleteSourceBundle : optional,
            VersionLabel       : required,
        },
    },

    DeleteConfigurationTemplate : {
        defaults : {
            Action : 'DeleteConfigurationTemplate'
        },
        args : {
            Action          : required,
            ApplicationName : required,
            TemplateName    : required,
        },
    },

    DeleteEnvironmentConfiguration : {
        defaults : {
            Action : 'DeleteEnvironmentConfiguration'
        },
        args : {
            Action          : required,
            ApplicationName : required,
            EnvironmentName : required,
        },
    },

    DescribeApplicationVersions : {
        defaults : {
            Action : 'DescribeApplicationVersions'
        },
        args : {
            Action          : optional,
            ApplicationName : optional,
            VersionLabels   : optionalArray,
        },
    },

    DescribeApplications : {
        defaults : {
            Action : 'DescribeApplications'
        },
        args : {
            Action           : required,
            ApplicationNames : optionalArray,
        },
    },

    DescribeConfigurationOptions : {
        defaults : {
            Action : 'DescribeConfigurationOptions'
        },
        args : {
            Action            : required,
            ApplicationName   : optional,
            EnvironmentName   : optional,
            Options           : optionalArray,
            SolutionStackName : optional,
            TemplateName      : optional,
        },
    },

    DescribeConfigurationSettings : {
        defaults : {
            Action : 'DescribeConfigurationSettings'
        },
        args : {
            Action          : required,
            ApplicationName : required,
            EnvironmentName : optional,
            TemplateName    : optional,
        },
    },

    DescribeEnvironmentResources : {
        defaults : {
            Action : 'DescribeEnvironmentResources'
        },
        args : {
            Action          : required,
            EnvironmentId   : optional,
            EnvironmentName : optional,
        },
    },

    DescribeEnvironments : {
        defaults : {
            Action : 'DescribeEnvironments'
        },
        args : {
            Action                : required,
            ApplicationName       : optional,
            EnvironmentIds        : optionalArray,
            EnvironmentNames      : optionalArray,
            IncludeDeleted        : optional,
            IncludedDeletedBackTo : optional,
            VersionLabel          : optional,
        },
    },

    DescribeEvents : {
        defaults : {
            Action : 'DescribeEvents'
        },
        args : {
            Action          : required,
            ApplicationName : optional,
            EndTime         : optional,
            EnvironmentId   : optional,
            EnvironmentName : optional,
            MaxRecords      : optional,
            NextToken       : optional,
            RequestId       : optional,
            Severity        : optional,
            StartTime       : optional,
            TemplateName    : optional,
            VersionLabel    : optional,
        },
    },

    ListAvailableSolutionStacks : {
        defaults : {
            Action : 'ListAvailableSolutionStacks'
        },
        args : {
            Action : required,
        },
    },

    RebuildEnvironment : {
        defaults : {
            Action : 'RebuildEnvironment'
        },
        args : {
            Action          : required,
            EnvironmentId   : optional,
            EnvironmentName : optional,
        },
    },

    RequestEnvironmentInfo : {
        defaults : {
            Action : 'RequestEnvironmentInfo'
        },
        args : {
            Action          : required,
            EnvironmentId   : optional,
            EnvironmentName : optional,
            InfoType        : required,
        },
    },

    RestartAppServer : {
        defaults : {
            Action : 'RestartAppServer'
        },
        args : {
            Action          : required,
            EnvironmentId   : optional,
            EnvironmentName : optional,
        },
    },

    RetrieveEnvironmentInfo : {
        defaults : {
            Action : 'RetrieveEnvironmentInfo'
        },
        args : {
            Action          : required,
            EnvironmentId   : optional,
            EnvironmentName : optional,
            InfoType        : required,
        },
    },

    SwapEnvironmentCNAMEs : {
        defaults : {
            Action : 'SwapEnvironmentCNAMEs'
        },
        args : {
            Action                     : required,
            DestinationEnvironmentId   : optional,
            DestinationEnvironmentName : optional,
            SourceEnvironmentId        : optional,
            SourceEnvironmentName      : optional,
        },
    },

    TerminateEnvironment : {
        defaults : {
            Action : 'TerminateEnvironment'
        },
        args : {
            Action             : required,
            EnvironmentId      : optional,
            EnvironmentName    : optional,
            TerminateResources : optional,
        },
    },

    UpdateApplication : {
        defaults : {
            Action : 'UpdateApplication'
        },
        args : {
            Action          : required,
            ApplicationName : required,
            Description     : optional,
        },
    },

    UpdateApplicationVersion : {
        defaults : {
            Action : 'UpdateApplicationVersion'
        },
        args : {
            Action          : required,
            ApplicationName : required,
            Description     : optional,
            VersionLabel    : required,
        },
    },

    UpdateConfigurationTemplate : {
        defaults : {
            Action : 'UpdateConfigurationTemplate'
        },
        args : {
            Action          : required,
            Description     : optional,
            EnvironmentId   : optional,
            EnvironmentName : optional,
            OptionSettings  : optionalArray,
            OptionsToRemove : optionalArray,
            TemplateName    : optional,
            VersionLabel    : optional,
        },
    },

    UpdateEnvironment : {
        defaults : {
            Action : 'UpdateEnvironment'
        },
        args : {
            Action          : required,
            Description     : optional,
            EnvironmentId   : optional,
            EnvironmentName : optional,
            OptionSettings  : optionalArray,
            OptionsToRemove : optionalArray,
            TemplateName    : optional,
            VersionLabel    : optional,
        },
    },

    ValidateConfigurationSettings : {
        defaults : {
            Action : 'ValidateConfigurationSettings'
        },
        args : {
            Action          : required,
            ApplicationName : required,
            EnvironmentName : optional,
            OptionSettings  : requiredArray,
            TemplateName    : optional,
        },
    },

};

// --------------------------------------------------------------------------------------------------------------------

