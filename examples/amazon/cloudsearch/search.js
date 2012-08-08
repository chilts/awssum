var inspect = require('eyes').inspector();
var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var SearchService = awssum.load('amazon/cloudsearch').SearchService;

var ss = new SearchService({
    domainName : 'test',
    domainId   : 'cjbekamwcb3coo6y4ulvgiithy',
});

var opts = {
    q : 'ian'
};

ss.Search(opts, function(err, data) {
    console.log("\nsearching for something - expecting success");
    inspect(err, 'Error');
    inspect(data, 'Data');
});
