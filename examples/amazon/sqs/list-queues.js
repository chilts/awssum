var inspect = require('eyes').inspector();
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var sqs = awssum.load('amazon/sqs');

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var sqs = new sqs(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', sqs.region() );
console.log( 'EndPoint :',  sqs.host() );
console.log( 'AccessKeyId :', sqs.accessKeyId() );
// console.log( 'SecretAccessKey :', sqs.secretAccessKey() );
console.log( 'AwsAccountId :', sqs.awsAccountId() );

sqs.ListQueues({}, function(err, data) {
    console.log("\nlisting queues - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
