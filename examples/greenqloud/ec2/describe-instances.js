var inspect = require('eyes').inspector();
var awssum = require('awssum');
var greenqloud = awssum.load('greenqloud/greenqloud');
var Ec2 = awssum.load('greenqloud/ec2').Ec2;

var env             = process.env;
var accessKeyId     = env.GREENQLOUD_ACCESS_KEY_ID;
var secretAccessKey = env.GREENQLOUD_SECRET_ACCESS_KEY;
var awsAccountId    = env.GREENQLOUD_ACCOUNT_ID;

var ec2 = new Ec2({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    // 'awsAccountId'    : awsAccountId, // optional
    'region'          : greenqloud.IS_1
});

console.log( 'Region                    : ' + ec2.region() );
console.log( 'EndPoint                  : ' + ec2.host() );
console.log( 'GreenQloudAccessKeyId     : ' + ec2.accessKeyId().substr(0,3) + '...' );
console.log( 'GreenQloudSecretAccessKey : ' + ec2.secretAccessKey().substr(0,3) + '...' );
console.log( 'GreenQloudAccountId       : ' + ec2.awsAccountId() );

ec2.DescribeInstances(function(err, data) {
    console.log("\nDescribing instances - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

ec2.DescribeInstances({
    FilterName  : [ 'ip-address', 'key-name' ],
    FilterValue : [ [ '1.2.3.4', '5.6.7.8' ], [ 'my-key' ] ],
}, function(err, data) {
    console.log("\nDescribing instances (with filter) - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
