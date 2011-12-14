var inspect = require('eyes').inspector();
var amazon = require("amazon/amazon");
var elastiCacheService = require("amazon/elasticache");

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var elastiCache = new elastiCacheService.ElastiCache(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', elastiCache.region() );
console.log( 'EndPoint :',  elastiCache.host() );
console.log( 'AccessKeyId :', elastiCache.accessKeyId() );
// console.log( 'SecretAccessKey :', elastiCache.secretAccessKey() );
console.log( 'AwsAccountId :', elastiCache.awsAccountId() );

elastiCache.DescribeCacheClusters(function(err, data) {
    console.log("\ndescribing cache clusters - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
