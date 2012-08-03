// --------------------------------------------------------------------------------------------------------------------
//
// ec2-config.js - class for AWS Elastic Compute Cloud
//
// Copyright (c) 2011, 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// From: http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/query-apis.html
//
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-AllocateAddress.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-AssignPrivateIpAddresses.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-AssociateAddress.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-AssociateDhcpOptions.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-AssociateRouteTable.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-AttachInternetGateway.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-AttachNetworkInterface.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-AttachVolume.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-AttachVpnGateway.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-AuthorizeSecurityGroupEgress.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-AuthorizeSecurityGroupIngress.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-BundleInstance.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CancelBundleTask.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CancelConversionTask.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CancelExportTask.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CancelSpotInstanceRequests.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ConfirmProductInstance.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateCustomerGateway.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateDhcpOptions.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateImage.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateInstanceExportTask.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateInternetGateway.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateKeyPair.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateNetworkAcl.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateNetworkAclEntry.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateNetworkInterface.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreatePlacementGroup.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateRoute.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateRouteTable.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateSecurityGroup.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateSnapshot.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateSpotDatafeedSubscription.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateSubnet.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateTags.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateVolume.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateVpc.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateVpnConnection.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-CreateVpnGateway.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteCustomerGateway.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteDhcpOptions.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteInternetGateway.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteKeyPair.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteNetworkAcl.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteNetworkAclEntry.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteNetworkInterface.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeletePlacementGroup.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteRoute.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteRouteTable.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteSecurityGroup.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteSnapshot.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteSpotDatafeedSubscription.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteSubnet.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteTags.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteVolume.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteVpc.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteVpnConnection.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteVpnGateway.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DeregisterImage.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeAddresses.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeAvailabilityZones.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeBundleTasks.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeConversionTasks.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeCustomerGateways.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeDhcpOptions.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeExportTasks.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeImageAttribute.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeImages.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeInstanceAttribute.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeInstances.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeInstanceStatus.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeInternetGateways.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeKeyPairs.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeNetworkAcls.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeNetworkInterfaceAttribute.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeNetworkInterfaces.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribePlacementGroups.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeRegions.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeReservedInstances.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeReservedInstancesOfferings.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeRouteTables.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeSecurityGroups.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeSnapshotAttribute.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeSnapshots.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeSpotDatafeedSubscription.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeSpotInstanceRequests.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeSpotPriceHistory.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeSubnets.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeTags.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeVolumes.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeVolumeAttribute.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeVolumeStatus.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeVpcs.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeVpnConnections.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeVpnGateways.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DetachInternetGateway.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DetachNetworkInterface.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DetachVolume.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DetachVpnGateway.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DisassociateAddress.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-DisassociateRouteTable.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-EnableVolumeIO.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-GetConsoleOutput.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-GetPasswordData.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ImportInstance.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ImportKeyPair.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ImportVolume.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ModifyImageAttribute.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ModifyInstanceAttribute.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ModifyNetworkInterfaceAttribute.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ModifySnapshotAttribute.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ModifyVolumeAttribute.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-MonitorInstances.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-PurchaseReservedInstancesOffering.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-RebootInstances.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-RegisterImage.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ReleaseAddress.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ReplaceNetworkAclAssociation.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ReplaceNetworkAclEntry.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ReplaceRoute.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ReplaceRouteTableAssociation.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ReportInstanceStatus.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-RequestSpotInstances.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ResetImageAttribute.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ResetInstanceAttribute.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ResetNetworkInterfaceAttribute.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-ResetSnapshotAttribute.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-RevokeSecurityGroupEgress.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-RevokeSecurityGroupIngress.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-RunInstances.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-StartInstances.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-StopInstances.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-TerminateInstances.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-UnassignPrivateIpAddresses.html
// * http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-UnmonitorInstances.html

var required      = { required : true,  type : 'param'       };
var optional      = { required : false, type : 'param'       };
var requiredArray = { required : true,  type : 'param-array' };
var optionalArray = { required : false, type : 'param-array' };
var requiredData  = { required : true,  type : 'param-data'  };
var optionalData  = { required : false, type : 'param-data'  };

