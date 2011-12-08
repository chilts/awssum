// From: http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/Actions_Dist.html
//
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/CreateDistribution.html
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/ListDistributions.html
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/GetDistribution.html
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/GetConfig.html
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/PutConfig.html
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/DeleteDistribution.html

// From: http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/Actions_StreamingDist.html
//
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/CreateStreamingDistribution.html
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/ListStreamingDistributions.html
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/GetStreamingDistribution.html
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/GetStreamingDistConfig.html
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/PutStreamingDistConfig.html
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/DeleteStreamingDistribution.html

// From: http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/Actions_OAI.html
//
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/CreateOAI.html
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/ListOAIs.html
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/GetOAI.html
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/GetOAIConfig.html
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/PutOAIConfig.html
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/DeleteOAI.html

// From: http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/Actions_Invalidations.html
//
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/CreateInvalidation.html
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/ListInvalidation.html
// * http://docs.amazonwebservices.com/AmazonCloudFront/latest/APIReference/GetInvalidation.html

function pathDistribution(args) {
    return '/' + this.version() + '/distribution';
}

function pathDistributionId(args) {
    return '/' + this.version() + '/distribution/' + args.DistributionId;
}

function pathDistributionConfig(args) {
    return '/' + this.version() + '/distribution/' + args.DistributionId + '/config';
}

function pathStreamingDistribution(args) {
    return '/' + this.version() + '/streaming-distribution';
}

function pathStreamingDistributionId(args) {
    return '/' + this.version() + '/streaming-distribution/' + args.DistributionId;
}

function pathStreamingDistributionConfig(args) {
    return '/' + this.version() + '/streaming-distribution/' + args.DistributionId + '/config';
}

