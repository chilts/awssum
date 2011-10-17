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
    username : 'chilts',
    url : 'http://www.chilts.org/blog/'
};

var user2 = [
    { name : 'username', value : 'andychilton' },
    { name : 'url',      value : 'http://www.chilts.org/blog/' }
];

var user3 = [
    { name : 'username', value : 'replace',                     replace : false },
    { name : 'url',      value : 'http://www.chilts.org/blog/', replace : true  }
];

sdb.putAttributes('test', 'chilts', user1, function(err, data) {
    console.log('Error :', err);
    console.log('Data  :', data);
});

sdb.putAttributes('test', 'andychilton', user2, function(err, data) {
    console.log('Error :', err);
    console.log('Data  :', data);
});

sdb.putAttributes('test', 'replace', user3, function(err, data) {
    console.log('Error :', err);
    console.log('Data  :', data);
});
