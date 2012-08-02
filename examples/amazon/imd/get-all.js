var inspect = require('eyes').inspector();
var awssum = require('awssum');
var Imd = awssum.load('amazon/imd').Imd;

var imd = new Imd();

imd.Get(function(err, data) {
    console.log("\ngetting metadata - expecting failure (no Category given)");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

imd.Get({}, function(err, data) {
    console.log("\ngetting metadata - expecting failure (no Category given)");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

imd.Get({ Version : 'latest', Category : '/' }, function(err, data) {
    console.log("\ngetting metadata - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

imd.Get({ Version : 'latest', Category : '/meta-data/' }, function(err, data) {
    console.log("\ngetting metadata - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
