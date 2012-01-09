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

sdb.DeleteAttributes({
    DomainName : 'test',
    ItemName : 'chilts',
    AttributeName : 'username',
    AttributeValue : 'chilts',
}, function(err, data) {
    console.log("\nDeleting attributes for chilts - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

sdb.DeleteAttributes({
    DomainName : 'test',
    ItemName : 'chilts',
    AttributeName : [ 'url' ],
    AttributeValue : [ 'chilts' ],
    ExpectedName : [ 'url' ],
    ExpectedValue : [ 'blah' ],
}, function(err, data) {
    console.log("\nDeleting attributes for chilts (conditional) - expecting failure");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
