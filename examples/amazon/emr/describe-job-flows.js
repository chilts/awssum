var fmt = require('fmt');
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var Emr = awssum.load('amazon/emr').Emr;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var emr = new Emr({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    // 'awsAccountId'    : awsAccountId, // optional
    'region'          : amazon.US_EAST_1
});

console.log( 'Region :', emr.region() );
console.log( 'EndPoint :',  emr.host() );
console.log( 'AccessKeyId :', emr.accessKeyId().substr(0,3) + '...' );
console.log( 'SecretAccessKey :', emr.secretAccessKey().substr(0,3) + '...' );
console.log( 'AwsAccountId :', emr.awsAccountId() );

emr.DescribeJobFlows(function(err, data) {
    console.log("\ndescribing job flows - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});

emr.DescribeJobFlows({
    JobFlowStates  : [ 'RUNNING', 'STARTING' ],
}, function(err, data) {
    console.log("\ndescribing job flows (RUNNING, STARTING) - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});

emr.DescribeJobFlows({
    JobFlowStates  : [ 'PENDING', 'STARTING' ],
}, function(err, data) {
    console.log("\ndescribing job flows (PENDING, STARTING) - expecting failure (invalid PENDING) state");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});
