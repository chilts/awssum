var inspect = require('eyes').inspector();
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
    QueueName    : 'my-queue',
    Id           : [ 'janelle', 'lucy', 'sarah' ],
    MessageBody  : [ 'janelle', 'lucy', 'sarah' ],
    DelaySeconds : [ undefined, undefined, 20 ],
};

sqs.SendMessageBatch(options, function(err, data) {
    console.log("\nSending a message batch to a queue - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
