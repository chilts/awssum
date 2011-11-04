var util = require('util');
var amazon = require("amazon");
var simpledb = require("simpledb");

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var sdb = new simpledb.SimpleDB(accessKeyId, secretAccessKey, awsAccountId, amazon.US_WEST_1);

console.log( 'Region :', sdb.region() );
console.log( 'EndPoint :',  sdb.host() );
console.log( 'AccessKeyId :', sdb.accessKeyId() );
console.log( 'SecretAccessKey :', sdb.secretAccessKey() );
console.log( 'AwsAccountId :', sdb.awsAccountId() );

var user1 = {
    username : 'chilts',
    url : 'http://www.chilts.org/blog/'
};

var user2 = [
    { name : 'username', value : 'andychilton' },
    { name : 'url',      value : 'http://www.chilts.org/blog/' },
    // only replace this value if it already exists
    { name : 'password', value : 'testpass', exists : true, expected : 'testpass' }
];

var user3 = [
    { name : 'username', value : 'replace',                     replace : false },
    { name : 'url',      value : 'http://www.chilts.org/blog/', replace : true  }
];

var user4 = [
    { name : 'username', value : 'expected' },
    { name : 'url',      value : 'http://www.chilts.org/blog/' },
    // set the salt, but only if we believe its current value
    { name : 'salt', value : 'amo3Rie6', expected : 'amo3Rie6' }
];

sdb.putAttributes({ domainName : 'test', itemName : 'chilts', data : user1 }, function(err, data) {
    console.log("\nputting user chilts - expecting success");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

sdb.putAttributes({ domainName : 'test', itemName : 'andychilton', data : user2 }, function(err, data) {
    console.log("\nputting with a conditional - expecting failure");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

sdb.putAttributes({ domainName : 'test', itemName : 'replace', data : user3 }, function(err, data) {
    console.log("\nputting a replace - expecting success");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

sdb.putAttributes({ domainName : 'test', itemName : 'expected', data : user4 }, function(err, data) {
    console.log("\nputting with an expected - expecting success");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
