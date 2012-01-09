var inspect = require('eyes').inspector();
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var route53 = awssum.load('amazon/route53');

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var r53 = new route53(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', r53.region() );
console.log( 'EndPoint :',  r53.host() );
console.log( 'AccessKeyId :', r53.accessKeyId() );
// console.log( 'SecretAccessKey :', r53.secretAccessKey() );
console.log( 'AwsAccountId :', r53.awsAccountId() );

r53.DeleteHostedZone({ HostedZoneId : 'deadbeef' }, function(err, data) {
    console.log("\ndeleting hosted zone - expecting failure");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
