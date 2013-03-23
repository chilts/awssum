// ----------------------------------------------------------------------------

var tap = require("tap"),
    test = tap.test,
    plan = tap.plan;
var esc = require('../lib/esc.js');

var AwsSum = require('../awssum.js').AwsSum;

// ----------------------------------------------------------------------------

test(function(t) {
    var awssum = new AwsSum({});
    var http = new AwsSum({
        protocol : 'http',
    });
    var https = new AwsSum({
        protocol : 'https',
    });

    t.equal('https', awssum.protocol(), 'Default is https');
    t.equal('http', http.protocol(), 'http works fine');
    t.equal('https', https.protocol(), 'https works fine');
    t.end();
});

// ----------------------------------------------------------------------------
