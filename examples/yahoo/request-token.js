var inspect = require('eyes').inspector();
var awssum = require('awssum');
var oauth = awssum.load('oauth');
var yahooService = awssum.load('yahoo/yahoo');

var env = process.env;
var consumerKey = process.env.YAHOO_CONSUMER_KEY;
var consumerSecret = process.env.YAHOO_CONSUMER_SECRET;

var yahoo = new yahooService(consumerKey, consumerSecret);

console.log( 'OAuthConsumerKey :', yahoo.oauthConsumerKey() );
console.log( 'OAuthConsumerSecret :',  yahoo.oauthConsumerSecret() );

// oauth_callback is required for Yahoo!
yahoo.RequestToken({ 'oauth_callback' : 'oob' }, function(err, data) {
    console.log("\nrequesting token - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
