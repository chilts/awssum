var inspect = require('eyes').inspector();
var awssum = require('awssum');
var oauth = awssum.load('oauth');
var twitterService = awssum.load('twitter/twitter');

var env = process.env;
var consumerKey = process.env.TWITTER_CONSUMER_KEY;
var consumerSecret = process.env.TWITTER_CONSUMER_SECRET;

var twitter = new twitterService(consumerKey, consumerSecret);

console.log( 'OAuthConsumerKey :', twitter.oauthConsumerKey() );
console.log( 'OAuthConsumerSecret :',  twitter.oauthConsumerSecret() );

twitter.RequestToken({ 'oauth_callback' : 'oob' }, function(err, data) {
    console.log("\nrequesting token - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
