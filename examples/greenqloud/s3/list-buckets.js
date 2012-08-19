var fmt = require('fmt');
var awssum = require('awssum');
var greenqloud = awssum.load('greenqloud/greenqloud');
var S3 = awssum.load('greenqloud/s3').S3;

var env             = process.env;
var accessKeyId     = env.GREENQLOUD_ACCESS_KEY_ID;
var secretAccessKey = env.GREENQLOUD_SECRET_ACCESS_KEY;
var awsAccountId    = env.GREENQLOUD_ACCOUNT_ID;

var s3 = new S3({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    // 'awsAccountId'    : awsAccountId, // optional
    'region'          : greenqloud.IS_1
});

console.log( 'Region          :', s3.region() );
console.log( 'EndPoint        :', s3.host() );
console.log( 'AccessKeyId     :', s3.accessKeyId() );
console.log( 'SecretAccessKey :', s3.secretAccessKey().substr(0, 3) + '...' );
console.log( 'AwsAccountId    :', s3.awsAccountId() );

s3.ListBuckets(function(err, data) {
    console.log("\nlisting all the buckets (no options given) - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});

s3.ListBuckets(undefined, function(err, data) {
    console.log("\nlisting all the buckets (undefined options) - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});

s3.ListBuckets({}, function(err, data) {
    console.log("\nlisting all the buckets (empty options) - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});

s3.ListBuckets({ Ignored : 'this is' }, function(err, data) {
    console.log("\nlisting all the buckets (nothing interesting in options) - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});
