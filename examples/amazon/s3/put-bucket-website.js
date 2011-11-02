var util = require('util');
var amazon = require('amazon');
var s3Service = require('s3');

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var s3 = new s3Service.S3(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);
var s3eu = new s3Service.S3(accessKeyId, secretAccessKey, awsAccountId, amazon.EU_WEST_1);

console.log( 'Region :', s3.region() );
console.log( 'EndPoint :',  s3.endPoint() );
console.log( 'AccessKeyId :', s3.accessKeyId() );
console.log( 'SecretAccessKey :', s3.secretAccessKey() );
console.log( 'AwsAccountId :', s3.awsAccountId() );

var options = {
    BucketName : 'pie-18',
    IndexDocument : 'index.html',
    ErrorDocument : '404.html'
};

s3.putBucketWebsite(options, function(err, data) {
    console.log("\nputting website configuration to1 pie-18 - expecting failure (already created)");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
