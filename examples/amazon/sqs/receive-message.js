var util = require('util');
var amazon = require("amazon/amazon");
var sqs = require("amazon/sqs");

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var sqs = new sqs.Sqs(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', sqs.region() );
console.log( 'EndPoint :',  sqs.host() );
console.log( 'AccessKeyId :', sqs.accessKeyId() );
// console.log( 'SecretAccessKey :', sqs.secretAccessKey() );
console.log( 'AwsAccountId :', sqs.awsAccountId() );

var options = {
    QueueName : 'my-queue'
};

sqs.ReceiveMessage(options, function(err, data) {
    console.log("\nReceiving message from my-queue - expecting success (and a message)");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

options.AttributeName = 'All';
sqs.ReceiveMessage(options, function(err, data) {
    console.log("\nReceiving message from my-queue - expecting success (and a message with all the trimmings)");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

options.MaxNumberOfMessages = 3;
options.VisibilityTimeout = 10;
sqs.ReceiveMessage(options, function(err, data) {
    console.log("\nReceiving 3 messages from my-queue - expecting success (with all the trimmings)");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

sqs.ReceiveMessage({ queueName : 'new-queue' }, function(err, data) {
    console.log("\nReceiving message from new-queue - expecting success (but nothing)");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
