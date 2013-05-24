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

<table>
  <thead>
    <th>Provider</th>
    <th>Service</th>
    <th>Plugin</th>
  </thead>
  <tbody>
    <tr>
      <td>Amazon</td>
      <td>Identity and Access Management</td>
      <td><a href="https://github.com/awssum/awssum-amazon-iam/">awssum-amazon-iam</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>AutoScaling</td>
      <td><a href="https://github.com/awssum/awssum-amazon-autoscaling/">awssum-amazon-autoscaling</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>Instance MetaData</td>
      <td><a href="https://github.com/awssum/awssum-amazon-imd/">awssum-amazon-imd</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>CloudFormation</td>
      <td><a href="https://github.com/awssum/awssum-amazon-cloudformation/">awssum-amazon-cloudformation</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>Import Export</td>
      <td><a href="https://github.com/awssum/awssum-amazon-importexport/">awssum-amazon-importexport</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>CloudFront</td>
      <td><a href="https://github.com/awssum/awssum-amazon-cloudfront/">awssum-amazon-cloudfront</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>Relational Database Service</td>
      <td><a href="https://github.com/awssum/awssum-amazon-rds/">awssum-amazon-rds</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>CloudSearch</td>
      <td><a href="https://github.com/awssum/awssum-amazon-cloudsearch/">awssum-amazon-cloudsearch</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>CloudWatch</td>
      <td><a href="https://github.com/awssum/awssum-amazon-cloudwatch/">awssum-amazon-cloudwatch</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>Route53</td>
      <td><a href="https://github.com/awssum/awssum-amazon-route53/">awssum-amazon-route53</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>DynamoDB</td>
      <td><a href="https://github.com/awssum/awssum-amazon-dynamodb/">awssum-amazon-dynamodb</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>Simple Storage Service</td>
      <td><a href="https://github.com/awssum/awssum-amazon-s3/">awssum-amazon-s3</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>Elastic Compute Cloud</td>
      <td><a href="https://github.com/awssum/awssum-amazon-ec2/">awssum-amazon-ec2</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>Simple Email Service</td>
      <td><a href="https://github.com/awssum/awssum-amazon-ses/">awssum-amazon-ses</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>ElastiCache</td>
      <td><a href="https://github.com/awssum/awssum-amazon-elasticache/">awssum-amazon-elasticache</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>SimpleDB</td>
      <td><a href="https://github.com/awssum/awssum-amazon-simpledb/">awssum-amazon-simpledb</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>ElasticBeanstalk</td>
      <td><a href="https://github.com/awssum/awssum-amazon-elasticbeanstalk/">awssum-amazon-elasticbeanstalk</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>Simple Notification Service</td>
      <td><a href="https://github.com/awssum/awssum-amazon-sns/">awssum-amazon-sns</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>Elastic LoadBalancer</td>
      <td><a href="https://github.com/awssum/awssum-amazon-elb/">awssum-amazon-elb</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>Simple Queue Service</td>
      <td><a href="https://github.com/awssum/awssum-amazon-sqs/">awssum-amazon-sqs</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>Elastic MapReduce</td>
      <td><a href="https://github.com/awssum/awssum-amazon-emr/">awssum-amazon-emr</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>StorageGateway</td>
      <td><a href="https://github.com/awssum/awssum-amazon-storagegateway/">awssum-amazon-storagegateway</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>Flexible Payments Service</td>
      <td><a href="https://github.com/awssum/awssum-amazon-fps/">awssum-amazon-fps</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>Security Token Service</td>
      <td><a href="https://github.com/awssum/awssum-amazon-sts/">awssum-amazon-sts</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>Glacier</td>
      <td><a href="https://github.com/awssum/awssum-amazon-glacier/">awssum-amazon-glacier</a></td>
    </tr>
    <tr>
      <td>Amazon</td>
      <td>Simple WorkFlow</td>
      <td><a href="https://github.com/awssum/awssum-amazon-swf/">awssum-amazon-swf</a></td>
    </tr>
  </tbody>
</table>

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


