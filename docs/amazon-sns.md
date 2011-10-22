Amazon Simple Notification Service
==================================

Quick Example:

    var amazon = require('../lib/amazon');
    var snsService = require('../lib/sns');

    var sns = new snsService.Sns('access_key', 'secret', '123-456-789', amazon.US_EAST_1);

    // create this topic to get the topicArn
    sns.createTopic('my-topic', function(err, data) {
        if ( err ) {
            console.log('Error :', err);
            return;
        }

        console.log('Ok :', data);

        // now call the publish() operation
        var topicArn = data.CreateTopicResponse.CreateTopicResult.TopicArn;
        var subject = 'a new subject';
        var message = 'a message to publish';
        sns.publish(topicArn, message, subject, undefined, function(err, data) {
            if ( err ) {
                console.log('Error :', err);
                return;
            }
            console.log('Ok :', data);
        });
    });

Operations
==========

The Simple Notification Service is 100% implemented (as at 2011-10-23), and consists of the following operations:

* addPermission(topicArn, label, permissions, callBack)
* confirmSubscription(topicArn, token, authenticateOnUnsubscribe, callBack)
* createTopic(topicName, callBack)
* deleteTopic(topicArn, callBack)
* getTopicAttributes(topicArn, callBack)
* listSubscriptions(nextToken, callBack)
* listSubscriptionsByTopic(topicArn, nextToken, callBack)
* listTopics(nextToken, callBack)
* publish(topicArn, message, subject, messageStructure, callBack)
* removePermission(topicArn, label, callBack)
* setTopicAttributes(topicArn, attributeName, attributeValue, callBack)
* subscribe(topicArn, protocol, endpoint, callBack)
* unsubscribe(subscriptionArn, callBack)

(Ends)
