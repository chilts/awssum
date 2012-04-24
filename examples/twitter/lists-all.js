var inspect = require('eyes').inspector({ maxLength : 65536 });
var commander = require('commander');
var awssum = require('awssum');
var oauth = awssum.load('oauth');
var twitterService = awssum.load('twitter/twitter');

var env = process.env;
var consumerKey = process.env.TWITTER_CONSUMER_KEY;
var consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
var token = process.env.TWITTER_TOKEN;
var tokenSecret = process.env.TWITTER_TOKEN_SECRET;
// don't need the verifier

var twitter = new twitterService(consumerKey, consumerSecret);
twitter.setToken(token);
twitter.setTokenSecret(tokenSecret);

console.log( 'ConsumerKey    :', twitter.consumerKey()     );
console.log( 'ConsumerSecret :', twitter.consumerSecret() );
console.log( 'Token          :', twitter.token()          );
console.log( 'TokenSecret    :', twitter.tokenSecret()    );

// firstly, request a token
twitter.ListsAll({}, function(err, data) {
    console.log('\ncalling /lists/all - expecting success');
    inspect(err, 'Err');
    inspect(data, 'Data');
});
