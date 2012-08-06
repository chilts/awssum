// --------------------------------------------------------------------------------------------------------------------
//
// storagegateway-config.js - config for AWS Storage Gateway
//
// Copyright (c) 2011, 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

var _ = require('underscore');

function bodyJson(options, args) {
    var self = this;
    var data = _.extend({}, args);
    delete data.Target;
    return JSON.stringify(data);
}

// From: http://docs.amazonwebservices.com/storagegateway/latest/userguide/AWSStorageGatewayAPIOperations.html
//
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_ActivateGateway.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_AddWorkingStorage.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_CreateSnapshot.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_CreateStorediSCSIVolume.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_DeleteBandwidthRateLimit.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_DeleteChapCredentials.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_DeleteGateway.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_DeleteVolume.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_DescribeBandwidthRateLimit.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_DescribeChapCredentials.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_DescribeGatewayInformation.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_DescribeMaintenanceStartTime.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_DescribeSnapshotSchedule.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_DescribeStorediSCSIVolumes.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_DescribeWorkingStorage.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_ListGateways.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_ListLocalDisks.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_ListVolumes.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_ShutdownGateway.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_StartGateway.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_UpdateBandwidthRateLimit.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_UpdateChapCredentials.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_UpdateGatewayInformation.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_UpdateGatewaySoftwareNow.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_UpdateMaintenanceStartTime.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_UpdateSnapshotSchedule.html

var target        = { required : true,  type : 'special' };
var requiredJson  = { required : true,  type : 'json'  };
var optionalJson  = { required : false, type : 'json'  };

