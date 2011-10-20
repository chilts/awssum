Example Programs
================

All example programs are named with the form:

    <company>-<service>-<operation>.js

For example:

    amazon-sqs-send-message.js

Each and every program is a standalone example of just one operation on that service. This also means that some
redundant code is at the top of each and every program which could have been put into a library, but I decided not to
do this since I wanted each example to be standalone and self-contained.

A Warning!!!
------------

Firstly a warning ... in general you should _not_ run these programs directly, since they _may_ be destructive in your
own environment. Also note that I am not guaranteeing them to work in your environment either. They are just _example_
programs which you can learn from.

On the other hand ... if you _want_ to run them directly, read on ...

I (chilts) can run all of these programs without modification, since with things like S3, I own the buckets that are
being created (bucket names are unique within that region across all users). You may have to change the bucket names in
these programs to make them work correctly with your account.

On the other hand, with other services such as SQS, you can have a queue name which is the same as me, therefore you
_should_ be able to run all of these programs without modification. However, I'm not guaranteeing this and in reality
these programs are just examples (do you get the idea yet?). :)

To Run them Yourself
--------------------

To run them yourself, take a look in the set-env.sh file and set the environment variables to be your own
credentials. In a production system I wouldn't recommend using env vars, but for these example programs it makes it
nice and easy. (As a hint, you should probably have a config file with your credentials in it which can be read by your
programs, but presumably not be able to be written to.)

(Ends)
