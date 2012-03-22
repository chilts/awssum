// ---------------------------------------------------------
//
// s3-streaming.js - test for streaming uploads to s3
//
// Copyright (c) 2012 Nathan Friedly - http://nfriedly.com
//
// License: http://opensource.org/licenses/MIT
//
// ---------------------------------------------------------

var http = require('http'),
	https = require('https'),
	fs = require('fs');
var test = require("tap").test;
var awssum = require('../'),
	amazon = awssum.load('amazon/amazon'),
	s3service = awssum.load('amazon/s3');

var options = {
	BucketName: "asdf",
	ObjectName: "asdf",
	ContentLength: 2,
	BodyStream: {on: function(){}, readable: true}
};

test("AwsSum.prototype.send accepts a request with a bodyStream instead of a body", function(t) {
	t.plan(1);
	var s3 = new s3service("key","secret","account_id",amazon.US_EAST_1);
	s3.request = function() { t.ok(true, "AweSum.prototype.request called"); }
	s3.putObject(options, function(err, data) {
		t.notOk(err, "putObject callback fired with error");
	});
});

// fake self-signed cert and private key
var SSL_CERT = "-----BEGIN CERTIFICATE-----\n" + 
"MIIBfDCCASYCCQDQ1TLT4mhJWDANBgkqhkiG9w0BAQUFADBFMQswCQYDVQQGEwJV\n" + 
"UzETMBEGA1UECBMKU29tZS1TdGF0ZTEhMB8GA1UEChMYSW50ZXJuZXQgV2lkZ2l0\n" + 
"cyBQdHkgTHRkMB4XDTEyMDMyMjA0NTAyN1oXDTEyMDQyMTA0NTAyN1owRTELMAkG\n" + 
"A1UEBhMCVVMxEzARBgNVBAgTClNvbWUtU3RhdGUxITAfBgNVBAoTGEludGVybmV0\n" + 
"IFdpZGdpdHMgUHR5IEx0ZDBcMA0GCSqGSIb3DQEBAQUAA0sAMEgCQQDGdrVT6h1o\n" + 
"gK5de1D/Ef391nlu10EO1WOw58N3HJnyrE0D4/q1AoFww0YV5pvRdiJSyxZeD2cl\n" + 
"+m9dfBnE2leDAgMBAAEwDQYJKoZIhvcNAQEFBQADQQBsaWZVQY2D/0jcRA7eZBA1\n" + 
"JUU/jVasS7RraRKE3VeSsxL8P4WCCk0jDeIcFzZsSYgqfG7wCwwMZGG315qE5m1S\n" + 
"-----END CERTIFICATE-----\n";

var SSL_KEY = "-----BEGIN RSA PRIVATE KEY-----\n" + 
"MIIBOwIBAAJBAMZ2tVPqHWiArl17UP8R/f3WeW7XQQ7VY7Dnw3ccmfKsTQPj+rUC\n" + 
"gXDDRhXmm9F2IlLLFl4PZyX6b118GcTaV4MCAwEAAQJAfxZfMVg28seMYMJp8Jyl\n" + 
"6Bmic08WExikmREgwzKmhpWbKK0Gx8xn3ZWjXPpdcKyA8J6p1rns0IQyDCZi+oZN\n" + 
"IQIhAPlXD5x7DEpa9bL1FItTstWQ2s4bS8luuT0aDAVNdYfxAiEAy8PDuXKFJzTz\n" + 
"63owC4gdb63zgzJpUGOfiTYOy74K6rMCIQCExpK+nlvOIJ/kG1REWV7LEWcjCDAU\n" + 
"ZQzpd7xc+oGS0QIgYKHuaDwPOZC7PKktr8pVa2krWsTFfQJB3mhsi+MMelECIQCi\n" + 
"YmwpCQIFgQeiZ4RBksM4BXwpqvKKKpwlLG7Ae9Sdrw==\n" + 
"-----END RSA PRIVATE KEY-----\n";

test("AwsSum.prototype.request properly streams body contents", function(t) {
	t.plan(2);

	// some "random" data
	var REQUEST_BODY = "adsf " + SSL_CERT + "asdf " + SSL_KEY + "asdf"; 

	var fakeServer = http.createServer(function(req, res) {
		AwsSum.prototype.request({
			host: localhost,
			port: 3101,
			path: "/",
			headers: {},
			bodyStream: req // http.ServerRequest is a Readable Stream
		});
	});
	fakeServer.listen(3100);
	var fakeS3 = https.createServer({key: SSL_KEY, cert: SSL_CERT}, function(req, res) {
		t.ok(true, "fake s3 server called");
		var data = ''; 
		req.on('data', function(chunk) {
			data += chunk.toString();
		});
		req.on('end', function() {
			t.ok(data == REQUEST_BODY, "Body was uploaded successfully");
		});
	});
	fakeRemoteServer.listen(3101);

	// create a request to the fakeServer so that it will create a Readable Stream 
	var fakeClient = http.request({
		host: "localhost",
		port: 3100,
		path: "/",
		method: "POST"
	});
	req.write(REQUEST_BODY);
	req.end();
});