module.exports = {

    ActivateGateway : {
        defaults : {
            Target : 'ActivateGateway',
        },
        args : {
            Target          : target,
            ActivationKey   : requiredJson,
            GatewayName     : requiredJson,
            GatewayRegion   : requiredJson,
            GatewayTimezone : requiredJson,
        },
        body : bodyJson,
    },

    AddWorkingStorage : {
        defaults : {
            Target : 'AddWorkingStorage',
        },
        args : {
            Target     : target,
            DiskIds    : requiredJson,
            GatewayARN : requiredJson,
        },
        body : bodyJson,
    },

    CreateSnapshot : {
        defaults : {
            Target : 'CreateSnapshot',
        },
        args : {
            Target              : target,
            SnapshotDescription : requiredJson,
            VolumeARN           : requiredJson,
        },
        body : bodyJson,
    },

    CreateStorediSCSIVolume : {
        defaults : {
            Target : 'CreateStorediSCSIVolume',
        },
        args : {
            Target               : target,
            DiskId               : requiredJson,
            GatewayARN           : requiredJson,
            NetworkInterfaceId   : requiredJson,
            PreserveExistingData : requiredJson,
            SnapshotId           : optionalJson,
            TargetName           : requiredJson,
        },
        body : bodyJson,
    },

    DeleteBandwidthRateLimit : {
        defaults : {
            Target : 'DeleteBandwidthRateLimit',
        },
        args : {
            Target        : target,
            BandwidthType : requiredJson,
            GatewayARN    : requiredJson,
        },
        body : bodyJson,
    },

    DeleteChapCredentials : {
        defaults : {
            Target : 'DeleteChapCredentials',
        },
        args : {
            Target        : target,
            InitiatorName : requiredJson,
            TargetARN     : requiredJson,
        },
        body : bodyJson,
    },

    DeleteGateway : {
        defaults : {
            Target : 'DeleteGateway',
        },
        args : {
            Target     : target,
            GatewayARN : requiredJson,
        },
        body : bodyJson,
    },

    DeleteVolume : {
        defaults : {
            Target : 'DeleteVolume',
        },
        args : {
            Target    : target,
            VolumeARN : requiredJson,
        },
        body : bodyJson,
    },

    DescribeBandwidthRateLimit : {
        defaults : {
            Target : 'DescribeBandwidthRateLimit',
        },
        args : {
            Target     : target,
            GatewayARN : requiredJson,
        },
        body : bodyJson,
    },

    DescribeChapCredentials : {
        defaults : {
            Target : 'DescribeChapCredentials',
        },
        args : {
            Target    : target,
            TargetARN : requiredJson,
        },
        body : bodyJson,
    },

    DescribeGatewayInformation : {
        defaults : {
            Target : 'DescribeGatewayInformation',
        },
        args : {
            Target     : target,
            GatewayARN : requiredJson,
        },
        body : bodyJson,
    },

    DescribeMaintenanceStartTime : {
        defaults : {
            Target : 'DescribeMaintenanceStartTime',
        },
        args : {
            Target     : target,
            GatewayARN : requiredJson,
        },
        body : bodyJson,
    },

    DescribeSnapshotSchedule : {
        defaults : {
            Target : 'DescribeSnapshotSchedule',
        },
        args : {
            Target    : target,
            VolumeARN : requiredJson,
        },
        body : bodyJson,
    },

    DescribeStorediSCSIVolumes : {
        defaults : {
            Target : 'DescribeStorediSCSIVolumes',
        },
        args : {
            Target     : target,
            VolumeARNs : requiredJson,
        },
        body : bodyJson,
    },

    DescribeWorkingStorage : {
        defaults : {
            Target : 'DescribeWorkingStorage',
        },
        args : {
            Target     : target,
            GatewayARN : requiredJson,
        },
        body : bodyJson,
    },

    ListGateways : {
        defaults : {
            Target : 'ListGateways',
        },
        args : {
            Target : target,
            Limit  : optionalJson,
            Marker : optionalJson,
        },
        body : bodyJson,
    },

    ListLocalDisks : {
        defaults : {
            Target : 'ListLocalDisks',
        },
        args : {
            Target     : target,
            GatewayARN : requiredJson,
        },
        body : bodyJson,
    },

    ListVolumes : {
        defaults : {
            Target : 'ListVolumes',
        },
        args : {
            Target     : target,
            GatewayARN : requiredJson,
            Limit      : optionalJson,
            Marker     : optionalJson,
        },
        body : bodyJson,
    },

    ShutdownGateway : {
        defaults : {
            Target : 'ShutdownGateway',
        },
        args : {
            Target     : target,
            GatewayARN : requiredJson,
        },
        body : bodyJson,
    },

    StartGateway : {
        defaults : {
            Target : 'StartGateway',
        },
        args : {
            Target     : target,
            GatewayARN : requiredJson,
        },
        body : bodyJson,
    },

    UpdateBandwidthRateLimit : {
        defaults : {
            Target : 'UpdateBandwidthRateLimit',
        },
        args : {
            Target                               : target,
            AverageDownloadRateLimitInBitsPerSec : requiredJson,
            AverageUploadRateLimitInBitsPerSec   : requiredJson,
            GatewayARN                           : requiredJson,
        },
        body : bodyJson,
    },

    UpdateChapCredentials : {
        defaults : {
            Target : 'UpdateChapCredentials',
        },
        args : {
            Target                        : target,
            InitiatorName                 : requiredJson,
            SecretToAuthenticateInitiator : requiredJson,
            SecretToAuthenticateTarget    : optionalJson,
            TargetARN                     : requiredJson,
        },
        body : bodyJson,
    },

    UpdateGatewayInformation : {
        defaults : {
            Target : 'UpdateGatewayInformation',
        },
        args : {
            Target          : target,
            GatewayARN      : requiredJson,
            GatewayName     : optionalJson,
            GatewayTimezone : requiredJson,
        },
        body : bodyJson,
    },

    UpdateGatewaySoftwareNow : {
        defaults : {
            Target : 'UpdateGatewaySoftwareNow',
        },
        args : {
            Target     : target,
            GatewayARN : requiredJson,
        },
        body : bodyJson,
    },

    UpdateMaintenanceStartTime : {
        defaults : {
            Target : 'UpdateMaintenanceStartTime',
        },
        args : {
            Target       : target,
            GatewayARN   : requiredJson,
            HourOfDay    : requiredJson,
            MinuteOfHour : requiredJson,
            DayOfWeek    : requiredJson,
        },
        body : bodyJson,
    },

    UpdateSnapshotSchedule : {
        defaults : {
            Target : 'UpdateSnapshotSchedule',
        },
        args : {
            Target            : target,
            Description       : optionalJson,
            RecurrenceInHours : requiredJson,
            StartAt           : requiredJson,
            VolumeARN         : requiredJson,
        },
        body : bodyJson,
    },

};

// --------------------------------------------------------------------------------------------------------------------
