// --------------------------------------------------------------------------------------------------------------------
//
// rds-config.js - class for AWS Relational Database Service
//
// Copyright (c) 2011, 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// From: http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_Operations.html
//
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_AuthorizeDBSecurityGroupIngress.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_CopyDBSnapshot.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_CreateDBInstance.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_CreateDBInstanceReadReplica.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_CreateDBParameterGroup.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_CreateDBSecurityGroup.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_CreateDBSnapshot.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_CreateDBSubnetGroup.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_CreateOptionGroup.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DeleteDBInstance.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DeleteDBParameterGroup.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DeleteDBSecurityGroup.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DeleteDBSnapshot.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DeleteDBSubnetGroup.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DeleteOptionGroup.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DescribeDBEngineVersions.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DescribeDBInstances.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DescribeDBParameterGroups.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DescribeDBParameters.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DescribeDBSecurityGroups.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DescribeDBSnapshots.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DescribeDBSubnetGroups.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DescribeEngineDefaultParameters.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DescribeEvents.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DescribeOptionGroupOptions.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DescribeOptionGroups.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DescribeOrderableDBInstanceOptions.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DescribeReservedDBInstances.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_DescribeReservedDBInstancesOfferings.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_ModifyDBInstance.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_ModifyDBParameterGroup.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_ModifyDBSubnetGroup.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_ModifyOptionGroup.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_PurchaseReservedDBInstancesOffering.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_RebootDBInstance.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_ResetDBParameterGroup.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_RestoreDBInstanceFromDBSnapshot.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_RestoreDBInstanceToPointInTime.html
// * http://docs.amazonwebservices.com/AmazonRDS/latest/APIReference/API_RevokeDBSecurityGroupIngress.html

var required      = { required : true,  type : 'param'       };
var optional      = { required : false, type : 'param'       };
var requiredArray = { required : true,  type : 'param-array', prefix : 'member' };
var optionalArray = { required : false, type : 'param-array', prefix : 'member' };
var requiredData  = { required : false, type : 'param-data',  prefix : 'member' };
var optionalData  = { required : false, type : 'param-data',  prefix : 'member' };
var requiredJson  = { required : true,  type : 'param-json'  };
var optionalJson  = { required : false, type : 'param-json'  };

