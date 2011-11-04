var util = require('util');
var amazon = require("amazon");
var route53 = require("route53");

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var r53 = new route53.Route53(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', r53.region() );
console.log( 'EndPoint :',  r53.host() );
console.log( 'AccessKeyId :', r53.accessKeyId() );
// console.log( 'SecretAccessKey :', r53.secretAccessKey() );
console.log( 'AwsAccountId :', r53.awsAccountId() );

var args = {
    hostedZoneId : 'Z1M9K5TI9KRBF2',
    comment : 'This change does ... blah, blah, blah!',
    changes : [
        {
            action : 'DELETE',
            name : 'www.example.com',
            type : 'A',
            ttl : '600',
            resourceRecords : [
                '192.0.2.1',
            ],
        },
        {
            action : 'CREATE',
            name : 'www.example.com',
            type : 'A',
            ttl : '300',
            resourceRecords : [
                '192.0.2.1',
            ],
        },
    ]
};

r53.changeResourceRecordSets(args, function(err, data) {
    console.log("\nchanging resource record sets - expecting failure (probably need a new callerReference)");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
