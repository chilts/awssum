var inspect = require('eyes').inspector();
var amazon = require("amazon/amazon");
var simpledb = require("amazon/simpledb");

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var sdb = new simpledb.SimpleDB(accessKeyId, secretAccessKey, awsAccountId, amazon.US_WEST_1);

console.log( 'Region :', sdb.region() );
console.log( 'EndPoint :',  sdb.host() );
console.log( 'AccessKeyId :', sdb.accessKeyId() );
// console.log( 'SecretAccessKey :', sdb.secretAccessKey() );
console.log( 'AwsAccountId :', sdb.awsAccountId() );

sdb.select({ selectExpression : 'SELECT username FROM test' }, function(err, data) {
    console.log("\nSELECT username FROM test");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

sdb.select({ selectExpression : 'SELECT * FROM test', consistentRead : true }, function(err, data) {
    console.log("\nSELECT * FROM test");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
