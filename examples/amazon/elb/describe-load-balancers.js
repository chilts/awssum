var inspect = require('eyes').inspector();
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var elbService = awssum.load('amazon/elb');

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var elb = new elbService(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', elb.region() );
console.log( 'EndPoint :',  elb.host() );
console.log( 'AccessKeyId :', elb.accessKeyId() );
// console.log( 'SecretAccessKey :', elb.secretAccessKey() );
console.log( 'AwsAccountId :', elb.awsAccountId() );

elb.DescribeLoadBalancers(function(err, data) {
    console.log("\ndescribing load balancers - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
