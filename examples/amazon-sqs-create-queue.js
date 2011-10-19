var amazon = require("../lib/amazon");
var sqs = require("../lib/sqs");

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;

var sqs = new sqs.Sqs(accessKeyId, secretAccessKey, amazon.US_EAST_1);

console.log( 'Region :', sqs.region() );
console.log( 'EndPoint :',  sqs.endPoint() );
console.log( 'AccessKeyId :', sqs.accessKeyId() );
console.log( 'SecretAccessKey :', sqs.secretAccessKey() );

sqs.createQueue('my-queue', undefined, function(err, data) {
    console.log("\nCreating (my-queue, undefined) - expecting success");
    console.log('Error :', err);
    console.log('Data  :', data);
});

sqs.createQueue('my-queue', 20, function(err, data) {
    console.log("\nCreating (my-queue, 20) - expecting failure");
    console.log('Error :', err);
    console.log('Data  :', data);
});
