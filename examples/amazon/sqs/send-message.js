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

var optionsMyQueue = {
    QueueName : 'my-queue',
    MessageBody : 'HelloWorld',
};

var optionsNewQueue = {
    QueueName : 'my-queue',
};

var optionsMyQueueDelayed = {
    QueueName    : 'my-queue',
    MessageBody  : 'HelloWorld',
    DelaySeconds : 10,
};

sqs.SendMessage(optionsMyQueue, function(err, data) {
    console.log("\nSending a message to a queue - expecting success");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

sqs.SendMessage(optionsNewQueue, function(err, data) {
    console.log("\nSending an undefined message - expecting failure");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

sqs.SendMessage(optionsMyQueueDelayed, function(err, data) {
    console.log("\nSending a delayed message - expecting success");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
