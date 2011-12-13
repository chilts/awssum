var util = require('util');
var amazon = require('amazon/amazon');
var snsService = require('amazon/sns');

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var sns = new snsService.Sns(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', sns.region() );
console.log( 'EndPoint :',  sns.host() );
console.log( 'AccessKeyId :', sns.accessKeyId() );
// console.log( 'SecretAccessKey :', sns.secretAccessKey() );
console.log( 'AwsAccountId :', sns.awsAccountId() );

sns.Unsubscribe({ SubscriptionArn : 'fakeSubscriptionArn' }, function(err, data) {
    console.log("\nUnsubscribing this subscriptionArn - expecting failure");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

sns.Unsubscribe({}, function(err, data) {
    console.log("\nUnsubscribing an undefined subscriptionArn - expecting failure");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
