var util = require("util");
var amazon = require("amazon");
var simpledb = require("simpledb");

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var sdb = new simpledb.SimpleDB(accessKeyId, secretAccessKey, awsAccountId, amazon.US_WEST_1);

console.log( 'Region :', sdb.region() );
console.log( 'EndPoint :',  sdb.endPoint() );
console.log( 'AccessKeyId :', sdb.accessKeyId() );
console.log( 'SecretAccessKey :', sdb.secretAccessKey() );
console.log( 'AwsAccountId :', sdb.awsAccountId() );

sdb.select({ selectExpression : 'SELECT username FROM test' }, function(err, data) {
    console.log("\nSELECT username FROM test");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

sdb.select({ selectExpression : 'SELECT * FROM test', consistentRead : true }, function(err, data) {
    console.log("\nSELECT * FROM test");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
