var inspect = require('eyes').inspector();
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var CloudSearch = awssum.load('amazon/cloudsearch').CloudSearch;

var env             = process.env;
var accessKeyId     = env.ACCESS_KEY_ID;
var secretAccessKey = env.SECRET_ACCESS_KEY;
var awsAccountId    = env.AWS_ACCOUNT_ID;

var cs = new CloudSearch({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    // 'awsAccountId'    : awsAccountId, // optional
});

console.log( 'Region :',          cs.region() );
console.log( 'EndPoint :',        cs.host() );
console.log( 'AccessKeyId :',     cs.accessKeyId().substr(0, 3) + '...' );
console.log( 'SecretAccessKey :', cs.secretAccessKey().substr(0, 3) + '...' );
console.log( 'AwsAccountId :',    cs.awsAccountId() );

var opts = {
    DomainName : 'test',
};

cs.DeleteDomain(opts, function(err, data) {
    console.log("\ncreating a domain - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
