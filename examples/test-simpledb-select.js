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

sdb.select('SELECT username FROM test', undefined, undefined, function(err, data) {
    console.log("\nSELECT username FROM test");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});

sdb.select('SELECT * FROM test', undefined, undefined, function(err, data) {
    console.log("\nSELECT * FROM test");
    console.log('Error :', util.inspect(err, true, null));
    console.log('Data :', util.inspect(data, true, null));
});
