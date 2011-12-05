module.exports = {
    AuthorizeCacheSecurityGroupIngress : {
        required : [ 'CacheSecurityGroupName', 'EC2SecurityGroupName', 'EC2SecurityGroupOwnerId' ],
        optional : [],
        array    : [],
    },
    CreateCacheCluster : {
        required : [ 'CacheClusterId', 'CacheNodeType' , 'Engine', 'NumCacheNodes' ],
        optional : [
            'AutoMinorVersionUpgrade', 'CacheParameterGroupName', 'EngineVersion', 'NotificationTopicArn', 'Port',
            'PreferredAvailabilityZone', 'PreferredMaintenanceWindow'
        ],
        array    : [ 'CacheSecurityGroupNames' ],
    },
    CreateCacheParameterGroup : {
        required : [ 'CacheParameterGroupFamily', 'CacheParameterGroupName', 'Description' ],
        optional : [],
        array    : [],
    },
    CreateCacheSecurityGroup : {
        required : [ 'CacheSecurityGroupName', 'Description' ],
        optional : [],
        array    : [],
    },
    DeleteCacheCluster : {
        required : [ 'CacheClusterId' ],
        optional : [],
        array    : [],
    },
    DeleteCacheParameterGroup : {
        required : [ 'CacheParameterGroupName' ],
        optional : [],
        array    : [],
    },
    DeleteCacheSecurityGroup : {
        required : [ 'CacheSecurityGroupName' ],
        optional : [],
        array    : [],
    },
    DescribeCacheClusters : {
        required : [],
        optional : [ 'CacheClusterId', 'Marker', 'MaxRecords', 'ShowCacheNodeInfo' ],
        array    : [],
    },
    DescribeCacheParameterGroups : {
        required : [],
        optional : [ 'CacheParameterGroupName', 'Marker', 'MaxRecords' ],
        array    : [],
    },
    DescribeCacheParameters : {
        required : [ 'CacheParameterGroupName', ],
        optional : [ 'Marker', 'MaxRecords', 'Source' ],
        array    : [],
    },
    DescribeCacheSecurityGroups : {
        required : [],
        optional : [ 'CacheSecurityGroupName', 'Marker', 'MaxRecords' ],
        array    : [],
    },
    DescribeEngineDefaultParameters : {
        required : [ 'CacheParameterGroupFamily' ],
        optional : [ 'Marker', 'MaxRecords' ],
        array    : [],
    },
    DescribeEvents : {
        required : [ 'Duration', 'EndTime', 'Marker', 'MaxRecords', 'SourceIdentifier', 'SourceType', 'StartTime' ],
        optional : [],
        array    : [],
    },
    ModifyCacheCluster : {
        required : [ 'CacheClusterId' ],
        optional : [
            'ApplyImmediately', 'AutoMinorVersionUpgrade', 'CacheParameterGroupName',
            'CacheParameterGroupName', 'EngineVersion', 'NotificationTopicArn', 'NotificationTopicStatus',
            'NumCacheNodes', 'PreferredMaintenanceWindow'
        ],
        array    : [ 'CacheNodeIdsToRemove', 'CacheSecurityGroupNames' ],
    },
    ModifyCacheParameterGroup : {
        required : [ 'CacheParameterGroupName' ],
        optional : [],
        array    : [ 'ParameterNameValues' ],
    },
    RebootCacheCluster : {
        required : [ 'CacheClusterId' ],
        optional : [],
        array    : [ 'CacheNodeIdsToReboot' ],
    },
    ResetCacheParameterGroup : {
        required : [ 'CacheParameterGroupName' ],
        optional : [ 'ResetAllParameters' ],
        array    : [ 'ParameterNameValues' ],
    },
    RevokeCacheSecurityGroupIngress : {
        required : [ 'CacheSecurityGroupName', 'EC2SecurityGroupName', 'EC2SecurityGroupOwnerId' ],
        optional : [],
        array    : [],
    },
};
