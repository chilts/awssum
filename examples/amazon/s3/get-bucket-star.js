var inspect = require('eyes').inspector();
var amazon = require('amazon/amazon');
var s3Service = require('amazon/s3');

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

s3.getBucketAcl({ BucketName : 'pie-17' }, function(err, data) {
    console.log("\nget bucket acl");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

s3.getBucketPolicy({ BucketName : 'pie-17' }, function(err, data) {
    console.log("\nget bucket policy - expecting failure, no policy exists");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

s3.getBucketLocation({ BucketName : 'pie-17' }, function(err, data) {
    console.log("\nget bucket location");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

s3.getBucketLogging({ BucketName : 'pie-17' }, function(err, data) {
    console.log("\nget bucket logging");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

s3.getBucketNotification({ BucketName : 'pie-17' }, function(err, data) {
    console.log("\nget bucket notification");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

s3.getBucketRequestPayment({ BucketName : 'pie-17' }, function(err, data) {
    console.log("\nget bucket request payment");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

s3.getBucketVersioning({ BucketName : 'pie-17' }, function(err, data) {
    console.log("\nget bucket versioning");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

s3.getBucketWebsite({ BucketName : 'pie-17' }, function(err, data) {
    console.log("\nget bucket website - expecting failure since this bucket has never had a website");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

s3.listMultipartUploads({ BucketName : 'pie-17' }, function(err, data) {
    console.log("\nlist multipart uploads - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
