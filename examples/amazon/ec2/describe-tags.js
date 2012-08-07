var inspect = require('eyes').inspector();
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var Ec2 = awssum.load('amazon/ec2').Ec2;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var ec2 = new Ec2({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    // 'awsAccountId'    : awsAccountId, // optional
    'region'          : amazon.US_EAST_1
});

console.log( 'Region :', ec2.region() );
console.log( 'EndPoint :',  ec2.host() );
console.log( 'AccessKeyId :', ec2.accessKeyId().substr(0,3) + '...' );
console.log( 'SecretAccessKey :', ec2.secretAccessKey().substr(0,3) + '...' );
console.log( 'AwsAccountId :', ec2.awsAccountId() );

ec2.DescribeTags({ Filter : [ { Name : 'resource-type', Value : 'instance' } ]}, function(err, data) {
    console.log("\ndescribing tags - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
