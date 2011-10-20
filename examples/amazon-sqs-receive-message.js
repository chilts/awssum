var util = require('util');
var amazon = require("../lib/amazon");
var sqs = require("../lib/sqs");

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

sqs.receiveMessage('my-queue', undefined, undefined, undefined, function(err, data) {
    console.log("\nReceiving message from my-queue - expecting success (and a message)");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

sqs.receiveMessage('my-queue', 'All', undefined, undefined, function(err, data) {
    console.log("\nReceiving message from my-queue - expecting success (and a message with all the trimmings)");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

sqs.receiveMessage('my-queue', [ 'All' ], 3, 10, function(err, data) {
    console.log("\nReceiving 3 messages from my-queue - expecting success (with all the trimmings)");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

sqs.receiveMessage('new-queue', undefined, undefined, undefined, function(err, data) {
    console.log("\nReceiving message from new-queue - expecting success (but nothing)");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
