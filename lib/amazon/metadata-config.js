// --------------------------------------------------------------------------------------------------------------------
//
// metadata-config.js - config for AWS Instance Metadata
//
// Copyright (c) 2011, 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

function path(options, args) {
    return '/' + args.Version + args.Category;
}

// --------------------------------------------------------------------------------------------------------------------

// From: http://docs.amazonwebservices.com/AWSEC2/latest/UserGuide/AESDG-chapter-instancedata.html

module.exports = {

    'ListApiVersions' : {
        // request
        'path' : '/',
        // response
        'extractBody' : 'blob',
    },

    'Get' : {
        // request
        'path' : path,
        'args' : {
            Category : {
                'required' : true,
                'type'     : 'special',
            },
            Version : {
                'required' : true,
                'type'     : 'special',
            },
        },
        // response
        'extractBody' : 'blob',
    },

};

// --------------------------------------------------------------------------------------------------------------------
