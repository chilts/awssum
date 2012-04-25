var inspect = require('eyes').inspector();
var commander = require('commander');
var awssum = require('awssum');
var oauth = awssum.load('oauth');
var twitterService = awssum.load('twitter/twitter');

var env = process.env;
var consumerKey = process.env.TWITTER_CONSUMER_KEY;
var consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
var token = process.env.TWITTER_TOKEN;
var tokenSecret = process.env.TWITTER_TOKEN_SECRET;
var verifier = process.env.TWITTER_VERIFIER;

var twitter = new twitterService.Twitter(consumerKey, consumerSecret);
twitter.setToken(token);
twitter.setTokenSecret(tokenSecret);

console.log( 'ConsumerKey    :', twitter.consumerKey()    );
console.log( 'ConsumerSecret :', twitter.consumerSecret() );
console.log( 'Token          :', twitter.token()          );
console.log( 'TokenSecret    :', twitter.tokenSecret()    );

commander.prompt('Enter your verification code : ', function(verifier) {
    twitter.GetToken({ OAuthVerifier : verifier }, function(err, data) {
        console.log("\ngetting token - expecting success");
        inspect(err, 'Error');
        inspect(data, 'Data');
    });
});
