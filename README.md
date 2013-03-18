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

The initial version of AwsSum was a large install which carried many providers and services. Instead, the 'awssum'
package is now the infrastructure which all other plugins can use.

## Usage ##

To use AwsSum, you need to install an AwsSum plugin for the service you wish to provide (see the following
list). Please follow the documentation for that plugin to be able to use the service. This package is for other
developers to use, not for end-users. :)

## Existing Plugins ##

If you have written a plugin for AwsSum, please fork this repo and add it here (in alphabetical order):

* [Amazon](https://github.com/awssum/awssum-amazon)
    * [DynamoDB](https://github.com/awssum/awssum-amazon-dynamodb)
    * [S3](https://github.com/awssum/awssum-amazon-s3)

(Note: currently, the new version of AwsSum is under development so this list will be filled out once AwsSum v1 is
complete.)

## Writing a Plugin ##

The first thing to realise when writing a plugin is that each service is provided by a provider. In the case of Amazon
S3, Amazon is the provider and S3 is the service. For Twitter, since they only provide one service, then the provider
would be named 'twitter' and you'd probably use the same name for the service.

In general then, you'd write two plugins with the following names:

* awssum-&lt;provider&gt; - e.g. awssum-amazon, awssum-twitter
* awssum-&lt;provider&gt;-&lt;service&gt; - e.g. awssum-amazon-s3, twitter-twitter

For other examples, you might write ```awssum-openstack```, ```awssum-openstack-nova``` and
```awssum-openstack-ketstone```.

This is good if in the future you want to write a new service for a provider, you only have to write the plugin for the
new service. e.g. ```awssum-openstack-swift```.

### peerDependencies ###

Please also note to use ```peerDependencies``` in your ```package.json``` and depend on the correct version of
AwsSum. Your ```awssum-<provider>``` package should peer depend on AwsSum and your ```awssum-<provider>-<service>```
package should peer depend on your ```awssum-<provider>``` package. I hope this makes sense. :)

# Author #

Written by [Andrew Chilton](http://chilts.org/) - [Blog](http://chilts.org/blog/) -
[Twitter](https://twitter.com/andychilton).

# License #

* http://chilts.mit-license.org/2011/

(Ends)


