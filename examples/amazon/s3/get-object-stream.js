// ----------------------------------------------------------------------------
var fs = require('fs');

var fmt = require('fmt');
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var S3 = awssum.load('amazon/s3').S3;

var env             = process.env;
var accessKeyId     = env.ACCESS_KEY_ID;
var secretAccessKey = env.SECRET_ACCESS_KEY;
var awsAccountId    = env.AWS_ACCOUNT_ID;

var s3 = new S3({
    'accessKeyId' : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    'region' : amazon.US_EAST_1
});

// ----------------------------------------------------------------------------

fmt.field('Region', s3.region() );
fmt.field('EndPoint', s3.host() );
fmt.field('AccessKeyId', s3.accessKeyId().substr(0, 3) + '...' );
fmt.field('SecretAccessKey', s3.secretAccessKey().substr(0, 3) + '...' );
fmt.field('AwsAccountId', s3.awsAccountId() );

// ----------------------------------------------------------------------------

var options1 = {
    BucketName : 'pie-18',
    ObjectName : 'test-object.txt',
};

s3.GetObject(options1, { stream : true }, function(err, data) {
    fmt.msg("getting an object from pie-18 - expecting success");

    if (err) {
        fmt.dump(err.Headers, 'Error');
        // you could do something with err.Stream here
        return;
    }

    fmt.dump(data.StatusCode, 'Data.StatusCode');
    fmt.dump(data.Headers, 'Data.Headers');

    // open a file to stream this response to
    var writeStream1 = fs.createWriteStream('/tmp/test-object.txt');

    data.Stream.on('data', function(chunk) {
        console.log('got a chunk of data for test-object.txt:');
        console.log(chunk);
    });

    data.Stream.on('end', function(chunk) {
        console.log('end emitted for test-object.txt');
    });

    data.Stream.on('close', function(chunk) {
        console.log('close emitted for test-object.txt');
    });

    data.Stream.on('error', function(chunk) {
        console.log('error emitted for test-object.txt');
    });

    // pipe the data into a file
    data.Stream.pipe(writeStream1);
});

// ----------------------------------------------------------------------------

var options2 = {
    BucketName : 'pie-18',
    ObjectName : 'object-does-not-exist.txt',
};

s3.GetObject(options2, { stream : true }, function(err, data) {
    fmt.msg("getting an object from pie-18 - expecting failure");

    if (err) {
        fmt.dump(err.Headers, 'Error');
        // you could do something with err.Stream here
        return;
    }

    fmt.dump(data.StatusCode, 'Data.StatusCode');
    fmt.dump(data.Headers, 'Data.Headers');

    // open a file to stream this response to
    var writeStream2 = fs.createWriteStream('/tmp/object-does-not-exist.txt');

    data.Stream.on('data', function(chunk) {
        console.log('got a chunk of data for object-does-not-exist.txt:');
        console.log(chunk);
    });

    data.Stream.on('end', function(chunk) {
        console.log('end emitted for object-does-not-exist.txt');
    });

    data.Stream.on('close', function(chunk) {
        console.log('close emitted for object-does-not-exist.txt');
    });

    data.Stream.on('error', function(chunk) {
        console.log('error emitted for object-does-not-exist.txt');
    });

    // pipe the data into a file
    data.Stream.pipe(writeStream2);
});

// ----------------------------------------------------------------------------
