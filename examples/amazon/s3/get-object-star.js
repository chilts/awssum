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

var options = {
    BucketName : 'pie-18',
    ObjectName : 'test-object.txt',
};

s3.getObjectAcl(options, function(err, data) {
    console.log("\ngetting an object acl - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

s3.getObjectTorrent(options, function(err, data) {
    console.log("\ngetting an object torrent - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
