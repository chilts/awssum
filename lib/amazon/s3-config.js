// --------------------------------------------------------------------------------------------------------------------
//
// s3-config.js - class for AWS Simple Storage Service
//
// Copyright (c) 2011 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

var data2xml = require('data2xml');

// --------------------------------------------------------------------------------------------------------------------

function hostBucket(options, args) {
    var self = this;
    return args.BucketName + '.' + self.host();
}

function bodyLocationConstraint(options, args) {
    var self = this;

    if ( !self.locationConstraint() ) {
        return '';
    }

    // create the data
    var data = {
        _attr : { 'xmlns' : 'http://s3.amazonaws.com/doc/2006-03-01/' },
        LocationConstraint : self.locationConstraint(),
    };

    return data2xml('CreateBucketConfiguration', data);
}

function bodyAccessControlPolicy(options, args) {
    var self = this;

    // create the data
    var data = {
        _attr : { 'xmlns' : 'http://s3.amazonaws.com/doc/2006-03-01/' },
    };

    if ( args.OwnerId || args.DisplayName ) {
        data.Owner = {};
        if ( args.OwnerId ) {
            data.Owner.ID = args.OwnerId;
        }
        if ( args.DisplayName ) {
            data.Owner.DisplayName = args.DisplayName;
        }
    }

    if ( args.GranteeId || args.GranteeDisplayName || args.Permission ) {
        data.AccessControlList = {};
        if ( args.GranteeId || args.GranteeDisplayName ) {
            data.AccessControlList.Grant = {};
            data.AccessControlList.Grant.Grantee = {
                _attr : {
                    'xmlns:xsi' : 'http://www.w3.org/2001/XMLSchema-instance',
                    'xsi:type'  : 'CanonicalUser',
                },
            };
            if ( args.GranteeId ) {
                data.AccessControlList.Grant.Grantee.ID = args.GranteeId;
            }
            if ( args.GranteeDisplayName ) {
                data.AccessControlList.Grant.Grantee.DisplayName = args.GranteeDisplayName;
            }
        }
        if ( args.Permission ) {
            data.AccessControlList.Permission = args.Permission;
        }
    }

    return data2xml('AccessControlPolicy', data);
}

function bodyPolicy(options, args) {
    var self = this;
    return JSON.stringify(args.BucketPolicy);
}

function bodyBucketLoggingStatus(options, args) {
    var self = this;

    // create the data
    var data = {
        _attr : { 'xmlns' : 'http://s3.amazonaws.com/doc/2006-03-01/' },
    };

    // required
    if ( args.TargetBucket ) {
        data.LoggingEnabled = data.LoggingEnabled || {};
        data.LoggingEnabled.TargetBucket = args.TargetBucket;
    }

    // optional
    if ( args.TargetPrefix ) {
        data.LoggingEnabled = data.LoggingEnabled || {};
        data.LoggingEnabled.TargetPrefix = args.TargetPrefix;
    }

    // set the initial hierarchy
    data.LoggingEnabled = {
        Grant : {
            Grantee : {
                _attr : {
                    'xmlns:xsi' : 'http://www.w3.org/2001/XMLSchema-instance'
                },
            },
        },
    };

    // optional
    if ( args.GranteeId ) {
        data.LoggingEnabled.TargetGrants.Grant.Grantee._attr['xsi:type'] = "CanonicalUser";
        data.LoggingEnabled.TargetGrants.Grant.Grantee.ID = args.GranteeId;
    }
    else if ( args.EmailAddress ) {
        data.LoggingEnabled.TargetGrants.Grant.Grantee._attr['xsi:type'] = "AmazonCustomerByEmail";
        data.LoggingEnabled.TargetGrants.Grant.Grantee.EmailAddress = args.EmailAddress;
    }
    else if ( args.Uri ) {
        data.LoggingEnabled.TargetGrants.Grant.Grantee._attr['xsi:type'] = "Group";
        data.LoggingEnabled.TargetGrants.Grant.Grantee.URI = args.Uri;
    };

    if ( args.Permission ) {
        data.LoggingEnabled.TargetGrants.Grant.Permission = args.Permission;
    }

    return data2xml('BucketLoggingStatus', data);
}

