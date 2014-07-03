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
        path : '/somepath',
        port : 8080
    });
    var https = new AwsSum({
        protocol : 'https',
        path : '/somepath',
        port : 8443
    });

    t.equal('https', awssum.protocol(), 'Default is https');
    t.equal('http', http.protocol(), 'http works fine');
    t.equal('https', https.protocol(), 'https works fine');

    t.equal(443, awssum.port(), 'Default is 443');
    t.equal(8080, http.port(), 'http port works fine');
    t.equal(8443, https.port(), 'https port works fine');

    t.equal('/', awssum.path(), 'Default is "/"');
    t.equal('/somepath', http.path(), 'http path works fine');
    t.equal('/somepath', https.path(), 'https path works fine');

    t.end();
});

// ----------------------------------------------------------------------------
