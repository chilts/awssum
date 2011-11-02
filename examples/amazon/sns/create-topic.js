var util = require('util');
var amazon = require("amazon");
var snsService = require("sns");

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var sns = new snsService.Sns(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', sns.region() );
console.log( 'EndPoint :',  sns.endPoint() );
console.log( 'AccessKeyId :', sns.accessKeyId() );
console.log( 'SecretAccessKey :', sns.secretAccessKey() );
console.log( 'AwsAccountId :', sns.awsAccountId() );

sns.createTopic({ topicName : 'my-topic' }, function(err, data) {
    console.log("\nCreating (my-topic) - expecting success");
    console.log('Error :', err);
    console.log('Data  :', data);
});

sns.createTopic({}, function(err, data) {
    console.log("\nCreating (undefined) - expecting failure");
    console.log('Error :', err);
    console.log('Data  :', data);
});
