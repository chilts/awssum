var inspect = require('eyes').inspector();
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var Swf = awssum.load('amazon/swf').Swf;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var swf = new Swf({
    'accessKeyId' : accessKeyId,
    'secretAccessKey' : secretAccessKey,
    'region' : amazon.US_EAST_1
});

console.log( 'Region :', swf.region() );
console.log( 'EndPoint :',  swf.host() );
console.log( 'AccessKeyId :', swf.accessKeyId() );
// console.log( 'SecretAccessKey :', swf.secretAccessKey() );
console.log( 'AwsAccountId :', swf.awsAccountId() );

var args1 = {
    'RegistrationStatus' : 'REGISTERED',
};
swf.ListDomains(args1, function(err, data) {
    console.log("\nlisting all REGISTERED domains - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

var args2 = {
    'Domain'             : 'test',
    'RegistrationStatus' : 'REGISTERED',
};
swf.ListActivityTypes(args2, function(err, data) {
    console.log("\nlisting activity types - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

var args3 = {
    'Domain' : 'test',
    'StartTimeFilter' : {
        'oldestDate' : 1325376070,
        'latestDate' : 1356998399,
    },
};
swf.ListOpenWorkflowExecutions(args3, function(err, data) {
    console.log("\nlisting open workflow executions - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

var args4 = {
    'Domain' : 'test',
    'StartTimeFilter' : {
        'oldestDate' : 1325376070,
        'latestDate' : 1356998399,
    },
};
swf.ListClosedWorkflowExecutions(args4, function(err, data) {
    console.log("\nlisting closed workflow executions - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
