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

module.exports = {
    ListDistributions : {
        required : [],
        optional : [ 'Marker', 'MaxItems' ],
        array    : [],
    },
    Template : {
        required : [],
        optional : [],
        array    : [],
    },
};
