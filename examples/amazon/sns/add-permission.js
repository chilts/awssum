var inspect = require('eyes').inspector();
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
    inspect(err, 'Error');
    inspect(data, 'Data');

    // now call the addPermission()
    if ( ! err ) {
        var args = {
            TopicArn : data.CreateTopicResponse.CreateTopicResult.TopicArn,
            Label : 'A Test Permission',
            AwsAccountId : [ '123-456-789' ],
            ActionName : [ 'NoExistantAction' ],
        };
        sns.AddPermission(args, function(err, data) {
            console.log("\nAddPermission() - expecting failure (for many reasons)");
            inspect(err, 'Error');
            inspect(data, 'Data');
        });
    }
});
