var fmt = require('fmt');
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var ImportExport = awssum.load('amazon/importexport').ImportExport;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var ie = new ImportExport({
    'accessKeyId'     : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    'region'          : amazon.US_EAST_1
});

console.log( 'Region :', ie.region() );
console.log( 'EndPoint :',  ie.host() );
console.log( 'AccessKeyId :', ie.accessKeyId().substr(0,3) + '...' );
console.log( 'SecretAccessKey :', ie.secretAccessKey().substr(0,3) + '...' );

ie.ListJobs(function(err, data) {
    console.log("\nlisting jobs - expecting success");
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});