module.exports = {

    // Operations on Distributions

    CreateDistribution : {
        method : 'POST',
        path : pathDistribution,
        args : {
            // S3Origin Elements
            DnsName : {
                type : 'special',
                required : false,
            },
            OriginAccessIdentity : {
                type : 'special',
                required : false,
            },
            // CustomOrigin elements
            CustomOriginDnsName : {
                type : 'special',
                required : false,
            },
            CustomOriginHttpPort : {
                type : 'special',
                required : false,
            },
            CustomOriginHttpsPort : {
                type : 'special',
                required : false,
            },
            CustomOriginOriginProtocolPolicy : {
                type : 'special',
                required : false,
            },
            // other top level elements
            CallerReference : {
                type : 'special',
                required : true,
            },
            Cname : {
                type : 'special',
                required : false,
            },
            Comment : {
                type : 'special',
                required : false,
            },
            Enabled : {
                type : 'special',
                required : true,
            },
            DefaultRootObject : {
                type : 'special',
                required : true,
            },
            // Logging Elements
            LoggingBucket : {
                type : 'special',
                required : false,
            },
            LoggingPrefix : {
                type : 'special',
                required : false,
            },
            // TrustedSigners Elements
            TrustedSignersSelf : {
                type : 'special',
                required : false,
            },
            TrustedSignersAwsAccountNumber : {
                type : 'special',
                required : false,
            },
            RequiredProtocols : {
                type : 'special',
                required : false,
            },
        },
    },

    ListDistributions : {
        path : pathDistribution,
        args : {
            Marker : {
                required : false,
                type     : 'param',
            },
            MaxItems : {
                required : false,
                type     : 'param',
            },
        },
    },

    GetDistribution : {
        path : pathDistributionId,
        args : {
            DistributionId : {
                required : true,
                type     : 'special',
            },
        },
    },

    GetDistributionConfig : {
        path : pathDistributionConfig,
        args : {
            DistributionId : {
                required : true,
                type     : 'special',
            },
        },
    },

    PutDistributionConfig : {
        method : 'PUT',
        path : pathDistributionConfig,
        args : {
            DistributionId : {
                required : true,
                type     : 'special',
            },
            IfMatch : {
                required : true,
                type     : 'header'
            },
            // S3Origin Elements
            DnsName : {
                type : 'special',
                required : false,
            },
            OriginAccessIdentity : {
                type : 'special',
                required : false,
            },
            // CustomOrigin elements
            CustomOriginDnsName : {
                type : 'special',
                required : false,
            },
            CustomOriginHttpPort : {
                type : 'special',
                required : false,
            },
            CustomOriginHttpsPort : {
                type : 'special',
                required : false,
            },
            CustomOriginOriginProtocolPolicy : {
                type : 'special',
                required : false,
            },
            // other top level elements
            CallerReference : {
                type : 'special',
                required : true,
            },
            Cname : {
                type : 'special',
                required : false,
            },
            Comment : {
                type : 'special',
                required : false,
            },
            Enabled : {
                type : 'special',
                required : true,
            },
            DefaultRootObject : {
                type : 'special',
                required : true,
            },
            // Logging Elements
            LoggingBucket : {
                type : 'special',
                required : false,
            },
            LoggingPrefix : {
                type : 'special',
                required : false,
            },
            // TrustedSigners Elements
            TrustedSignersSelf : {
                type : 'special',
                required : false,
            },
            TrustedSignersAwsAccountNumber : {
                type : 'special',
                required : false,
            },
            RequiredProtocols : {
                type : 'special',
                required : false,
            },
        },
    },

    DeleteDistribution : {
        method : 'DELETE',
        path : pathDistributionId,
        args : {
            DistributionId : {
                required : true,
                type     : 'special',
            },
            IfMatch : {
                required : true,
                type     : 'header'
            },
        },
        statusCode : 204,
    },

    // Operations on Streaming Distributions

    CreateStreamingDistribution : {
        method : 'POST',
        path : pathStreamingDistribution,
        args : {
            // S3Origin Elements
            S3OriginDnsName : {
                type : 'special',
                required : false,
            },
            S3OriginOriginAccessIdentity : {
                type : 'special',
                required : false,
            },
            // other top level elements
            CallerReference : {
                type : 'special',
                required : true,
            },
            Cname : {
                type : 'special',
                required : false,
            },
            Comment : {
                type : 'special',
                required : false,
            },
            Enabled : {
                type : 'special',
                required : true,
            },
            // Logging Elements
            LoggingBucket : {
                type : 'special',
                required : false,
            },
            LoggingPrefix : {
                type : 'special',
                required : false,
            },
            // TrustedSigners Elements
            TrustedSignersSelf : {
                type : 'special',
                required : false,
            },
            TrustedSignersAwsAccountNumber : {
                type : 'special',
                required : false,
            },
        },
    },

    ListStreamingDistributions : {
        path : pathStreamingDistribution,
        args : {
            Marker : {
                required : false,
                type     : 'param',
            },
            MaxItems : {
                required : false,
                type     : 'param',
            },
        },
    },

    GetStreamingDistribution : {
        path : pathStreamingDistributionId,
        args : {
            DistributionId : {
                required : true,
                type     : 'special',
            },
        },
    },

    GetStreamingDistributionConfig : {
        path : pathStreamingDistributionConfig,
        args : {
            DistributionId : {
                required : true,
                type     : 'special',
            },
        },
    },

    PutStreamingDistributionConfig : {
        method : 'PUT',
        path : pathStreamingDistributionConfig,
        args : {
            DistributionId : {
                required : true,
                type     : 'special',
            },
            IfMatch : {
                required : true,
                type     : 'header'
            },
            // S3Origin Elements
            DnsName : {
                type : 'special',
                required : false,
            },
            OriginAccessIdentity : {
                type : 'special',
                required : false,
            },
            // other top level elements
            CallerReference : {
                type : 'special',
                required : true,
            },
            Cname : {
                type : 'special',
                required : false,
            },
            Comment : {
                type : 'special',
                required : false,
            },
            Enabled : {
                type : 'special',
                required : true,
            },
            // Logging Elements
            LoggingBucket : {
                type : 'special',
                required : false,
            },
            LoggingPrefix : {
                type : 'special',
                required : false,
            },
            // TrustedSigners Elements
            TrustedSignersSelf : {
                type : 'special',
                required : false,
            },
            TrustedSignersAwsAccountNumber : {
                type : 'special',
                required : false,
            },
        },
    },

    DeleteStreamingDistribution : {
        method : 'DELETE',
        path : pathStreamingDistributionId,
        args : {
            DistributionId : {
                required : true,
                type     : 'special',
            },
            IfMatch : {
                required : true,
                type     : 'header'
            },
        },
        statusCode : 204,
    },

    // Operations on Origin Access Identities
    ListOAIs : {
        path : function(args) {
            return '/' + this.version() + '/origin-access-identity/cloudfront';
        },
        args : {
            Marker : {
                required : false,
                type     : 'param',
            },
            MaxItems : {
                required : false,
                type     : 'param',
            },
        },
    },

};
