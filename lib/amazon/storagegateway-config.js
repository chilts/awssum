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
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_DataTypes.html
// * http://docs.amazonwebservices.com/storagegateway/latest/userguide/API_DataTypesEnums.html

var target        = { required : true,  type : 'special' };
var requiredJson  = { required : true,  type : 'json'  };
var optionalJson  = { required : false, type : 'json'  };

module.exports = {

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

};

// --------------------------------------------------------------------------------------------------------------------
