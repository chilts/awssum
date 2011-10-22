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

sqs.createQueue('my-queue', undefined, function(err, data) {
    console.log("\nCreating (my-queue, undefined) - expecting success");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

sqs.createQueue('my-queue', 20, function(err, data) {
    console.log("\nCreating (my-queue, 20) - expecting failure");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

sqs.createQueue('new-queue', undefined, function(err, data) {
    console.log("\nCreating (new-queue, undefined) - expecting success");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
