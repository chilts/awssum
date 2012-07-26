var inspect = require('eyes').inspector();
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var CloudFormation = awssum.load('amazon/cloudformation').CloudFormation;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var cloudformation = new CloudFormation({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    // 'awsAccountId'    : awsAccountId, // optional
    'region'          : amazon.US_EAST_1
});

console.log( 'Region :', cloudformation.region() );
console.log( 'EndPoint :',  cloudformation.host() );
console.log( 'AccessKeyId :', cloudformation.accessKeyId().substr(0,3) + '...' );
console.log( 'SecretAccessKey :', cloudformation.secretAccessKey().substr(0,3) + '...' );
console.log( 'AwsAccountId :', cloudformation.awsAccountId() );

cloudformation.ListStacks(function(err, data) {
    console.log("\nlisting stacks - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
