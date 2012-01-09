```
                              _______           _______  _______           _______ 
                             (  ___  )|\     /|(  ____ \(  ____ \|\     /|(       )
                             | (   ) || )   ( || (    \/| (    \/| )   ( || () () |
                             | (___) || | _ | || (_____ | (_____ | |   | || || || |
                             |  ___  || |( )| |(_____  )(_____  )| |   | || |(_)| |
                             | (   ) || || || |      ) |      ) || |   | || |   | |
                             | )   ( || () () |/\____) |/\____) || (___) || )   ( |
                             |/     \|(_______)\_______)\_______)(_______)|/     \|
                                                                                   
```

NodeJS client libraries for talking to lots of Web Service APIs

Build Status : [![Build Status](https://secure.travis-ci.org/appsattic/node-awssum.png)](http://travis-ci.org/appsattic/node-awssum)

# How to get it #

The easiest way to get it is via [npm][]

``` bash
$ npm install awssum
```

Of course, you can just clone this, and manually point at the library itself,
but I really recommend using [npm][]!

# Synopsis #

```
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var s3Service = awssum.load('amazon/s3');

var s3 = new s3Service('access_key_id', 'secret_access_key', 'aws_account_id', amazon.US_WEST_1);

s3.ListBuckets(function(err, data) {
    console.log(data);
});

s3.CreateBucket({ BucketName : 'my-bucket' }, function(err, data) {
    if (err) {
        // ...
    }
    s3.PutObject({
        BucketName : 'my-bucket',
        ObjectName : 'some.txt',
        ContentLength : '14',
        Body          : "Hello, World!\n",
    }, function(err, data) {
        console.log(data)
    });
});

```

# What services does 'node-awssum' talk to? #

Currently this has 100% coverage of the following services:

* AWS:
    * SimpleDB
    * Simple Queue Service (SQS)
    * Simple Notification Service (SNS)
    * Simple Email Service (SES)
    * Simple Storage Service (S3)
    * Route53
    * ElastiCache
    * CloudFront
    * Elastic Load Balancing (ELB)

It has partial support for these services. This means that the complex signatures have been done, but not all
operations have been implemented:

* AWS:
    * Elastic Compute Cloud (EC2) ([Request or Sponsor Development][sponsor])

In future releases we will be targeting (in no particular order):

* AWS:
    * Relational Database Service (RDS) ([Request or Sponsor Development][sponsor])
    * Flexible Payments Service (FPS) ([Request or Sponsor Development][sponsor])
* RackspaceCloud:
    * Servers (In Progress)
    * Files (In Progress)
    * LoadBalances (In Progress)
    * DNS (In Progress)
* Flickr ([Request or Sponsor Development][sponsor])
* PayPal ([Request or Sponsor Development][sponsor])
* Xero ([Request or Sponsor Development][sponsor])
* some Google services ([Request or Sponsor Development][sponsor])
* URL shorteners ([Request or Sponsor Development][sponsor])
* anything else you'd like? ([Request or Sponsor Development][sponsor])

There are lots of services out there, so please [Request or Sponsor Development][sponsor] if you'd like one
implemented.

# What 'node-awssum' is? #

node-awssum is an abstraction layer to many web service APIs. It abstracts out the service endpoints, the HTTP verbs to
use, what headers and parameters to set, how to sign the request and finally how to decode the result. It let's you
pass a data structure in and get a data structure out. It also helps in the odd small way when dealing with complex
input such as creating XML (e.g. Amazon S3), JSON data structures (e.g. Amazon SQS) or parameters with lots of values
(e.g. Amazon SimpleDB).

In saying this, there are some web service operations that are inherently nasty and since node-awssum is essentially a
proxy to the operation itself it can't abstract away all nastiness.

For an example of where node-awssum helps is when creating a Bucket in Amazon S3. We take a single 'LocationConstraint'
parameter in the 'createBucket' call and node-awssum takes that and builds (the horrible) XML which it needs to send
with the request. This makes it much easier to perform calls to the various web services and their individual
operations since this simple notion is across all web services.

However, there are also examples of where node-awssum can't really help make the operation nicer. Many of the Amazon
Web Services return XML which we blindly convert to a data structure and return that to the caller. In these cases we
don't perform any kind of manipulation or conversion to a canonical structure to make the returned data nicer. In these
cases, a small library which sits on top of node-awssums libraries may be a good choice (see *winston-simpledb* for an
example of this - http://github.com/appsattic/winston-simpledb). This would be especially true for SimpleDB where the
higher level library could perform number padding, date conversions, creation of multi-field indexes and default field
values - none of which node-awssum does.

# Examples #

Example 1. This is what node-awssum looks like when adding a topic to Amazon's Simple Notification Service:

``` js
sns.CreateTopic({ TopicName : 'my-topic' })
=>  {
        CreateTopicResponse:
        {
            '@': {
                xmlns: 'http://sns.amazonaws.com/doc/2010-03-31/'
            },
            CreateTopicResult: {
                TopicArn: 'arn:aws:sns:us-east-1:616781752028:my-topic'
            },
            ResponseMetadata: {
                RequestId: '0928273f-fc34-11e0-945d-17a52825d3d9'
            }
        }
    }
```

What you would probably like to do is the following (with an example SNS Wrapper Library):

``` js
snsWrapperLibrary.createTopic('my-topic')
=>  arn:aws:sns:us-east-1:616781752028:my-topic
```

This is pretty easy to do but annoying to have to find and extract the information you really want. node-awssum comes
with some example libraries. :)

Example 2. Saving some attributes for AWS SimpleDB.

...

# What is 'node-awssum' for? #

This library has a number of uses but mostly it should be used from within a more friendly wrapper library. Let's look
at some examples.

Example 1: A SimpleDB Wrapper library. Since node-awssum doesn't do any kind of conversion of the values you want to
put into SimpleDB, it would make sense that you used a library which did those conversions for you, such as padding
integer values, normalising dates into an ISO string, setting defaults or helping with queries.

Example 2: When using Amazon Route53, you sometimes have to do a request, manipulate what you got back and then send a
new bit of data. Instead a wrapper library around node-awssum which just helps you add or delete resource records would
be much easier to use.

Example 3: A small wrapper around the Simple Queue Service means you could simply have some commands such as send(...),
receive() and delete() would make using the service a breeze.

The reason for this is because the data structures it receives, and more especially those it returns, are far too
complicated for dealing with them in your main program. Therefore in general, a wrapper library around these simple
operations would make each service easier to use.

# How to use it #

This library provides basic client functionality to each of these services. It's pretty simple but this means it's also
quite powerful. In general you wouldn't use these libraries directly (though there is nothing stopping you making the
odd call here and there, especially when setting your environment up) but instead you would use them via a more
friendly API via a wrapper library.

You can use this library in your programs and applications, but it can also be built on for more
user-friendly (from the perspective of the programmer) wrapper libraries.

Essentially it's a "data in, data out" kinda library without too many bells and whistles. It doesn't really check what
you pass it, apart from when a parameter is required. As I sa

As a quick example, to create a domain in AWS SimpleDB:

``` js
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var sdbService = awssum.load('amazon/simpledb');

var sdb = new sdbService('key', 'secret', amazon.US_WEST_1);

sdb.CreateDomain({ DomainName : 'test' }, function(err, data) {
    console.log('Error :', err);
    console.log('Data  :', data);
});
```

A successful run outputs:

``` js
Error : null
Data  : { ok: true }
```

A non-successful run results in a true error value, just like any other idiomatic NodeJS. :)

[npm]: http://github.com/isaacs/npm
[sponsor]: mailto:chilts%40appsattic.com

# Author #

Written by [Andrew Chilton](http://www.chilts.org/blog/)

Copyright 2011 [AppsAttic](http://www.appsattic.com/)

# License #

MIT. See LICENSE for more details.
