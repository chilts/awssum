var fmt = require('fmt');
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var Iam = awssum.load('amazon/iam').Iam;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var iam = new Iam({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    // 'awsAccountId'    : awsAccountId, // optional
    'region'          : amazon.US_EAST_1
});

console.log( 'Region :', iam.region() );
console.log( 'EndPoint :',  iam.host() );
console.log( 'AccessKeyId :', iam.accessKeyId().substr(0,3) + '...' );
console.log( 'SecretAccessKey :', iam.secretAccessKey().substr(0,3) + '...' );
console.log( 'AwsAccountId :', iam.awsAccountId() );

var opts = {
    GroupName : 'test-group',
    PolicyDocument : {
        'msg' : 'Hello, World!'
    },
    PolicyName : 'text-policy'
};

iam.PutGroupPolicy(opts, function(err, data) {
    console.log("\nputting group policy - expecting failure (group not found)");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});
