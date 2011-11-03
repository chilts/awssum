NodeJS client libraries for talking to lots of Web Service APIs

# How to get it

The easiest way to get it is via [npm][]

``` bash
    $ npm install irc
```

If you want to run the latest version (i.e. later than the version available
via [npm][]) you can clone this repo, then use [npm][] to link-install it:

``` bash
    $ npm link /path/to/your/clone
```

Of course, you can just clone this, and manually point at the library itself,
but I really recommend using [npm][]!

# What services does 'node-awssum' talk to?

Currently this library can talk to:

* AWS SimpleDB
* AWS Simple Queue Service (SQS)
* AWS Simple Notification Service (SNS)

In future releases we will be targeting (in no particular order):

* AWS Simple Email Service (SES)
* AWS Elastic Compute Cloud (EC2)
* AWS Simple Storage Service (S3)
* AWS Relational Database Service (RDS)
* AWS ElastiCache
* AWS CloudFront
* AWS Route53
* AWS Flexible Payments Service (FPS)
* RackspaceCloud Servers
* RackspaceCloud Files
* RackspaceCloud LoadBalances
* RackspaceCloud DNS
* Flickr
* PayPal
* Xero
* maybe some Google services, but I'm not sure yet

# What 'node-awssum' is?

node-awssum is an abstraction layer to many web service APIs. It abstracts out the service endpoints, the HTTP verbs to
use, what headers and parameters to set, how to sign the request and finally how to decode the result. It let's you
pass a data structure in and get a data structure out.

# What 'node-awssum' isn't?

node-awssum isn't the kind of library you would use directly in your applications. You _could_ use it here and there,
but the data structures it uses isn't very user friendly. In saying this, all of the libraries make every web service
_more_ user friendly, but you probably want something even easier.

# Example of what node-awssum is and what node-awssum isn't

Example 1. This is what node-awssum looks like when adding a topic to Amazon's Simple Notification Service:

``` js
    sns.createTopic({ topicName : 'my-topic' })
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

# What is 'node-awssum' for?

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

# How to use it

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
    var amazon = require("../lib/amazon");
    var simpledb = require("../lib/simpledb");

    var sdb = new simpledb.SimpleDB('key', 'secret', amazon.US_WEST_1);

    sdb.createDomain('test', function(err, data) {
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

# Author

Written by [Andrew Chilton](http://www.chilts.org/blog/)

Copyright 2011 [AppsAttic](http://www.appsattic.com/)
