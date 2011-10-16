NodeJS client libraries for talking to lots of Web Service APIs
===============================================================

How to get it
-------------

The easiest way to get it is via [npm][]

    npm install irc

If you want to run the latest version (i.e. later than the version available
via [npm][]) you can clone this repo, then use [npm][] to link-install it:

    npm link /path/to/your/clone

Of course, you can just clone this, and manually point at the library itself,
but I really recommend using [npm][]!

What services does 'node-awssum' talk to?
-----------------------------------------

Currently this library can talk to:

* AWS SimpleDB

In future releases we will be targeting (in no particular order):

* AWS Simple Email Service (SES)
* AWS Simple Queue Service (SQS)
* AWS Simple Notification Service (SNS)
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

How to use it
-------------

This library provides basic client functionality to each of these services. It's pretty simple but it's also quite
powerful. You can use this library in your programs and applications, but it can also be built on for more
user-friendly (from the perspective of the programmer) wrapper libraries.

As a quick example, to create a domain in AWS SimpleDB:

    var amazon = require("../lib/amazon");
    var simpledb = require("../lib/simpledb");

    var sdb = new simpledb.SimpleDB('key', 'secret', amazon.US_WEST_1);

    sdb.createDomain('test', function(err, data) {
        console.log('Error :', err);
        console.log('Data  :', data);
    });

A successful run outputs:

    Error : null
    Data  : { ok: true }

A non-successful run results in a true error value, just like any other idiomatic NodeJS. :)

Events
------

ToDo.: The library can also emit events (coming soon).

[npm]: http://github.com/isaacs/npm
-
