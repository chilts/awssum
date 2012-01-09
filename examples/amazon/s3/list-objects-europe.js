var inspect = require('eyes').inspector();
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var s3Service = awssum.load('amazon/s3');
var _ = require('underscore');

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var s3 = new s3Service(accessKeyId, secretAccessKey, awsAccountId, amazon.EU_WEST_1);

console.log( 'Region :', s3.region() );
console.log( 'EndPoint :',  s3.host() );
console.log( 'AccessKeyId :', s3.accessKeyId() );
// console.log( 'SecretAccessKey :', s3.secretAccessKey() );
console.log( 'AwsAccountId :', s3.awsAccountId() );

var options1 = {
    BucketName : 'pie-18-in-europe',
};

s3.listObjects(options1, function(err, data) {
    console.log("\nlisting objects in this bucket - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