function bodyNotificationConfiguration(options, args) {
    var self = this;

    // create the data
    var data = {
        _attr : { 'xmlns' : 'http://s3.amazonaws.com/doc/2006-03-01/' },
    };

    if ( args.Topic ) {
        data.TopicConfiguration = data.TopicConfiguration || {};
        data.TopicConfiguration.Topic = args.Topic;
    }

    if ( args.Event ) {
        data.TopicConfiguration = data.TopicConfiguration || {};
        data.TopicConfiguration.Event = args.Event;
    }

    return data2xml('NotificationConfiguration', data);
}

function bodyRequestPaymentConfiguration(options, args) {
    var self = this;

    // create the data
    var data = {
        _attr : { 'xmlns' : 'http://s3.amazonaws.com/doc/2006-03-01/' },
        Payer : args.Payer,
    };

    return data2xml('RequestPaymentConfiguration', data);
}

function bodyVersioningConfiguration(options, args) {
    var self = this;

    // create the data
    var data = {
        _attr : { 'xmlns' : 'http://s3.amazonaws.com/doc/2006-03-01/' },
    };

    if ( args.Status ) {
        data.Status = args.Status;
    }

    if ( args.MfaDelete ) {
        data.MfaDelete = args.MfaDelete;
    }

    return data2xml('VersioningConfiguration', data);
}

function bodyWebsiteConfiguration(options, args) {
    var self = this;

    // create the data
    var data = {
        _attr : { 'xmlns' : 'http://s3.amazonaws.com/doc/2006-03-01/' },
        IndexDocument : {
            Suffix : args.IndexDocument,
        }
    };

    if ( args.ErrorDocument ) {
        data.ErrorDocument = {};
        data.ErrorDocument.Key = args.ErrorDocument;
    }

    return data2xml('WebsiteConfiguration', data);
}

// --------------------------------------------------------------------------------------------------------------------

// From: http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTServiceOps.html
//
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTServiceGET.html
//
// From: http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketOps.html
//
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketDELETE.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketDELETEpolicy.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketDELETEwebsite.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGET.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETacl.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETpolicy.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETlocation.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETlogging.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETnotification.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETVersion.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTrequestPaymentGET.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETversioningStatus.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketGETwebsite.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/mpUploadListMPUpload.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUT.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUTacl.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUTpolicy.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUTlogging.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUTnotification.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTrequestPaymentPUT.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUTVersioningStatus.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTBucketPUTwebsite.html
//
// From: http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectOps.html
//
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectDELETE.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/multiobjectdeleteapi.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectGET.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectGETacl.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectGETtorrent.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectHEAD.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectPOST.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectPUT.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectPUTacl.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/RESTObjectCOPY.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/mpUploadInitiate.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/mpUploadUploadPart.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/mpUploadUploadPartCopy.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/mpUploadComplete.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/mpUploadAbort.html
// * http://docs.amazonwebservices.com/AmazonS3/latest/API/mpUploadListParts.html

