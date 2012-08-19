var fmt = require('fmt');
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var ElasticBeanstalk = awssum.load('amazon/elasticbeanstalk').ElasticBeanstalk;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var eb = new ElasticBeanstalk({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    'region'          : amazon.US_EAST_1,
});

console.log( 'Region :',          eb.region() );
console.log( 'EndPoint :',        eb.host() );
console.log( 'AccessKeyId :',     eb.accessKeyId() );
console.log( 'SecretAccessKey :', eb.secretAccessKey().substr(0, 3) + '...' );

eb.ListAvailableSolutionStacks(function(err, data) {
    console.log("\nlisting available solution stacks - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});
