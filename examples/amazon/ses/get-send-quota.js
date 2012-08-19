var fmt = require('fmt');
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var Ses = awssum.load('amazon/ses').Ses;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var ses = new Ses({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    // 'awsAccountId'    : awsAccountId, // optional
});

fmt.field('Region', ses.region() );
fmt.field('EndPoint', ses.host() );
fmt.field('AccessKeyId', ses.accessKeyId() );
fmt.field('SecretAccessKey', ses.secretAccessKey().substr(0, 3) + '...' );
fmt.field('AwsAccountId', ses.awsAccountId() );

ses.GetSendQuota(function(err, data) {
    fmt.msg("Getting send quota - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});