module.exports = {

    // Operations on the Service

    ListBuckets : {
        // nothing!
    },

    // Operations on Buckets

    DeleteBucket : {
        method : 'DELETE',
        host   : hostBucket,
    },

    DeleteBucketPolicy : {
        method : 'DELETE',
        host   : hostBucket,
        defaults : {
            policy : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            policy : {
                required : true,
                type     : 'resource',
            },
        },
    },

    DeleteBucketWebsite : {
        method : 'DELETE',
        host   : hostBucket,
        defaults : {
            website : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            website : {
                required : true,
                type     : 'resource',
            },
        },
    },

    ListObjects : {
        host : hostBucket,
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            Delimiter : {
                name     : 'delimiter',
                required : false,
                type     : 'param',
            },
            Marker : {
                name     : 'marker',
                required : false,
                type     : 'param',
            },
            MaxKeys : {
                name     : 'max-keys',
                required : false,
                type     : 'param',
            },
            Prefix : {
                name     : 'prefix',
                required : false,
                type     : 'param',
            },
        },
    },

    GetBucketAcl : {
        host : hostBucket,
        defaults : {
            acl : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            acl : {
                required : true,
                type     : 'resource',
            },
        },
    },

    GetBucketPolicy : {
        host : hostBucket,
        defaults : {
            policy : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            policy : {
                required : true,
                type     : 'resource',
            },
        },
    },

    GetBucketLocation : {
        host : hostBucket,
        defaults : {
            location : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            location : {
                required : true,
                type     : 'resource',
            },
        },
    },

    GetBucketLogging : {
        host : hostBucket,
        defaults : {
            logging : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            logging : {
                required : true,
                type     : 'resource',
            },
        },
    },

    GetBucketNotification : {
        host : hostBucket,
        defaults : {
            notification : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            notification : {
                required : true,
                type     : 'resource',
            },
        },
    },

    GetBucketObjectVersions : {
        host : hostBucket,
        defaults : {
            versions : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            versions : {
                required : true,
                type     : 'resource',
            },
        },
    },

    GetBucketRequestPayment : {
        host : hostBucket,
        defaults : {
            requestPayment : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            requestPayment : {
                required : true,
                type     : 'resource',
            },
        },
    },

    GetBucketVersioning : {
        host : hostBucket,
        defaults : {
            versioning : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            versioning : {
                required : true,
                type     : 'resource',
            },
        },
    },

    GetBucketWebsite : {
        host : hostBucket,
        defaults : {
            website : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            website : {
                required : true,
                type     : 'resource',
            },
        },
    },

    ListMultipartUploads : {
        host : hostBucket,
        defaults : {
            uploads : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            uploads : {
                required : true,
                type     : 'resource',
            },
        },
    },

    CreateBucket : {
        method : 'PUT',
        host : hostBucket,
        defaults : {
            LocationConstraint : function(args) { this.region(); }
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            Acl : {
                name     : 'x-amz-acl',
                required : false,
                type     : 'header',
            },
        },
        body : bodyLocationConstraint,
    },

    PutBucketAcl : {
        method : 'PUT',
        host : hostBucket,
        defaults : {
            acl : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            acl : {
                required : true,
                type     : 'resource',
            },
            OwnerId : {
                required : true,
                type     : 'special',
            },
        },
        body : bodyAccessControlPolicy,
    },

    PutBucketPolicy : {
        method : 'PUT',
        host : hostBucket,
        defaults : {
            policy : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            policy : {
                required : true,
                type     : 'resource',
            },
            BucketPolicy : {
                required : true,
                type     : 'special',
            },
        },
        body : bodyPolicy,
    },

    PutBucketLogging : {
        method : 'PUT',
        host : hostBucket,
        defaults : {
            logging : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            logging : {
                required : true,
                type     : 'resource',
            },
            EmailAddress : {
                required : false,
                type     : 'special',
            },
            GranteeEmail : {
                required : false,
                type     : 'special',
            },
            Uri : {
                required : false,
                type     : 'special',
            },
            Permission : {
                required : false,
                type     : 'special',
            },
            TargetBucket : {
                required : false,
                type     : 'special',
            },
            TargetPrefix : {
                required : false,
                type     : 'special',
            },
        },
        body : bodyBucketLoggingStatus,
    },

    PutBucketNotification : {
        method : 'PUT',
        host : hostBucket,
        defaults : {
            logging : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            logging : {
                required : true,
                type     : 'resource',
            },
            Topic : {
                required : false,
                type     : 'special',
            },
            Event : {
                required : false,
                type     : 'special',
            },
        },
        body : bodyNotificationConfiguration,
    },

    PutBucketRequestPayment : {
        method : 'PUT',
        host : hostBucket,
        defaults : {
            logging : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            logging : {
                required : true,
                type     : 'resource',
            },
            Payer : {
                required : true,
                type     : 'special',
            },
        },
        body : bodyRequestPaymentConfiguration,
    },

    PutBucketVersioning : {
        method : 'PUT',
        host : hostBucket,
        defaults : {
            versioning : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            versioning : {
                required : true,
                type     : 'resource',
            },
            Status : {
                required : false,
                type     : 'special',
            },
            MfaDelete : {
                required : false,
                type     : 'special',
            },
        },
        body : bodyVersioningConfiguration,
    },

    PutBucketWebsite : {
        method : 'PUT',
        host : hostBucket,
        defaults : {
            website : undefined,
        },
        args : {
            BucketName : {
                required : true,
                type     : 'special',
            },
            website : {
                required : true,
                type     : 'resource',
            },
            IndexDocument : {
                required : true,
                type     : 'special',
            },
            ErrorDocument : {
                required : false,
                type     : 'special',
            },
        },
        extractBody : 'none',
        body : bodyWebsiteConfiguration,
    },

    // Operations on Objects

};

// --------------------------------------------------------------------------------------------------------------------
