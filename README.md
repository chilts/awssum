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

NodeJS module to aid talking to Web Service APIs. Requires plugins.

IRC : Come and say hello in #awssum on Freenode. :)

# AwsSum v1 - Redesign #

The initial version of AwsSum was a large install which carried many providers and services. Instead, ```AwsSum``` now
has a plugin architecture.

To use AwsSum, you will need to install a plugin to be able to talk to that service. This package is intended only for
other developers to depend on, not for end-users. :)

## Usage ##

To use an AwsSum plugin, you need to install the plugin you need for the relevant service. Please follow the
documentation for that plugin.

## Plugins ##

If you have written a plugin for AwsSum, please fork this repo and add it here:

* [Amazon](https://github.com/awssum/awssum-amazon)
    * [IAm](https://github.com/awssum/awssum-amazon-iam/)
    * [AutoScaling](https://github.com/awssum/awssum-amazon-autoscaling/)
    * [IMd](https://github.com/awssum/awssum-amazon-imd/)
    * [CloudFormation](https://github.com/awssum/awssum-amazon-cloudformation/)
    * [ImportExport](https://github.com/awssum/awssum-amazon-importexport/)
    * [CloudFront](https://github.com/awssum/awssum-amazon-cloudfront/)
    * [RDS](https://github.com/awssum/awssum-amazon-rds/)
    * [CloudSearch](https://github.com/awssum/awssum-amazon-cloudsearch/)
    * [CloudWatch](https://github.com/awssum/awssum-amazon-cloudwatch/)
    * [Route53](https://github.com/awssum/awssum-amazon-route53/)
    * [DynamoDB](https://github.com/awssum/awssum-amazon-dynamodb/)
    * [S3](https://github.com/awssum/awssum-amazon-s3/)
    * [EC2](https://github.com/awssum/awssum-amazon-ec2/)
    * [SES](https://github.com/awssum/awssum-amazon-ses/)
    * [ElastiCache](https://github.com/awssum/awssum-amazon-elasticache/)
    * [SimpleDB](https://github.com/awssum/awssum-amazon-simpledb/)
    * [ElasticBeanstalk](https://github.com/awssum/awssum-amazon-elasticbeanstalk/)
    * [SNS](https://github.com/awssum/awssum-amazon-sns/)
    * [ELB](https://github.com/awssum/awssum-amazon-elb/)
    * [SQS](https://github.com/awssum/awssum-amazon-sqs/)
    * [EMR](https://github.com/awssum/awssum-amazon-emr/)
    * [StorageGateway](https://github.com/awssum/awssum-amazon-storagegateway/)
    * [FPS](https://github.com/awssum/awssum-amazon-fps/)
    * [STS](https://github.com/awssum/awssum-amazon-sts/)
    * [Glacier](https://github.com/awssum/awssum-amazon-glacier/)
    * [SWF](https://github.com/awssum/awssum-amazon-swf/)

Coming soon:

* [Amazon](https://github.com/awssum/awssum-amazon)
    * [RedShift](https://github.com/awssum/awssum-amazon-redshift/)

## Writing a Plugin ##

The first thing to realise when writing a plugin is that each service is provided by a provider. In the case of Amazon
S3, Amazon is the provider and S3 is the service. For Twitter, since they only provide one service, then the provider
would be named 'twitter' and you'd probably use the same name for the service.

In general then, you'd write two plugins with the following names:

* awssum-&lt;provider&gt; - e.g. awssum-amazon, awssum-twitter
* awssum-&lt;provider&gt;-&lt;service&gt; - e.g. awssum-amazon-s3, awssum-twitter-twitter

For other examples, you might write ```awssum-openstack```, ```awssum-openstack-nova``` and ```awssum-openstack-keystone```.

Once the provider plugin exists, new services for that provider just need the ```awssum-<provider>-<service>``` to be
written. e.g. ```awssum-openstack-swift```.

### peerDependencies ###

Please also note to use ```peerDependencies``` in your ```package.json``` and depend on the correct version of
AwsSum. Your ```awssum-<provider>``` package should peer depend on AwsSum and your ```awssum-<provider>-<service>```
package should peer depend on your ```awssum-<provider>``` package. I hope this makes sense. :)

# Author #

Written by [Andrew Chilton](http://chilts.org/) - [Blog](http://chilts.org/blog/) -
[Twitter](https://twitter.com/andychilton).

# License #

* [Copyright 2011-2013 Apps Attic Ltd.  All rights reserved.](http://appsattic.mit-license.org/2011/)
* [Copyright 2013 Andrew Chilton.  All rights reserved.](http://chilts.mit-license.org/2013/)

(Ends)


