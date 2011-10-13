var simpledb = require("../lib/simpledb");

var sdb = new simpledb.SimpleDB('key', 'secret', 'us-west-1');

console.log( sdb.endPoint() );
