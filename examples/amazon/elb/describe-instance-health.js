var inspect = require('eyes').inspector();
var amazon = require("amazon/amazon");
var elbService = require("amazon/elb");

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var elb = new elbService.Elb(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', elb.region() );
console.log( 'EndPoint :',  elb.host() );
console.log( 'AccessKeyId :', elb.accessKeyId() );
// console.log( 'SecretAccessKey :', elb.secretAccessKey() );
console.log( 'AwsAccountId :', elb.awsAccountId() );

var data = {
    loadBalancerName : 'no-name',
};

elb.describeInstanceHealth(data, function(err, data) {
    console.log("\ndescribing instance health - expecting failure (due to there not being one)");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

data.Instances = [
    'instance-1', 'instance-2'
];

elb.describeInstanceHealth(data, function(err, data) {
    console.log("\ndescribing instance health with instances - expecting failure (due to there not being one)");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
