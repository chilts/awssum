var util = require('util');
var amazon = require("amazon");
var sqs = require("sqs");

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var sqs = new sqs.Sqs(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', sqs.region() );
console.log( 'EndPoint :',  sqs.endPoint() );
console.log( 'AccessKeyId :', sqs.accessKeyId() );
console.log( 'SecretAccessKey :', sqs.secretAccessKey() );
console.log( 'AwsAccountId :', sqs.awsAccountId() );

var options = {
    queueName : 'my-queue'
};

sqs.receiveMessage(options, function(err, data) {
    console.log("\nReceiving message from my-queue - expecting success (and a message)");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

options.attribute = 'All';
sqs.receiveMessage(options, function(err, data) {
    console.log("\nReceiving message from my-queue - expecting success (and a message with all the trimmings)");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

options.maxNumberOfMessages = 3;
options.visibilityTimeout = 10;
sqs.receiveMessage(options, function(err, data) {
    console.log("\nReceiving 3 messages from my-queue - expecting success (with all the trimmings)");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

sqs.receiveMessage({ queueName : 'new-queue' }, function(err, data) {
    console.log("\nReceiving message from new-queue - expecting success (but nothing)");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