module.exports = {

    AuthorizeDBSecurityGroupIngress : {
        defaults : {
            Action : 'AuthorizeDBSecurityGroupIngress'
        },
        args : {
            Action                  : required,
            CIDRIP                  : optional,
            DBSecurityGroupName     : required,
            EC2SecurityGroupId      : optional,
            EC2SecurityGroupName    : optional,
            EC2SecurityGroupOwnerId : optional,
        },
    },

    CopyDBSnapshot : {
        defaults : {
            Action : 'CopyDBSnapshot'
        },
        args : {
            Action                     : required,
            SourceDBSnapshotIdentifier : required,
            TargetDBSnapshotIdentifier : required,
        },
    },

    CreateDBInstance : {
        defaults : {
            Action : 'CreateDBInstance'
        },
        args : {
            Action                     : required,
            AllocatedStorage           : required,
            AutoMinorVersionUpgrade    : optional,
            AvailabilityZone           : optional,
            BackupRetentionPeriod      : optional,
            CharacterSetName           : optional,
            DBInstanceClass            : required,
            DBInstanceIdentifier       : required,
            DBName                     : optional,
            DBParameterGroupName       : optional,
            DBSecurityGroups           : requiredArray,
            DBSubnetGroupName          : optional,
            Engine                     : required,
            EngineVersion              : optional,
            LicenseModel               : optional,
            MasterUserPassword         : required,
            MasterUsername             : required,
            MultiAZ                    : optional,
            OptionGroupName            : optional,
            Port                       : optional,
            PreferredBackupWindow      : optional,
            PreferredMaintenanceWindow : optional,
        },
    },

    CreateDBInstanceReadReplica : {
        defaults : {
            Action : 'CreateDBInstanceReadReplica'
        },
        args : {
            Action                     : required,
            AutoMinorVersionUpgrade    : optional,
            AvailabilityZone           : optional,
            DBInstanceClass            : optional,
            DBInstanceIdentifier       : required,
            OptionGroupName            : optional,
            Port                       : optional,
            SourceDBInstanceIdentifier : required,
        },
    },

    CreateDBParameterGroup : {
        defaults : {
            Action : 'CreateDBParameterGroup'
        },
        args : {
            Action                 : required,
            DBParameterGroupFamily : required,
            DBParameterGroupName   : required,
            Description            : required,
        },
    },

    CreateDBSecurityGroup : {
        defaults : {
            Action : 'CreateDBSecurityGroup'
        },
        args : {
            Action                     : required,
            DBSecurityGroupDescription : required,
            DBSecurityGroupName        : required,
            EC2VpcId                   : required,
        },
    },

    CreateDBSnapshot : {
        defaults : {
            Action : 'CreateDBSnapshot'
        },
        args : {
            Action               : required,
            DBInstanceIdentifier : required,
            DBSnapshotIdentifier : required,
        },
    },

    CreateDBSubnetGroup : {
        defaults : {
            Action : 'CreateDBSubnetGroup'
        },
        args : {
            Action                   : required,
            DBSubnetGroupDescription : required,
            DBSubnetGroupName        : required,
            SubnetIds                : requiredArray,
        },
    },

    CreateOptionGroup : {
        defaults : {
            Action : 'CreateOptionGroup'
        },
        args : {
            Action                 : required,
            EngineName             : required,
            MajorEngineVersion     : required,
            OptionGroupDescription : required,
            OptionGroupName        : required,
        },
    },

    DeleteDBInstance : {
        defaults : {
            Action : 'DeleteDBInstance'
        },
        args : {
            Action                    : required,
            DBInstanceIdentifier      : required,
            FinalDBSnapshotIdentifier : optional,
            SkipFinalSnapshot         : optional,
        },
    },

    DeleteDBParameterGroup : {
        defaults : {
            Action : 'DeleteDBParameterGroup'
        },
        args : {
            Action               : required,
            DBParameterGroupName : required,
        },
    },

    DeleteDBSecurityGroup : {
        defaults : {
            Action : 'DeleteDBSecurityGroup'
        },
        args : {
            Action              : required,
            DBSecurityGroupName : required,
        },
    },

    DeleteDBSnapshot : {
        defaults : {
            Action : 'DeleteDBSnapshot'
        },
        args : {
            Action               : required,
            DBSnapshotIdentifier : required,
        },
    },

    DeleteDBSubnetGroup : {
        defaults : {
            Action : 'DeleteDBSubnetGroup'
        },
        args : {
            Action            : required,
            DBSubnetGroupName : required,
        },
    },

    DeleteOptionGroup : {
        defaults : {
            Action : 'DeleteOptionGroup'
        },
        args : {
            Action          : required,
            OptionGroupName : required,
        },
    },

    DescribeDBEngineVersions : {
        defaults : {
            Action : 'DescribeDBEngineVersions'
        },
        args : {
            Action                     : required,
            DBParameterGroupFamily     : optional,
            DefaultOnly                : optional,
            Engine                     : optional,
            EngineVersion              : optional,
            ListSupportedCharacterSets : optional,
            Marker                     : optional,
            MaxRecords                 : optional,
        },
    },

    DescribeDBInstances : {
        defaults : {
            Action : 'DescribeDBInstances'
        },
        args : {
            Action               : required,
            DBInstanceIdentifier : optional,
            Marker               : optional,
            MaxRecords           : optional,
        },
    },

    DescribeDBParameterGroups : {
        defaults : {
            Action : 'DescribeDBParameterGroups'
        },
        args : {
            Action               : required,
            DBParameterGroupName : optional,
            Marker               : optional,
            MaxRecords           : optional,
        },
    },

    DescribeDBParameters : {
        defaults : {
            Action : 'DescribeDBParameters'
        },
        args : {
            Action               : required,
            DBParameterGroupName : required,
            Marker               : optional,
            MaxRecords           : optional,
            Source               : optional,
        },
    },

    DescribeDBSecurityGroups : {
        defaults : {
            Action : 'DescribeDBSecurityGroups'
        },
        args : {
            Action              : required,
            DBSecurityGroupName : optional,
            Marker              : optional,
            MaxRecords          : optional,
        },
    },

    DescribeDBSnapshots : {
        defaults : {
            Action : 'DescribeDBSnapshots'
        },
        args : {
            Action : required,
            DBInstanceIdentifier : optional,
            DBSnapshotIdentifier : optional,
            Marker               : optional,
            MaxRecords           : optional,
            SnapshotType         : optional,
        },
    },

    DescribeDBSubnetGroups : {
        defaults : {
            Action : 'DescribeDBSubnetGroups'
        },
        args : {
            Action            : required,
            DBSubnetGroupName : required,
            Marker            : optional,
            MaxRecords        : optional,
        },
    },

    DescribeEngineDefaultParameters : {
        defaults : {
            Action : 'DescribeEngineDefaultParameters'
        },
        args : {
            Action                 : required,
            DBParameterGroupFamily : required,
            Marker                 : optional,
            MaxRecords             : optional,
        },
    },

    DescribeEvents : {
        defaults : {
            Action : 'DescribeEvents'
        },
        args : {
            Action           : required,
            Duration         : optional,
            EndTime          : optional,
            Marker           : optional,
            MaxRecords       : optional,
            SourceIdentifier : optional,
            SourceType       : optional,
            StartTime        : optional,
        },
    },

    DescribeOptionGroupOptions : {
        defaults : {
            Action : 'DescribeOptionGroupOptions'
        },
        args : {
            Action             : required,
            EngineName         : required,
            MajorEngineVersion : optional,
            Marker             : optional,
            MaxRecords         : optional,
        },
    },

    DescribeOptionGroups : {
        defaults : {
            Action : 'DescribeOptionGroups'
        },
        args : {
            Action : required,
            EngineName         : optional,
            MajorEngineVersion : optional,
            Marker             : optional,
            MaxRecords         : optional,
            OptionGroupName    : optional,
        },
    },

    DescribeOrderableDBInstanceOptions : {
        defaults : {
            Action : 'DescribeOrderableDBInstanceOptions'
        },
        args : {
            Action          : required,
            DBInstanceClass : optional,
            Engine          : required,
            EngineVersion   : optional,
            LicenseModel    : optional,
            Marker          : optional,
            MaxRecords      : optional,
        },
    },

    DescribeReservedDBInstances : {
        defaults : {
            Action : 'DescribeReservedDBInstances'
        },
        args : {
            Action                        : required,
            DBInstanceClass               : optional,
            Duration                      : optional,
            Marker                        : optional,
            MaxRecords                    : optional,
            MultiAZ                       : optional,
            ProductDescription            : optional,
            ReservedDBInstanceId          : optional,
            ReservedDBInstancesOfferingId : optional,
        },
    },

    DescribeReservedDBInstancesOfferings : {
        defaults : {
            Action : 'DescribeReservedDBInstancesOfferings'
        },
        args : {
            Action : required,
            DBInstanceClass               : optional,
            Duration                      : optional,
            Marker                        : optional,
            MaxRecords                    : optional,
            MultiAZ                       : optional,
            OfferingType                  : optional,
            ProductDescription            : optional,
            ReservedDBInstancesOfferingId : optional,
        },
    },

    ModifyDBInstance : {
        defaults : {
            Action : 'ModifyDBInstance'
        },
        args : {
            Action                     : required,
            AllocatedStorage           : optional,
            AllowMajorVersionUpgrade   : optional,
            ApplyImmediately           : optional,
            AutoMinorVersionUpgrade    : optional,
            BackupRetentionPeriod      : optional,
            DBInstanceClass            : optional,
            DBInstanceIdentifier       : required,
            DBParameterGroupName       : optional,
            DBSecurityGroups           : optionalArray,
            Engine                     : required,
            EngineVersion              : optional,
            MasterUserPassword         : required,
            MultiAZ                    : optional,
            OptionGroupName            : optional,
            PreferredBackupWindow      : optional,
            PreferredMaintenanceWindow : optional,
        },
    },

    ModifyDBParameterGroup : {
        defaults : {
            Action : 'ModifyDBParameterGroup'
        },
        args : {
            Action               : required,
            DBParameterGroupName : required,
            Parameters           : requiredArray,
        },
    },

    ModifyDBSubnetGroup : {
        defaults : {
            Action : 'ModifyDBSubnetGroup'
        },
        args : {
            Action                   : required,
            DBSubnetGroupDescription : optional,
            DBSubnetGroupName        : required,
            SubnetIds                : requiredArray,
        },
    },

    ModifyOptionGroup : {
        defaults : {
            Action : 'ModifyOptionGroup'
        },
        args : {
            Action           : required,
            ApplyImmediately : optional,
            OptionGroupName  : required,
            OptionsToInclude : optionalArray,
            OptionsToRemove  : optionalArray,
        },
    },

    PurchaseReservedDBInstancesOffering : {
        defaults : {
            Action : 'PurchaseReservedDBInstancesOffering'
        },
        args : {
            Action                        : required,
            DBInstanceCount               : optional,
            ReservedDBInstanceId          : optional,
            ReservedDBInstancesOfferingId : required,
        },
    },

    RebootDBInstance : {
        defaults : {
            Action : 'RebootDBInstance'
        },
        args : {
            Action               : required,
            DBInstanceIdentifier : required,
            ForceFailover        : optional,
        },
    },

    ResetDBParameterGroup : {
        defaults : {
            Action : 'ResetDBParameterGroup'
        },
        args : {
            Action               : required,
            DBParameterGroupName : required,
            Parameters           : optionalArray,
            ResetAllParameters   : optional,
        },
    },

    RestoreDBInstanceFromDBSnapshot : {
        defaults : {
            Action : 'RestoreDBInstanceFromDBSnapshot'
        },
        args : {
            Action                  : required,
            AutoMinorVersionUpgrade : optional,
            AvailabilityZone        : optional,
            DBInstanceClass         : optional,
            DBInstanceIdentifier    : required,
            DBName                  : optional,
            DBSnapshotIdentifier    : required,
            DBSubnetGroupName       : optional,
            Engine                  : optional,
            LicenseModel            : optional,
            MultiAZ                 : optional,
            OptionGroupName         : optional,
            Port                    : optional,
        },
    },

    RestoreDBInstanceToPointInTime : {
        defaults : {
            Action : 'RestoreDBInstanceToPointInTime'
        },
        args : {
            Action                     : required,
            AutoMinorVersionUpgrade    : optional,
            AvailabilityZone           : optional,
            DBInstanceClass            : optional,
            DBName                     : optional,
            DBSubnetGroupName          : optional,
            Engine                     : optional,
            LicenseModel               : optional,
            MultiAZ                    : optional,
            OptionGroupName            : optional,
            Port                       : optional,
            RestoreTime                : optional,
            SourceDBInstanceIdentifier : required,
            TargetDBInstanceIdentifier : required,
            UseLatestRestorableTime    : optional,
        },
    },

    RevokeDBSecurityGroupIngress : {
        defaults : {
            Action : 'RevokeDBSecurityGroupIngress'
        },
        args : {
            Action                  : required,
            CIDRIP                  : optional,
            DBSecurityGroupName     : required,
            EC2SecurityGroupId      : optional,
            EC2SecurityGroupName    : optional,
            EC2SecurityGroupOwnerId : optional,
        },
    },

};

// --------------------------------------------------------------------------------------------------------------------
