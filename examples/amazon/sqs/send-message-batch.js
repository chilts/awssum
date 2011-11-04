var util = require('util');
var amazon = require("amazon");
var sqs = require("sqs");

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
    queueName : 'my-queue',
    messages : [
        { id : 'janelle', messageBody : 'janelle' },
        { id : 'lucy',    messageBody : 'lucy'    },
        { id : 'sarah',   messageBody : 'sarah', delaySeconds : 20 }
    ],
};

sqs.sendMessageBatch(options, function(err, data) {
    console.log("\nSending a message batch to a queue - expecting success");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
