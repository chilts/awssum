var inspect = require('eyes').inspector();
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var cloudFrontService = awssum.load('amazon/cloudfront');

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var cloudFront = new cloudFrontService(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', cloudFront.region() );
console.log( 'EndPoint :',  cloudFront.host() );
console.log( 'AccessKeyId :', cloudFront.accessKeyId() );
// console.log( 'SecretAccessKey :', cloudFront.secretAccessKey() );
console.log( 'AwsAccountId :', cloudFront.awsAccountId() );

var args = {
    DistributionId : 'HelloWorld',
};

cloudFront.GetStreamingDistribution(args, function(err, data) {
    console.log("\nget distribution - expecting failure (doesn't exist)");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
