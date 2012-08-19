var fmt = require('fmt');
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var Rds = awssum.load('amazon/rds').Rds;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var rds = new Rds({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    // 'awsAccountId'    : awsAccountId, // optional
    'region'          : amazon.US_EAST_1
});

console.log( 'Region :', rds.region() );
console.log( 'EndPoint :',  rds.host() );
console.log( 'AccessKeyId :', rds.accessKeyId().substr(0,3) + '...' );
console.log( 'SecretAccessKey :', rds.secretAccessKey().substr(0,3) + '...' );
console.log( 'AwsAccountId :', rds.awsAccountId() );

rds.DescribeDBInstances(function(err, data) {
    console.log("\ndescribing db instances - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});
