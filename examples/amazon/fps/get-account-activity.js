var fmt = require('fmt');
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var Fps = awssum.load('amazon/fps').Fps;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var fps = new Fps({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    'awsAccountId'    : awsAccountId,
    'region'          : 'FPS-SANDBOX'
});

console.log( 'Region :',          fps.region() );
console.log( 'EndPoint :',        fps.host() );
console.log( 'AccessKeyId :',     fps.accessKeyId() );
console.log( 'SecretAccessKey :', fps.secretAccessKey().substr(0, 3) + '...' );
console.log( 'AwsAccountId :',    fps.awsAccountId() );

var opts1 = {
    StartDate    : '2012-01-01',
    EndDate      : (new Date()).toISOString().substr(0,10),
    MaxBatchSize : 100,
    Status       : 'Reserved',
};

fps.GetAccountActivity(opts1, function(err, data) {
    console.log("\ngetting the account activity - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});

var opts2 = {
    StartDate : '2012-01-01',
    Status    : 'InvalidStatus',
};

fps.GetAccountActivity(opts2, function(err, data) {
    console.log("\ngetting asctivity - expecting failure (invalid status)");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});
