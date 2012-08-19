var fmt = require('fmt');
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var StorageGateway = awssum.load('amazon/storagegateway').StorageGateway;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var sg = new StorageGateway({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    // 'awsAccountId'    : awsAccountId, // optional
    'region'          : amazon.US_EAST_1
});

fmt.field('Region', sg.region() );
fmt.field('EndPoint', sg.host() );
fmt.field('AccessKeyId', sg.accessKeyId().substr(0,3) + '...' );
fmt.field('SecretAccessKey', sg.secretAccessKey().substr(0,3) + '...' );
fmt.field('AwsAccountId', sg.awsAccountId() );

sg.ListVolumes({ GatewayARN : 'invalid-arn' }, function(err, data) {
    fmt.msg("listing volumes - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});
