var inspect = require('eyes').inspector({ maxLength : 0 });
var awssum = require('awssum');
var identityService = awssum.load('rackspace/cloud-identity');

var env = process.env;
var username = env.RACKSPACE_USERNAME;
var apiKey = env.RACKSPACE_API_KEY;
var region = env.RACKSPACE_REGION;

console.log( 'username :',  username );
// console.log( 'apiKey :', apiKey );
console.log( 'region :', region );

var identity = new identityService({
    username : username,
    apiKey : apiKey,
    region : region,
});

// this request requires no further options
identity.Authenticate(function(err, data) {
    console.log("\ngetting an authentication token - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
