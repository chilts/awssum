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

var user1 = {
    TableName : 'test',
    Item : {
        id       : { S : '9bcd1573-00a5-4676-9f9c-9581c8060777' },
        username : { S : 'andychilton' },
        logins   : { N : '0' },
        password : { S : '$2a$10$QfFcIJohati4wvwc9OuFg.IXvsUH6N5ZRmkYxky.5Vh2wGYqvM6Pi' },
    },
};

var user2 = {
    TableName : 'test',
    Item : {},
};

ddb.PutItem(user1, function(err, data) {
    console.log("\nputting an item - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

ddb.PutItem(user2, function(err, data) {
    console.log("\nputting an item without a primary key - expecting failure");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
