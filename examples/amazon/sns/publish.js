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
sns.createTopic('my-topic', function(err, data) {
    console.log("\nCreating (my-topic) - expecting success");
    console.log('Error :', err);
    console.log('Data  :', data);

    // now call the publish() operation
    if ( ! err ) {
        var topicArn = data.CreateTopicResponse.CreateTopicResult.TopicArn;
        var subject = (new Date()).toString() + ' - Website Down';
        var message = 'Tried ' + parseInt(Math.random() * 17) + '  times to hit the site without any response.';
        sns.publish(topicArn, message, subject, undefined, function(err, data) {
            console.log("\npublishing a message to this topic - expecting success");
            console.log('Error :', util.inspect(err, true, null));
            console.log('Data :', util.inspect(data, true, null));
        });
    }
});
