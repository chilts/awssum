var fmt = require('fmt');
var commander = require('commander');
var awssum = require('awssum');
var oauth = awssum.load('oauth');
var Twitter = awssum.load('twitter/twitter').Twitter;

var env = process.env;
var consumerKey = process.env.TWITTER_CONSUMER_KEY;
var consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
var token = process.env.TWITTER_TOKEN;
var tokenSecret = process.env.TWITTER_TOKEN_SECRET;
var verifier = process.env.TWITTER_VERIFIER;

var twitter = new Twitter({
    'consumerKey'    : consumerKey,
    'consumerSecret' : consumerSecret
});

twitter.setToken(token);
twitter.setTokenSecret(tokenSecret);

fmt.field('ConsumerKey', twitter.consumerKey()    );
fmt.field('ConsumerSecret', twitter.consumerSecret() );
fmt.field('Token', twitter.token()          );
fmt.field('TokenSecret', twitter.tokenSecret()    );

commander.prompt('Enter your verification code : ', function(verifier) {
    twitter.GetToken({ OAuthVerifier : verifier }, function(err, data) {
        fmt.msg("getting token - expecting success");
        fmt.dump(err, 'Error');
        fmt.dump(data, 'Data');
    });
});
