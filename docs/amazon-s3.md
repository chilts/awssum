Amazon Simple Storage Service
=============================

Quick Example:

    var amazon = require('../lib/amazon');
    var s3Service = require('../lib/s3');

    var s3 = new s3Service.S3('access_key', 'secret', '123-456-789', amazon.US_EAST_1);

    // create this bucket
    s3.createBucket('my-bucket', function(err, data) {
        if ( err ) {
            console.log('Error :', err);
            return;
        }

        console.log('Ok :', data);
    });

Operations
==========

The Simple Notification Service is 63% implemented as at 2011-10-28 (24 out of 38 operations done, 14 to do), and
consists of the following operations:

* listBuckets(data, callback)
* deleteBucket(options, callback)
* deleteBucketPolicy(options, callback)
* deleteBucketWebsite(options, callback)
* listObjects(options, callback)
* getBucketAcl(options, callback)
* getBucketPolicy(options, callback)
* getBucketLocation(options, callback)
* getBucketLogging(options, callback)
* getBucketNotification(options, callback)
* getBucketVersions(options, callback)
* getBucketRequestPayment(options, callback)
* getBucketVersioning(options, callback)
* getBucketWebsite(options, callback)
* listMultipartUploads(options, callback)
* createBucket(options, callback)
* putBucketWebsite(options, callback)
* deleteObject(options, callback)
* getObject(options, callback)
* getObjectAcl(options, callback)
* getObjectTorrent(options, callback)
* objectMetadata(options, callback)
* putObject(options, callback)
* copyObject(options, callback)

The following are yet to be implemented:

* putBucketAcl
* putBucketPolicy
* putBucketLogging
* putBucketNotification
* putBucketRequestPayment
* putBucketVersioning
* postObject (??? will this happen ???)
* putObjectAcl
* initiateMultipartUpload
* putObjectPart
* putObjectPartCopy
* completeObject
* abortObject

(Ends)
