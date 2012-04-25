var inspect = require('eyes').inspector();
var awssum = require('awssum');
var oauth = awssum.load('oauth');
var tumblrService = awssum.load('tumblr/tumblr');

var env = process.env;
var consumerKey = process.env.TUMBLR_CONSUMER_KEY;
var consumerSecret = process.env.TUMBLR_CONSUMER_SECRET;

var tumblr = new tumblrService.Tumblr(consumerKey, consumerSecret);

console.log( 'OAuthConsumerKey :', tumblr.oauthConsumerKey() );
console.log( 'OAuthConsumerSecret :',  tumblr.oauthConsumerSecret() );

tumblr.RequestToken({ 'oauth_callback' : 'oob' }, function(err, data) {
    console.log("\nrequesting token - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
