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
// don't need the verifier

var twitter = new Twitter({
    'consumerKey'    : consumerKey,
    'consumerSecret' : consumerSecret
});

twitter.setToken(token);
twitter.setTokenSecret(tokenSecret);

fmt.field('ConsumerKey', twitter.consumerKey()                          );
fmt.field('ConsumerSecret', twitter.consumerSecret().substr(0, 3) + '...'  );
fmt.field('Token', twitter.token()                                );
fmt.field('TokenSecret', twitter.tokenSecret().substr(0, 3) + '...'     );

var data = {
    screen_name : 'andychilton'
};

twitter.GetUsersProfileImage(data, function(err, data) {
    fmt.msg('\ncalling users/profile_image/:screen_name - expecting success');
    fmt.dump(err, 'Err');
    fmt.dump(data, 'Data');
});

data.size = 'bigger';
twitter.GetUsersProfileImage(data, function(err, data) {
    fmt.msg('\ncalling users/profile_image/:screen_name - expecting success');
    fmt.dump(err, 'Err');
    fmt.dump(data, 'Data');
});
