// ---------------------------------------------------------
//
// s3-streaming.js - test for streaming uploads to s3
//
// Copyright (c) 2012 Nathan Friedly - http://nfriedly.com
//
// License: http://opensource.org/licenses/MIT
//
// ---------------------------------------------------------


var tap = require("tap"),
	_ = require('underscore'),
	test = tap.test,
	plan = tap.plan;
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
