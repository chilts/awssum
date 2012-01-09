var inspect = require('eyes').inspector();
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var simpledb = awssum.load('amazon/simpledb');

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var sdb = new simpledb(accessKeyId, secretAccessKey, awsAccountId, amazon.US_WEST_1);

console.log( 'Region :', sdb.region() );
console.log( 'EndPoint :',  sdb.host() );
console.log( 'AccessKeyId :', sdb.accessKeyId() );
// console.log( 'SecretAccessKey :', sdb.secretAccessKey() );
console.log( 'AwsAccountId :', sdb.awsAccountId() );

sdb.CreateDomain({ DomainName : 'test' }, function(err, data) {
    console.log("\nCreating domain - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
