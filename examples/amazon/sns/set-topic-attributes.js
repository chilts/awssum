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

// firstly, re-create this topic (it's idempotent) to get the topicArn
sns.CreateTopic({ TopicName : 'my-topic' }, function(err, data) {
    console.log("\nCreating (my-topic) - expecting success");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));

    // now call the listSubscriptionsByTopic()
    if ( ! err ) {
        var args = {
            TopicArn       : data.CreateTopicResponse.CreateTopicResult.TopicArn,
            AttributeName  : 'DisplayName',
            AttributeValue : 'My Topic Display Name',
        };
        sns.SetTopicAttributes(args, function(err, data) {
            console.log("\nsetTopicAttributes - expecting success");
            console.log('Error :', util.inspect(err, true, null));
            console.log('Data :', util.inspect(data, true, null));
        });
    }
});
