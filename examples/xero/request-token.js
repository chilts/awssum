var inspect = require('eyes').inspector();
var awssum = require('awssum');
var oauth = awssum.load('oauth');
var xeroService = awssum.load('xero/xero');

var env = process.env;
var consumerKey = process.env.XERO_CONSUMER_KEY;
var consumerSecret = process.env.XERO_CONSUMER_SECRET;

var xero = new xeroService(consumerKey, consumerSecret);

console.log( 'OAuthConsumerKey :', xero.oauthConsumerKey() );
console.log( 'OAuthConsumerSecret :',  xero.oauthConsumerSecret() );

xero.RequestToken({ 'oauth_callback' : 'oob' }, function(err, data) {
    console.log("\nrequesting token - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
