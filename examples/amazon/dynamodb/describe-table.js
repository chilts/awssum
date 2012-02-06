var inspect = require('eyes').inspector();
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var dynamoDBService = awssum.load('amazon/dynamodb');

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var ddb = new dynamoDBService(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', ddb.region() );
console.log( 'EndPoint :',  ddb.host() );
console.log( 'AccessKeyId :', ddb.accessKeyId() );
// console.log( 'SecretAccessKey :', ddb.secretAccessKey() );
console.log( 'AwsAccountId :', ddb.awsAccountId() );

ddb.ListTables(function(err, data) {
    if ( err ) {
        inspect(err, 'Error when Listing Tables');
        return;
    }

    // got the tables ok, now just get the first one to describe
    var data = {
        TableName : data.Body.TableNames[0],
    };
    ddb.DescribeTable(data, function(err, data) {
        console.log("\ndescribing the first table - expecting success");
        inspect(err, 'Error');
        inspect(data, 'Data');
    });
});
