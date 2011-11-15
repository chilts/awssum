var util = require('util');
var amazon = require("amazon/amazon");
var sesService = require("amazon/ses");

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var ses = new sesService.Ses(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

console.log( 'Region :', ses.region() );
console.log( 'EndPoint :',  ses.host() );
console.log( 'AccessKeyId :', ses.accessKeyId() );
// console.log( 'SecretAccessKey :', ses.secretAccessKey() );
console.log( 'AwsAccountId :', ses.awsAccountId() );

var data = {
    to : [
        'you@example.net',
    ],
    text : 'This is the text body',
    html : '<p>This is the HTML body</p>',
    subject : 'This is the subject',
    source : 'me@example.org',
};

ses.sendEmail(data, function(err, data) {
    console.log("\nsending an email - expecting success");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
