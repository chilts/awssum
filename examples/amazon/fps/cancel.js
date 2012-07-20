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

var opts = {
    TransactionId : '12345678901234567890123456789012345',
    Description   : 'Cancelling because something did not work.',
};

fps.Cancel(opts, function(err, data) {
    console.log("\ncancel - expecting failure (invalid transaction id)");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
