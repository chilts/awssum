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

var openExecutions = {
    'Domain' : 'test',
    'StartTimeFilter' :  {
        'oldestDate' : 1325376070,
        'latestDate' : 1356998399,
    },
};
swf.CountOpenWorkflowExecutions(openExecutions, function(err, data) {
    console.log("\ncount open workflow executions - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

var closedExecutions = {
    'Domain' : 'test',
};
swf.CountClosedWorkflowExecutions(closedExecutions, function(err, data) {
    console.log("\ncount closed workflow executions - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

var pendingActivities = {
    'Domain' : 'test',
    'TaskList' : {
        'name' : 'test'
    },
};
swf.CountPendingActivityTasks(pendingActivities, function(err, data) {
    console.log("\ncount pending activity tasks - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

var pendingDecisions = {
    'Domain' : 'test',
    'TaskList' : {
        'name' : 'test'
    },
};
swf.CountPendingDecisionTasks(pendingDecisions, function(err, data) {
    console.log("\ncount pending decision tasks - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
