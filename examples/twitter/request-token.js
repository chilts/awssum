var inspect = require('eyes').inspector();
var awssum = require('awssum');
var oauth = awssum.load('oauth');
var twitterService = awssum.load('twitter/twitter');

var env = process.env;
var consumerKey = process.env.TWITTER_CONSUMER_KEY;
var consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
// don't need the token, tokenSecret or verifier

var twitter = new twitterService(consumerKey, consumerSecret);

console.log( 'ConsumerKey :', twitter.consumerKey() );
console.log( 'ConsumerSecret :',  twitter.consumerSecret() );

twitter.RequestToken({ 'OAuthCallback' : 'oob' }, function(err, data) {
    console.log("\nrequesting token - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');

    console.log( 'If you want to verify this token, visit: '
                 + twitter.protocol() + '://' + twitter.authorizeHost()
                 + twitter.authorizePath()
                 + '?oauth_token=' + data.Body.oauth_token
               );
});
