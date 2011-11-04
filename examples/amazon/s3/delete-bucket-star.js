var util = require('util');
var amazon = require('amazon');
var s3Service = require('s3');

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var s3 = new s3Service.S3(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', s3.region() );
console.log( 'EndPoint :',  s3.host() );
console.log( 'AccessKeyId :', s3.accessKeyId() );
// console.log( 'SecretAccessKey :', s3.secretAccessKey() );
console.log( 'AwsAccountId :', s3.awsAccountId() );

s3.deleteBucketWebsite({ BucketName : 'non-existant' }, function(err, data) {
    console.log("\ndelete bucket website - expecting failure (for not existing)");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

s3.deleteBucketPolicy({ BucketName : 'non-existant' }, function(err, data) {
    console.log("\ndelete bucket policy - expecting failure (for not existing)");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

s3.deleteBucket({ BucketName : 'non-existant' }, function(err, data) {
    console.log("\ndelete bucket - expecting failure (for not existing)");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
