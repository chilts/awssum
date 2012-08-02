var inspect = require('eyes').inspector();
var awssum = require('awssum');
var Imd = awssum.load('amazon/imd').Imd;

var imd = new MetaData();

imd.ListApiVersions(function(err, data) {
    console.log("\ngetting metadata - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
