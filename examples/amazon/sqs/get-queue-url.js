var fmt = require('fmt');
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var Sqs = awssum.load('amazon/sqs').Sqs;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var sqs = new Sqs(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

fmt.field('Region', sqs.region() );
fmt.field('EndPoint', sqs.host() );
fmt.field('AccessKeyId', sqs.accessKeyId() );
fmt.field('SecretAccessKey', sqs.secretAccessKey().substr(0, 3) + '...' );
fmt.field('AwsAccountId', sqs.awsAccountId() );

sqs.GetQueueUrl({ QueueName : 'my-queue' }, function(err, data) {
    fmt.msg("Getting the URL for my-queue - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});
