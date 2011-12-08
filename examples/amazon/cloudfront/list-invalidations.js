var util = require('util');
var amazon = require("amazon/amazon");
var cloudFrontService = require("amazon/cloudfront");

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var cloudFront = new cloudFrontService.CloudFront(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', cloudFront.region() );
console.log( 'EndPoint :',  cloudFront.host() );
console.log( 'AccessKeyId :', cloudFront.accessKeyId() );
// console.log( 'SecretAccessKey :', cloudFront.secretAccessKey() );
console.log( 'AwsAccountId :', cloudFront.awsAccountId() );

var data = {
    DistributionId : 'InvalidDistId',
};

cloudFront.ListInvalidations(data, function(err, data) {
    console.log("\nlisting invalidations - expecting success");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
