var util = require('util');
var amazon = require('../lib/amazon');
var s3Service = require('../lib/s3');

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var s3 = new s3Service.S3(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', s3.region() );
console.log( 'EndPoint :',  s3.endPoint() );
console.log( 'AccessKeyId :', s3.accessKeyId() );
console.log( 'SecretAccessKey :', s3.secretAccessKey() );
console.log( 'AwsAccountId :', s3.awsAccountId() );

s3.getBucketAcl({ BucketName : 'bulk' }, function(err, data) {
    console.log("\nget bucket acl");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

s3.getBucketPolicy({ BucketName : 'bulk' }, function(err, data) {
    console.log("\nget bucket policy - expecting failure, no policy exists");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

s3.getBucketLocation({ BucketName : 'bulk' }, function(err, data) {
    console.log("\nget bucket location");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

s3.getBucketLogging({ BucketName : 'bulk' }, function(err, data) {
    console.log("\nget bucket logging");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

s3.getBucketNotification({ BucketName : 'bulk' }, function(err, data) {
    console.log("\nget bucket notification");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

s3.getBucketRequestPayment({ BucketName : 'bulk' }, function(err, data) {
    console.log("\nget bucket request payment");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

s3.getBucketVersioning({ BucketName : 'bulk' }, function(err, data) {
    console.log("\nget bucket versioning");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

s3.getBucketWebsite({ BucketName : 'bulk' }, function(err, data) {
    console.log("\nget bucket website - expecting failure since this bucket has never had a website");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
