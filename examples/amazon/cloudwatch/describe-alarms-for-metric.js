var fmt = require('fmt');
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var CloudWatch = awssum.load('amazon/cloudwatch').CloudWatch;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var cloudwatch = new CloudWatch({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    'awsAccountId'    : awsAccountId,
    'region'          : amazon.US_EAST_1,
});

console.log( 'Region :',          cloudwatch.region() );
console.log( 'EndPoint :',        cloudwatch.host() );
console.log( 'AccessKeyId :',     cloudwatch.accessKeyId() );
console.log( 'SecretAccessKey :', cloudwatch.secretAccessKey().substr(0, 3) + '...' );
console.log( 'AwsAccountId :',    cloudwatch.awsAccountId() );

var opts = {
    MetricName : 'ConsumedReadCapacityUnits',
    Namespace : 'AWS/DynamoDB',
    Dimensions : [
        { Name : 'TableName', Value : 'test', },
        { Name : 'TableName', Value : 'test-tweets', },
    ],
    Unit : 'Count',
};

cloudwatch.DescribeAlarmsForMetric(opts, function(err, data) {
    console.log("\ndescribing alarms for metric - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});
