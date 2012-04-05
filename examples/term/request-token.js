var inspect = require('eyes').inspector();
var awssum = require('awssum');
var oauth = awssum.load('oauth');
var termService = awssum.load('term/term');

var env = process.env;
var consumerKey = process.env.TERM_CONSUMER_KEY;
var consumerSecret = process.env.TERM_CONSUMER_SECRET;

var term = new termService(consumerKey, consumerSecret);

console.log( 'OAuthConsumerKey :', term.oauthConsumerKey() );
console.log( 'OAuthConsumerSecret :',  term.oauthConsumerSecret() );

term.RequestToken({ 'oauth_callback' : 'oob' }, function(err, data) {
    console.log("\nrequesting token - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
