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

console.log( 'Region :', sg.region() );
console.log( 'EndPoint :',  sg.host() );
console.log( 'AccessKeyId :', sg.accessKeyId().substr(0,3) + '...' );
console.log( 'SecretAccessKey :', sg.secretAccessKey().substr(0,3) + '...' );
console.log( 'AwsAccountId :', sg.awsAccountId() );

sg.ListGateways(function(err, data) {
    console.log("\nlisting gateways - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});

sg.ListGateways({ Limit : 5 }, function(err, data) {
    console.log("\nlisting gateways with a limit of 5 - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});
