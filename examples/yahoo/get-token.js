var fmt = require('fmt');
var commander = require('commander');
var awssum = require('awssum');
var oauth = awssum.load('oauth');
var yahooService = awssum.load('yahoo/yahoo');

var env = process.env;
var consumerKey = process.env.YAHOO_CONSUMER_KEY;
var consumerSecret = process.env.YAHOO_CONSUMER_SECRET;
var token = process.env.YAHOO_TOKEN;
var tokenSecret = process.env.YAHOO_TOKEN_SECRET;
var verifier = process.env.YAHOO_VERIFIER;

var yahoo = new yahooService.Yahoo({
    'consumerKey'    : consumerKey,
    'consumerSecret' : consumerSecret
});

yahoo.setToken(token);
yahoo.setTokenSecret(tokenSecret);

fmt.field('ConsumerKey', yahoo.consumerKey()    );
fmt.field('ConsumerSecret', yahoo.consumerSecret() );
fmt.field('Token', yahoo.token()          );
fmt.field('TokenSecret', yahoo.tokenSecret()    );

commander.prompt('Enter your verification code : ', function(verifier) {
    yahoo.GetToken({ OAuthVerifier : verifier }, function(err, data) {
        fmt.msg("getting token - expecting success");
        fmt.dump(err, 'Error');
        fmt.dump(data, 'Data');
    });
});
