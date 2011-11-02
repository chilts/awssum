var util = require('util');
var amazon = require("amazon");
var ec2Service = require("ec2");

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var ec2 = new ec2Service.Ec2(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', ec2.region() );
console.log( 'EndPoint :',  ec2.endPoint() );
console.log( 'AccessKeyId :', ec2.accessKeyId() );
// console.log( 'SecretAccessKey :', ec2.secretAccessKey() );
console.log( 'AwsAccountId :', ec2.awsAccountId() );

ec2.describeInstances(function(err, data) {
    console.log("\ndescribing instances - expecting success");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