module.exports = {

    AllocateAddress : {
        defaults : {
            Action : 'AllocateAddress'
        },
        args : {
            Action : required,
            Domain : optional,
        },
    },

    AssignPrivateIpAddresses : {
        defaults : {
            Action : 'AssignPrivateIpAddresses',
        },
        args : {
            Action                         : required,
            NetworkInterfaceId             : required,
            PrivateIpAddress               : optionalArray,
            SecondaryPrivateIpAddressCount : optional,
            AllowReassignment              : optional,
        },
    },

    AssociateAddress : {
        defaults : {
            Action : 'AssociateAddress',
        },
        args : {
            Action             : required,
            PublicIp           : optional,
            InstanceId         : optional,
            AllocationId       : optional,
            NetworkInterfaceId : optional,
            PrivateIpAddress   : optional,
            AllowReassociation : optional,
        },
    },

    AssociateDhcpOptions : {
        defaults : {
            Action : 'AssociateDhcpOptions',
        },
        args : {
            Action        : required,
            DhcpOptionsId : required,
            VpcId         : required,
        },
    },

    AssociateRouteTable : {
        defaults : {
            Action : 'AssociateRouteTable',
        },
        args : {
            Action       : required,
            RouteTableId : required,
            SubnetId     : required
        },
    },

    AttachInternetGateway : {
        defaults : {
            Action : 'AttachInternetGateway',
        },
        args : {
            Action            : required,
            InternetGatewayId : required,
            VpcId             : required,
        },
    },

    AttachNetworkInterface : {
        defaults : {
            Action : 'AttachNetworkInterface',
        },
        args : {
            Action             : required,
            NetworkInterfaceId : required,
            InstanceId         : required,
            DeviceIndex        : required,
        },
    },

    AttachVolume : {
        defaults : {
            Action : 'AttachVolume',
        },
        args : {
            Action     : required,
            VolumeId   : required,
            InstanceId : required,
            Device     : required,
        },
    },

    AttachVpnGateway : {
        defaults : {
            Action : 'AttachVpnGateway',
        },
        args : {
            Action       : required,
            VpnGatewayId : required,
            VpcId        : required,
        },
    },

    AuthorizeSecurityGroupEgress : {
        defaults : {
            Action : 'AuthorizeSecurityGroupEgress',
        },
        args : {
            Action        : required,
            GroupId       : required,
            IpPermissions : requiredData,
        },
    },

    AuthorizeSecurityGroupIngress : {
        defaults : {
            Action : 'AuthorizeSecurityGroupIngress',
        },
        args : {
            Action        : required,
            UserId        : optional,
            GroupId       : optional,
            GroupName     : optional,
            IpPermissions : requiredData,
        },
    },

    BundleInstance : {
        defaults : {
            Action : 'BundleInstance',
        },
        args : {
            Action     : required,
            InstanceId : required,
            Storage    : required,
        },
    },

    CancelBundleTask : {
        defaults : {
            Action : 'CancelBundleTask',
        },
        args : {
            Action   : required,
            BundleId : required,
        },
    },

    CancelConversionTask : {
        defaults : {
            Action : 'CancelConversionTask',
        },
        args : {
            Action           : required,
            ConversionTaskId : required,
        },
    },

    CancelExportTask : {
        defaults : {
            Action : 'CancelExportTask',
        },
        args : {
            Action       : required,
            ExportTaskId : required,
        },
    },

    CancelSpotInstanceRequests : {
        defaults : {
            Action : 'CancelSpotInstanceRequests',
        },
        args : {
            Action                : required,
            SpotInstanceRequestId : requiredArray,
        },
    },

    ConfirmProductInstance : {
        defaults : {
            Action : 'ConfirmProductInstance',
        },
        args : {
            Action      : required,
            ProductCode : required,
            InstanceId  : required,
        },
    },

    CreateCustomerGateway : {
        defaults : {
            Action : 'CreateCustomerGateway',
        },
        args : {
            Action    : required,
            Type      : required,
            IpAddress : required,
            BgpAsn    : required,
        },
    },

    CreateDhcpOptions : {
        defaults : {
            Action : 'CreateDhcpOptions',
        },
        args : {
            Action            : required,
            DhcpConfiguration : requiredData,
        },
    },

    CreateImage : {
        defaults : {
            Action : 'CreateImage',
        },
        args : {
            Action      : required,
            InstanceId  : required,
            Name        : required,
            Description : optional,
            NoReboot    : optional,
        },
    },

    CreateInstanceExportTask : {
        defaults : {
            Action : 'CreateInstanceExportTask',
        },
        args : {
            Action            : required,
            Description       : optional,
            InstanceId        : required,
            TargetEnvironment : required,
            ExportToS3        : required,
        },
    },

    CreateInternetGateway : {
        defaults : {
            Action : 'CreateInternetGateway',
        },
        args : {
            Action : required,
        },
    },

    CreateKeyPair : {
        defaults : {
            Action : 'CreateKeyPair',
        },
        args : {
            Action  : required,
            KeyName : required,
        },
    },

    CreateNetworkAcl : {
        defaults : {
            Action : 'CreateNetworkAcl',
        },
        args : {
            Action : required,
            VpcId  : required,
        },
    },

    CreateNetworkAclEntry : {
        defaults : {
            Action : 'CreateNetworkAclEntry',
        },
        args : {
            Action       : required,
            NetworkAclId : required,
            RuleNumber   : required,
            Protocol     : required,
            RuleAction   : required,
            Egress       : optional,
            CidrBlock    : required,
            Icmp         : optionalData,
            PortRange    : optionalData,
        },
    },

    CreateNetworkInterface : {
        defaults : {
            Action : 'CreateNetworkInterface',
        },
        args : {
            Action                         : required,
            SubnetId                       : required,
            PrivateIpAddress               : optional,
            PrivateIpAddresses             : optional,
            SecondaryPrivateIpAddressCount : optional,
            Description                    : optional,
            SecurityGroupId                : optional,
        },
    },

    CreatePlacementGroup : {
        defaults : {
            Action : 'CreatePlacementGroup',
        },
        args : {
            Action    : required,
            GroupName : required,
            Strategy  : required,
        },
    },

    CreateRoute : {
        defaults : {
            Action : 'CreateRoute',
        },
        args : {
            Action               : required,
            RouteTableId         : required,
            DestinationCidrBlock : required,
            GatewayId            : optional,
            InstanceId           : optional,
            NetworkInterfaceId   : optional,
        },
    },

    CreateRouteTable : {
        defaults : {
            Action : 'CreateRouteTable',
        },
        args : {
            Action : required,
            VpcId  : required,
        },
    },

    CreateSecurityGroup : {
        defaults : {
            Action : 'CreateSecurityGroup',
        },
        args : {
            Action           : required,
            GroupName        : required,
            GroupDescription : required,
            VpcId            : optional,
        },
    },

    CreateSnapshot : {
        defaults : {
            Action : 'CreateSnapshot',
        },
        args : {
            Action      : required,
            VolumeId    : required,
            Description : optional,
        },
    },

    CreateSpotDatafeedSubscription : {
        defaults : {
            Action : 'CreateSpotDatafeedSubscription',
        },
        args : {
            Action : required,
            Bucket : required,
            Prefix : optional,
        },
    },

    CreateSubnet : {
        defaults : {
            Action : 'CreateSubnet',
        },
        args : {
            Action           : required,
            VpcId            : required,
            CidrBlock        : required,
            AvailabilityZone : optional,
        },
    },

    CreateTags : {
        defaults : {
            Action : 'CreateTags',
        },
        args : {
            Action     : required,
            ResourceId : requiredArray,
            Tag        : { required : true, type : 'param-data', setName: 'Tag' },
        },
    },

    CreateVolume : {
        defaults : {
            Action : 'CreateVolume',
        },
        args : {
            Action           : required,
            Size             : optional,
            SnapshotId       : optional,
            AvailabilityZone : required,
        },
    },

    CreateVpc : {
        defaults : {
            Action : 'CreateVpc',
        },
        args : {
            Action          : required,
            CidrBlock       : required,
            InstanceTenancy : { required : false, type : 'param', name : 'instanceTenancy' },
        },
    },

    CreateVpnConnection : {
        defaults : {
            Action : 'CreateVpnConnection',
        },
        args : {
            Action            : required,
            Type              : required,
            CustomerGatewayId : required,
            VpnGatewayId      : required,
            AvailabilityZone  : optional,
        },
    },

    CreateVpnGateway : {
        defaults : {
            Action : 'CreateVpnGateway',
        },
        args : {
            Action : required,
            Type   : required,
            // AvailabilityZone - deprecated, the API ignores it anyway
        },
    },

    DeleteCustomerGateway : {
        defaults : {
            Action : 'DeleteCustomerGateway',
        },
        args : {
            Action            : required,
            CustomerGatewayId : required,
        },
    },

    DeleteDhcpOptions : {
        defaults : {
            Action : 'DeleteDhcpOptions',
        },
        args : {
            Action        : required,
            DhcpOptionsId : required,
        },
    },

    DeleteInternetGateway : {
        defaults : {
            Action : 'DeleteInternetGateway',
        },
        args : {
            Action            : required,
            InternetGatewayId : required,
        },
    },

    DeleteKeyPair : {
        defaults : {
            Action : 'DeleteKeyPair',
        },
        args : {
            Action  : required,
            KeyName : required,
        },
    },

    DeleteNetworkAcl : {
        defaults : {
            Action : 'DeleteNetworkAcl',
        },
        args : {
            Action       : required,
            NetworkAclId : required,
        },
    },

    DeleteNetworkAclEntry : {
        defaults : {
            Action : 'DeleteNetworkAclEntry',
        },
        args : {
            Action       : required,
            NetworkAclId : required,
            RuleNumber   : required,
            Egress       : optional,
        },
    },

    DeleteNetworkInterface : {
        defaults : {
            Action : 'DeleteNetworkInterface',
        },
        args : {
            Action             : required,
            NetworkInterfaceId : required,
        },
    },

    DeletePlacementGroup : {
        defaults : {
            Action : 'DeletePlacementGroup',
        },
        args : {
            Action    : required,
            GroupName : required,
        },
    },

    DeleteRoute : {
        defaults : {
            Action : 'DeleteRoute',
        },
        args : {
            Action               : required,
            RouteTableId         : required,
            DestinationCidrBlock : required,
        },
    },

    DeleteRouteTable : {
        defaults : {
            Action : 'DeleteRouteTable',
        },
        args : {
            Action       : required,
            RouteTableId : required,
        },
    },

    DeleteSecurityGroup : {
        defaults : {
            Action : 'DeleteSecurityGroup',
        },
        args : {
            Action    : required,
            GroupName : required,
            GroupId   : required,
        },
    },

    DeleteSnapshot : {
        defaults : {
            Action : 'DeleteSnapshot',
        },
        args : {
            Action     : required,
            SnapshotId : required,
        },
    },

    DeleteSpotDatafeedSubscription : {
        defaults : {
            Action : 'DeleteSpotDatafeedSubscription',
        },
        args : {
            Action : required,
        },
    },

    DeleteSubnet : {
        defaults : {
            Action : 'DeleteSubnet',
        },
        args : {
            Action   : required,
            SubnetId : required,
        },
    },

    DeleteTags : {
        defaults : {
            Action : 'DeleteTags',
        },
        args : {
            Action     : required,
            ResourceId : requiredArray,
            Tag        : requiredData,
        },
    },

    DeleteVolume : {
        defaults : {
            Action : 'DeleteVolume',
        },
        args : {
            Action   : required,
            VolumeId : required,
        },
    },

    DeleteVpc : {
        defaults : {
            Action : 'DeleteVpc',
        },
        args : {
            Action : required,
            VpcId  : required,
        },
    },

    DeleteVpnConnection : {
        defaults : {
            Action : 'DeleteVpnConnection',
        },
        args : {
            Action          : required,
            VpnConnectionId : required,
        },
    },

    DeleteVpnGateway : {
        defaults : {
            Action : 'DeleteVpnGateway',
        },
        args : {
            Action       : required,
            VpnGatewayId : required,
        },
    },

    DeregisterImage : {
        defaults : {
            Action : 'DeregisterImage',
        },
        args : {
            Action  : required,
            ImageId : required,
        },
    },

    DescribeAddresses : {
        defaults : {
            Action : 'DescribeAddresses',
        },
        args : {
            Action       : required,
            PublicIp     : optionalArray,
            AllocationId : optionalArray,
            Filter       : optionalData,
        },
    },

    DescribeAvailabilityZones : {
        defaults : {
            Action : 'DescribeAvailabilityZones',
        },
        args : {
            Action   : required,
            ZoneName : optionalArray,
            Filter   : optionalData,
        },
    },

    DescribeBundleTasks : {
        defaults : {
            Action : 'DescribeBundleTasks',
        },
        args : {
            Action   : required,
            BundleId : optionalArray,
            Filter   : optionalData,
        },
    },

    DescribeConversionTasks : {
        defaults : {
            Action : 'DescribeConversionTasks',
        },
        args : {
            Action           : required,
            ConversionTaskId : optionalArray,
        },
    },

    DescribeCustomerGateways : {
        defaults : {
            Action : 'DescribeCustomerGateways',
        },
        args : {
            Action            : required,
            CustomerGatewayId : optionalArray,
            Filter            : optionalData,
        },
    },

    DescribeDhcpOptions : {
        defaults : {
            Action : 'DescribeDhcpOptions',
        },
        args : {
            Action        : required,
            DhcpOptionsId : optionalArray,
            Filter        : optionalData,
        },
    },

    DescribeExportTasks : {
        defaults : {
            Action : 'DescribeExportTasks',
        },
        args : {
            Action       : required,
            ExportTaskId : optionalArray,
        },
    },

    DescribeImageAttribute : {
        defaults : {
            Action : 'DescribeImageAttribute',
        },
        args : {
            Action    : required,
            ImageId   : required,
            Attribute : required,
        },
    },

    DescribeImages : {
        defaults : {
            Action : 'DescribeImages',
        },
        args : {
            Action       : required,
            ExecutableBy : optionalArray,
            ImageId      : optionalArray,
            Owner        : optionalArray,
            Filter       : optionalData,
        },
    },

    DescribeInstanceAttribute : {
        defaults : {
            Action : 'DescribeInstanceAttribute',
        },
        args : {
            Action     : required,
            InstanceId : required,
            Attribute  : required,
        },
    },

    DescribeInstances : {
        defaults : {
            Action : 'DescribeInstances',
        },
        args : {
            Action     : required,
            InstanceId : optionalArray,
            Filter     : optionalData,
        },
    },

    DescribeInstanceStatus : {
        defaults : {
            Action : 'DescribeInstanceStatus',
        },
        args : {
            Action              : required,
            InstanceId          : optional,
            IncludeAllInstances : optional,
            MaxResults          : optional,
            NextToken           : optional,
        },
    },

    DescribeInternetGateways : {
        defaults : {
            Action : 'DescribeInternetGateways',
        },
        args : {
            Action            : required,
            InternetGatewayId : optionalArray,
            Filter            : optionalData,
        },
    },

    DescribeKeyPairs : {
        defaults : {
            Action : 'DescribeKeyPairs',
        },
        args : {
            Action  : required,
            KeyName : optionalArray,
            Filter  : optionalData,
        },
    },

    DescribeNetworkAcls : {
        defaults : {
            Action : 'DescribeNetworkAcls',
        },
        args : {
            Action       : required,
            NetworkAclId : optionalArray,
            Filter       : optionalData,
        },
    },

    DescribeNetworkInterfaceAttribute : {
        defaults : {
            Action : 'DescribeNetworkInterfaceAttribute',
        },
        args : {
            Action             : required,
            NetworkInterfaceId : required,
            Attribute          : required,
        },
    },

    DescribeNetworkInterfaces : {
        defaults : {
            Action : 'DescribeNetworkInterfaces',
        },
        args : {
            Action             : required,
            NetworkInterfaceId : optionalArray,
            Filter             : optionalData,
        },
    },

    DescribePlacementGroups : {
        defaults : {
            Action : 'DescribePlacementGroups',
        },
        args : {
            Action    : required,
            GroupName : optionalArray,
            Filter    : optionalData,
        },
    },

    DescribeRegions : {
        defaults : {
            Action : 'DescribeRegions',
        },
        args : {
            Action     : required,
            RegionName : optionalArray,
            Filter     : optionalData,
        },
    },

    DescribeReservedInstances : {
        defaults : {
            Action : 'DescribeReservedInstances',
        },
        args : {
            Action              : required,
            ReservedInstancesId : optionalArray,
            Filter              : optionalData,
            OfferingType        : { required : false, type : 'param', name : 'offeringType' },
        },
    },

    DescribeReservedInstancesOfferings : {
        defaults : {
            Action : 'DescribeReservedInstancesOfferings',
        },
        args : {
            Action : required,
            ReservedInstancesOfferingId : optionalArray,
            InstanceType                : optional,
            AvailabilityZone            : optional,
            ProductDescription          : optional,
            Filter                      : optionalData,
            InstanceTenancy             : { required : false, type : 'param', name : 'instanceTenancy' },
            OfferingType                : { required : false, type : 'param', name : 'offeringType' },
        },
    },

    DescribeRouteTables : {
        defaults : {
            Action : 'DescribeRouteTables',
        },
        args : {
            Action       : required,
            RouteTableId : optionalArray,
            Filter       : optionalData,
        },
    },

    DescribeSecurityGroups : {
        defaults : {
            Action : 'DescribeSecurityGroups',
        },
        args : {
            Action    : required,
            GroupName : optionalArray,
            GroupId   : optionalArray,
            Filter    : optionalData,
        },
    },

    DescribeSnapshotAttribute : {
        defaults : {
            Action : 'DescribeSnapshotAttribute',
        },
        args : {
            Action     : required,
            SnapshotId : required,
            Attribute  : required,
        },
    },

    DescribeSnapshots : {
        defaults : {
            Action : 'DescribeSnapshots',
        },
        args : {
            Action       : required,
            SnapshotId   : optionalArray,
            Owner        : optionalArray,
            RestorableBy : optionalArray,
            Filter       : optionalData,
        },
    },

    DescribeSpotDatafeedSubscription : {
        defaults : {
            Action : 'DescribeSpotDatafeedSubscription',
        },
        args : {
            Action : required,
        },
    },

    DescribeSpotInstanceRequests : {
        defaults : {
            Action : 'DescribeSpotInstanceRequests',
        },
        args : {
            Action                : required,
            SpotInstanceRequestId : optionalArray,
            Filter                : optionalData,
        },
    },

    DescribeSpotPriceHistory : {
        defaults : {
            Action : 'DescribeSpotPriceHistory',
        },
        args : {
            Action             : required,
            StartTime          : optional,
            EndTime            : optional,
            InstanceType       : optionalArray,
            ProductDescription : optionalArray,
            Filter             : optionalData,
            AvailabilityZone   : optional,
            MaxResults         : optional,
            NextToken          : optional,
        },
    },

    DescribeSubnets : {
        defaults : {
            Action : 'DescribeSubnets',
        },
        args : {
            Action   : required,
            SubnetId : optionalArray,
            Filter   : optionalData,
        },
    },

    DescribeTags : {
        defaults : {
            Action : 'DescribeTags',
        },
        args : {
            Action : required,
            Filter : optionalData,
        },
    },

    DescribeVolumes : {
        defaults : {
            Action : 'DescribeVolumes',
        },
        args : {
            Action   : required,
            VolumeId : optionalArray,
            Filter   : optionalData,
        },
    },

    DescribeVolumeAttribute : {
        defaults : {
            Action : 'DescribeVolumeAttribute',
        },
        args : {
            Action    : required,
            VolumeId  : required,
            Attribute : required,
        },
    },

    DescribeVolumeStatus : {
        defaults : {
            Action : 'DescribeVolumeStatus',
        },
        args : {
            Action     : required,
            VolumeId   : optionalArray,
            Filter     : optionalData,
            MaxResults : optional,
            NextToken  : optional,
        },
    },

    DescribeVpcs : {
        defaults : {
            Action : 'DescribeVpcs',
        },
        args : {
            Action : required,
            VpcId  : optionalArray,
            Filter : optionalData,
        },
    },

    DescribeVpnConnections : {
        defaults : {
            Action : 'DescribeVpnConnections',
        },
        args : {
            Action          : required,
            VpnConnectionId : optionalArray,
            Filter          : optionalData,
        },
    },

    DescribeVpnGateways : {
        defaults : {
            Action : 'DescribeVpnGateways',
        },
        args : {
            Action       : required,
            VpnGatewayId : optionalArray,
            Filter       : optionalData,
        },
    },

    DetachInternetGateway : {
        defaults : {
            Action : 'DetachInternetGateway',
        },
        args : {
            Action            : required,
            InternetGatewayId : required,
            VpcId             : required,
        },
    },

    DetachNetworkInterface : {
        defaults : {
            Action : 'DetachNetworkInterface',
        },
        args : {
            Action       : required,
            AttachmentId : required,
            Force        : optional,
        },
    },

    DetachVolume : {
        defaults : {
            Action : 'DetachVolume',
        },
        args : {
            Action     : required,
            VolumeId   : required,
            InstanceId : optional,
            Device     : optional,
            Force      : optional,
        },
    },

    DetachVpnGateway : {
        defaults : {
            Action : 'DetachVpnGateway',
        },
        args : {
            Action       : required,
            VpnGatewayId : required,
            VpcId        : required,
        },
    },

    DisassociateAddress : {
        defaults : {
            Action : 'DisassociateAddress',
        },
        args : {
            Action        : required,
            PublicIp      : optional,
            AssociationId : optional,
        },
    },

    DisassociateRouteTable : {
        defaults : {
            Action : 'DisassociateRouteTable',
        },
        args : {
            Action        : required,
            AssociationId : required,
        },
    },

    EnableVolumeIO : {
        defaults : {
            Action : 'EnableVolumeIO',
        },
        args : {
            Action   : required,
            VolumeId : required,
        },
    },

    GetConsoleOutput : {
        defaults : {
            Action : 'GetConsoleOutput',
        },
        args : {
            Action     : required,
            InstanceId : required,
        },
    },

    GetPasswordData : {
        defaults : {
            Action : 'GetPasswordData',
        },
        args : {
            Action     : required,
            InstanceId : required,
        },
    },

    ImportInstance : {
        defaults : {
            Action : 'ImportInstance',
        },
        args : {
            Action                            : required,
            Description                       : optional,
            Architecture                      : required,
            SecurityGroup                     : optionalArray,
            UserData                          : optional,
            InstanceType                      : required,
            Placement                         : optionalData,
            Monitoring                        : optionalData,
            SubnetId                          : optional,
            InstanceInitiatedShutdownBehavior : optional,
            PrivateIpAddress                  : optional,
            DiskImage                         : requiredData,
            Platform                          : required,
        },
    },

    ImportKeyPair : {
        defaults : {
            Action : 'ImportKeyPair',
        },
        args : {
            Action            : required,
            KeyName           : required,
            PublicKeyMaterial : required,
        },
    },

    ImportVolume : {
        defaults : {
            Action : 'ImportVolume',
        },
        args : {
            Action           : required,
            AvailabilityZone : required,
            Image            : requiredData,
            Description      : optional,
            Volume           : requiredData,
        },
    },

    ModifyImageAttribute : {
        defaults : {
            Action : 'ModifyImageAttribute',
        },
        args : {
            Action           : required,
            ImageId          : required,
            LaunchPermission : optionalData,
            ProductCode      : optional,
            Description      : optional,
        },
    },

    ModifyInstanceAttribute : {
        defaults : {
            Action : 'ModifyInstanceAttribute',
        },
        args : {
            Action                            : required,
            ImageId                           : required,
            InstanceType                      : optionalData,
            Kernel                            : optionalData,
            Ramdisk                           : optionalData,
            UserData                          : optionalData,
            DisableApiTermination             : optionalData,
            InstanceInitiatedShutdownBehavior : optionalData,
            BlockMappingDevice                : optionalData,
            SourceDestCheck                   : optionalData,
            GroupId                           : optionalArray,
            EbsOptimized                      : optional,
        },
    },

    ModifyNetworkInterfaceAttribute : {
        defaults : {
            Action : 'ModifyNetworkInterfaceAttribute',
        },
        args : {
            Action             : required,
            NetworkInterfaceId : required,
            Description        : optionalData,
            SecurityGroupId    : optionalArray,
            SourceDestCheck    : optionalData,
            Attachment         : optionalData,
        },
    },

    ModifySnapshotAttribute : {
        defaults : {
            Action : 'ModifySnapshotAttribute',
        },
        args : {
            Action                 : required,
            SnapshotId             : required,
            CreateVolumePermission : requiredData,
        },
    },

    ModifyVolumeAttribute : {
        defaults : {
            Action : 'ModifyVolumeAttribute',
        },
        args : {
            Action       : required,
            VolumeId     : required,
            AutoEnableIO : requiredData,
        },
    },

    MonitorInstances : {
        defaults : {
            Action : 'MonitorInstances',
        },
        args : {
            Action     : required,
            InstanceId : requiredArray,
        },
    },

    PurchaseReservedInstancesOffering : {
        defaults : {
            Action : 'PurchaseReservedInstancesOffering',
        },
        args : {
            Action                      : required,
            ReservedInstancesOfferingId : required,
            InstanceCount               : optional,
        },
    },

    RebootInstances : {
        defaults : {
            Action : 'RebootInstances',
        },
        args : {
            Action     : required,
            InstanceId : requiredArray,
        },
    },

    RegisterImage : {
        defaults : {
            Action : 'RegisterImage',
        },
        args : {
            Action             : required,
            ImageLocation      : optional,
            Name               : required,
            Description        : optional,
            Architecture       : optional,
            KernelId           : optional,
            RamdiskId          : optional,
            RootDeviceName     : optional,
            BlockDeviceMapping : optionalData,
        },
    },

    ReleaseAddress : {
        defaults : {
            Action : 'ReleaseAddress',
        },
        args : {
            Action       : required,
            PublicIp     : optional,
            AllocationId : optional,
        },
    },

    ReplaceNetworkAclAssociation : {
        defaults : {
            Action : 'ReplaceNetworkAclAssociation',
        },
        args : {
            Action        : required,
            AssociationId : required,
            NetworkAclId  : required,
        },
    },

    ReplaceNetworkAclEntry : {
        defaults : {
            Action : 'ReplaceNetworkAclEntry',
        },
        args : {
            Action       : required,
            NetworkAclId : required,
            RuleNumber   : required,
            Protocol     : required,
            RuleAction   : required,
            Egress       : optional,
            CidrBlock    : required,
            Icmp         : optionalData,
            PortRange    : optionalData,
        },
    },

    ReplaceRoute : {
        defaults : {
            Action : 'ReplaceRoute',
        },
        args : {
            Action               : required,
            RouteTableId         : required,
            DestinationCidrBlock : required,
            GatewayId            : optional,
            InstanceId           : optional,
            NetworkInterfaceId   : optional,
        },
    },

    ReplaceRouteTableAssociation : {
        defaults : {
            Action : 'ReplaceRouteTableAssociation',
        },
        args : {
            Action        : required,
            AssociationId : required,
            RouteTableId  : required,
        },
    },

    ReportInstanceStatus : {
        defaults : {
            Action : 'ReportInstanceStatus',
        },
        args : {
            Action      : required,
            InstanceID  : requiredArray,
            Status      : required,
            StartTime   : optional,
            EndTime     : optional,
            ReasonCodes : requiredArray,
            Description : optional,
        },
    },

    RequestSpotInstances : {
        defaults : {
            Action : 'RequestSpotInstances',
        },
        args : {
            Action                : required,
            SpotPrice             : required,
            InstanceCount         : optional,
            Type                  : optional,
            ValidFrom             : optional,
            ValidUntil            : optional,
            Subnet                : optional,
            LaunchGroup           : optional,
            AvailabilityZoneGroup : optional,
            Placement             : optionalData,
            LaunchSpecification   : requiredData, // because of LaunchSpecification.{ImageId,InstanceType}
        },
    },

    ResetImageAttribute : {
        defaults : {
            Action : 'ResetImageAttribute',
        },
        args : {
            Action    : required,
            ImageId   : required,
            Attribute : required,
        },
    },

    ResetInstanceAttribute : {
        defaults : {
            Action : 'ResetInstanceAttribute',
        },
        args : {
            Action     : required,
            InstanceId : required,
            Attribute  : required,
        },
    },

    ResetNetworkInterfaceAttribute : {
        defaults : {
            Action : 'ResetNetworkInterfaceAttribute',
        },
        args : {
            Action             : required,
            NetworkInterfaceId : required,
            Attribute          : required,
        },
    },

    ResetSnapshotAttribute : {
        defaults : {
            Action : 'ResetSnapshotAttribute',
        },
        args : {
            Action     : required,
            SnapshotId : required,
            Attribute  : required,
        },
    },

    RevokeSecurityGroupEgress : {
        defaults : {
            Action : 'RevokeSecurityGroupEgress',
        },
        args : {
            Action        : required,
            GroupId       : required,
            IpPermissions : requiredData,
        },
    },

    RevokeSecurityGroupIngress : {
        defaults : {
            Action : 'RevokeSecurityGroupIngress',
        },
        args : {
            Action        : required,
            UserId        : optional,
            GroupId       : optional,
            GroupName     : optional,
            IpPermissions : requiredData,
        },
    },

    RunInstances : {
        defaults : {
            Action : 'RunInstances',
        },
        args : {
            Action                            : required,
            ImageId                           : required,
            MinCount                          : required,
            MaxCount                          : required,
            KeyName                           : optional,
            SecurityGroupId                   : optionalArray,
            SecurityGroup                     : optionalArray,
            UserData                          : optional,
            AddressingType                    : optional,
            InstanceType                      : optional,
            Placement                         : optionalData,
            KernelId                          : optional,
            RamdiskId                         : optional,
            BlockDeviceMapping                : optionalData,
            Monitoring                        : optionalData,
            SubnetId                          : optional,
            DisableApiTermination             : optional,
            InstanceInitiatedShutdownBehavior : optional,
            PrivateIpAddress                  : optional,
            ClientToken                       : optional,
            NetworkInterface                  : optionalData,
            IamInstanceProfile                : optionalData,
            EbsOptimized                      : optional,
        },
    },

    StartInstances : {
        defaults : {
            Action : 'StartInstances',
        },
        args : {
            Action     : required,
            InstanceId : requiredArray,
        },
    },

    StopInstances : {
        defaults : {
            Action : 'StopInstances',
        },
        args : {
            Action     : required,
            InstanceId : requiredArray,
            Force      : optional,
        },
    },

    TerminateInstances : {
        defaults : {
            Action : 'TerminateInstances',
        },
        args : {
            Action     : required,
            InstanceId : requiredArray,
        },
    },

    UnassignPrivateIpAddresses : {
        defaults : {
            Action : 'UnassignPrivateIpAddresses',
        },
        args : {
            Action             : required,
            NetworkInterfaceId : required,
            PrivateIpAddress   : requiredArray,
        },
    },

    UnmonitorInstances : {
        defaults : {
            Action : 'UnmonitorInstances',
        },
        args : {
            Action     : required,
            InstanceId : requiredArray,
        },
    },

};

// --------------------------------------------------------------------------------------------------------------------
