var fmt = require('fmt');
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var Sns = awssum.load('amazon/sns').Sns;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var sns = new Sns({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    // 'awsAccountId'    : awsAccountId, // optional
    'region'          : amazon.US_EAST_1
});

fmt.field('Region', sns.region() );
fmt.field('EndPoint', sns.host() );
fmt.field('AccessKeyId', sns.accessKeyId() );
fmt.field('SecretAccessKey', sns.secretAccessKey().substr(0, 3) + '...' );
fmt.field('AwsAccountId', sns.awsAccountId() );

sns.CreateTopic({ Name : 'my-topic' }, function(err, data) {
    fmt.msg("Creating (my-topic) - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});

sns.CreateTopic({}, function(err, data) {
    fmt.msg("Creating (undefined) - expecting failure");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});

sns.CreateTopic(function(err, data) {
    fmt.msg("Creating (undefined) - expecting failure");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});
