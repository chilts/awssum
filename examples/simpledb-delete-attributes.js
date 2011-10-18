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

var user1 = {
    username : 'chilts'
};

var user2 = [
    { name : 'url' }, // this one will be deleted
    { name : 'username', exists : true } // this one is a condition
];

sdb.deleteAttributes('test', 'chilts', user1, function(err, data) {
    console.log('chilts');
    console.log('Error :', err);
    console.log('Data  :', data);
});
