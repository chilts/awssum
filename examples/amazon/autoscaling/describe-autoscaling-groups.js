var inspect = require('eyes').inspector();
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var AutoScaling = awssum.load('amazon/autoscaling').AutoScaling;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var as = new AutoScaling({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    'region'          : amazon.US_EAST_1,
});

console.log( 'Region :',          as.region() );
console.log( 'EndPoint :',        as.host() );
console.log( 'AccessKeyId :',     as.accessKeyId() );
console.log( 'SecretAccessKey :', as.secretAccessKey().substr(0, 3) + '...' );

as.DescribeAutoScalingGroups(function(err, data) {
    console.log("\ndescribing autoscaling groups - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
