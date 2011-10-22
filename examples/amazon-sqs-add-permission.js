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

var policies = [
    { awsAccountId : '123-456-789', actionName : 'SendMessage' }
];

sqs.addPermission('my-queue', 'A Label Thus', policies, function(err, data) {
    console.log("\nAdding a set of Policies to this queue - expecting failed (for many reasons)");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
