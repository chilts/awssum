var util = require('util');
var amazon = require('amazon');
var snsService = require('sns');

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

// firstly, re-create this topic (it's idempotent) to get the topicArn
sns.createTopic({ topicName : 'my-topic' }, function(err, data) {
    console.log("\nCreating (my-topic) - expecting success");
    console.log('Error :', err);
    console.log('Data  :', data);

    // now call the addPermission()
    if ( ! err ) {
        var args = {
            topicArn : data.CreateTopicResponse.CreateTopicResult.TopicArn,
            label : 'A Test Permission',
            permissions : [
                { awsAccountId : '123-456-789', actionName : 'NoExistantAction' }
            ],
        };
        sns.addPermission(args, function(err, data) {
            console.log("\naddPermission() - expecting failure (for many reasons)");
            console.log('Error :', util.inspect(err, true, null));
            console.log('Data :', util.inspect(data, true, null));
        });
    }
});
