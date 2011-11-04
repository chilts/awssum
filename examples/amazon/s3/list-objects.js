var util = require('util');
var amazon = require('amazon');
var s3Service = require('s3');
var _ = require('underscore');

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

var options1 = {
    BucketName : 'pie-17',
    MaxKeys : 4,
};

s3.listObjects(options1, function(err, data) {
    console.log("\nlisting objects in this bucket - expecting success");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));

    // now do a marker
    if ( data.ListBucketResult.IsTruncated === 'true' ) {
        options1.Marker = _.last(data.ListBucketResult.Contents).Key;

        s3.listObjects(options1, function(err, data) {
            console.log("\ngetting the next set - expecting success");
            console.log('Error :', util.inspect(err, true, null));
            console.log('Data :', util.inspect(data, true, null));
        });
    }
});

var options2 = {
    BucketName : 'pie-17',
    MaxKeys : 4,
    Prefix : 'c',
};

s3.listObjects(options2, function(err, data) {
    console.log("\nlisting object with a prefix - expecting success");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
