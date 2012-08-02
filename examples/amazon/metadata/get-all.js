var inspect = require('eyes').inspector();
var awssum = require('awssum');
var MetaData = awssum.load('amazon/metadata').MetaData;

var env = process.env;
var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var awsAccountId = process.env.AWS_ACCOUNT_ID;

var md = new MetaData();

md.Get(function(err, data) {
    console.log("\ngetting metadata - expecting failure (no Category given)");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

md.Get({}, function(err, data) {
    console.log("\ngetting metadata - expecting failure (no Category given)");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

md.Get({ Version : 'latest', Category : '/' }, function(err, data) {
    console.log("\ngetting metadata - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});

md.Get({ Version : 'latest', Category : '/meta-data/' }, function(err, data) {
    console.log("\ngetting metadata - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
