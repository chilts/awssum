var inspect = require('eyes').inspector();
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var Swf = awssum.load('amazon/swf').Swf;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var swf = new Swf({
    'accessKeyId' : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    'region' : amazon.US_EAST_1
});

console.log( 'Region :', swf.region() );
console.log( 'EndPoint :',  swf.host() );
console.log( 'AccessKeyId :', swf.accessKeyId() );
// console.log( 'SecretAccessKey :', swf.secretAccessKey() );
console.log( 'AwsAccountId :', swf.awsAccountId() );

swf.DescribeDomain({ 'Name' : 'test' }, function(err, data) {
    console.log("\ndescribing domain - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
