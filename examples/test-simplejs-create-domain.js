var amazon = require("../lib/amazon");
var simpledb = require("../lib/simpledb");

var sdb = new simpledb.SimpleDB('key', 'secret', amazon.US_WEST_1);

console.log( 'Region :', sdb.region() );
console.log( 'EndPoint :',  sdb.endPoint() );
console.log( 'AccessKeyId :', sdb.accessKeyId() );
console.log( 'SecretAccessKey :', sdb.secretAccessKey() );

sdb.createDomain('test', function(err, data) {
    console.log('Error :', err);
    console.log('Data  :', data);
});
