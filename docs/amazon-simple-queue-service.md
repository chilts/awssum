Amazon Simple Queue Service
===========================

Quick Example:

    var amazon = require("../lib/amazon");
    var sqsService = require("../lib/sqs");

    var sqs = new sqsService.Sqs(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

    sqs.sendMessage('my-queue', 'Hello, World!', function(err, data) {
        if ( err ) {
            console.log('Error :', err);
            return;
        }

        console.log('Ok :', data);
    });

Operations
==========

The Simple Queue Service is 80% implemented, and consists of the following operations:

* changeMessageVisibility(queueName, receiptHandle, visibilityTimeout, callBack)
* createQueue(queueName, defaultVisibilityTimeout, callBack)
* deleteMessage(queueName, receiptHandle, callBack)
* deleteQueue(queueName, callBack)
* getQueueAttributes(queueName, attribute, callBack)
* listQueues(queueNamePrefix, callBack)
* receiveMessage(queueName, attribute, maxNumberOfMessages, visibilityTimeout, callBack)
* sendMessage(queueName, messageBody, callBack)
* setQueueAttributes(queueName, options, callBack)

We still need to implement addPermission() and removePermission().

(Ends)
