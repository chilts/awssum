var fmt = require('fmt');
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
    fmt.dump(err, 'Error');
    fmt.dump(data, 'Data');
});
