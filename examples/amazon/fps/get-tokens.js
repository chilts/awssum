var inspect = require('eyes').inspector();
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

fps.GetTokens({}, function(err, data) {
    console.log("\ngetting tokens - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
