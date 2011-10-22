Amazon SimpleDB
===============

Quick Example:

    var amazon = require("../lib/amazon");
    var simpledb = require("../lib/simpledb");

    var sdb = new simpledb.SimpleDB(accessKeyId, secretAccessKey, awsAccountId, amazon.US_EAST_1);

    sdb.listDomains(undefined, function(err, data) {
        if ( err ) {
            console.log('Error :', err);
            return;
        }

        console.log('Ok :', data);
    });

Operations
==========

The SimpleDB is 100% implemented (as at 2011-10-23), and consists of the following operations:

* createDomain(domainName, callBack)
* deleteAttributes(domainName, itemName, data, callBack)
* deleteDomain(domainName, callBack)
* domainMetadata(domainName, callBack)
* getAttributes(domainName, itemName, attr, consistentRead, callBack)
* listDomains(options, callBack)
* putAttributes(domainName, itemName, data, callBack)
* select(selectExpression, consistentRead, nextToken, callBack)

(Ends)
