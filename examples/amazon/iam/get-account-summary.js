var inspect = require('eyes').inspector();
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var Iam = awssum.load('amazon/iam').Iam;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var iam = new Iam({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    // 'awsAccountId'    : awsAccountId, // optional
    'region'          : amazon.US_EAST_1
});

console.log( 'Region :', iam.region() );
console.log( 'EndPoint :',  iam.host() );
console.log( 'AccessKeyId :', iam.accessKeyId().substr(0,3) + '...' );
console.log( 'SecretAccessKey :', iam.secretAccessKey().substr(0,3) + '...' );
console.log( 'AwsAccountId :', iam.awsAccountId() );

iam.GetAccountSummary(function(err, data) {
    console.log("\ngetting account summary - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
