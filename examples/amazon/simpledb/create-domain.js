var fmt = require('fmt');
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var SimpleDB = awssum.load('amazon/simpledb').SimpleDB;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var sdb = new SimpleDB({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    // 'awsAccountId'    : awsAccountId, // optional
    'region'          : amazon.US_EAST_1
});

fmt.field('Region', sdb.region() );
fmt.field('EndPoint', sdb.host() );
fmt.field('AccessKeyId', sdb.accessKeyId() );
fmt.field('SecretAccessKey', sdb.secretAccessKey().substr(0, 3) + '...' );
fmt.field('AwsAccountId', sdb.awsAccountId() );

sdb.CreateDomain({ DomainName : 'test' }, function(err, data) {
    fmt.msg("Creating domain - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});
