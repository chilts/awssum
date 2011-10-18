var util = require("util");
var amazon = require("../lib/amazon");
var simpledb = require("../lib/simpledb");

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;

var sdb = new simpledb.SimpleDB(accessKeyId, secretAccessKey, amazon.US_WEST_1);

console.log( 'Region :', sdb.region() );
console.log( 'EndPoint :',  sdb.endPoint() );
console.log( 'AccessKeyId :', sdb.accessKeyId() );
console.log( 'SecretAccessKey :', sdb.secretAccessKey() );

sdb.getAttributes('test', 'chilts', undefined, false, function(err, data) {
    console.log("\nchilts");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

sdb.getAttributes('test', 'andychilton', undefined, false, function(err, data) {
    console.log("\nandychilton");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

sdb.getAttributes('test', 'replace', undefined, true, function(err, data) {
    console.log("\nreplace");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

sdb.getAttributes('test', 'expected', 'username', false, function(err, data) {
    console.log("\nexpected");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
