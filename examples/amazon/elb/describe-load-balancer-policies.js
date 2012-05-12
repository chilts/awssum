var inspect = require('eyes').inspector();
var amazon = require("amazon/amazon");
var Elb = require("amazon/elb");

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var elb = new Elb(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', elb.region() );
console.log( 'EndPoint :',  elb.host() );
console.log( 'AccessKeyId :', elb.accessKeyId() );
// console.log( 'SecretAccessKey :', elb.secretAccessKey() );
console.log( 'AwsAccountId :', elb.awsAccountId() );

elb.DescribeLoadBalancerPolicies(function(err, data) {
    console.log("\ndescribing load balancer policies - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
