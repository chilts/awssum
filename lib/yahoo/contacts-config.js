// --------------------------------------------------------------------------------------------------------------------
//
// contacts-config.js - Contacts API for Yahoo!
//
// Copyright (c) 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// requires
// none

function pathGetContacts(args, opts) {
    // console.log('/' + this.version() + '/user/' + this.yahooGuid() + '/contacts');
    return '/' + this.version() + '/user/' + this.yahooGuid() + '/contacts';
}

// --------------------------------------------------------------------------------------------------------------------

module.exports = {

    GetContacts : {
        // request
        path : pathGetContacts,
        // response
        extractBodyWhenError : 'xml',
    }

};

// --------------------------------------------------------------------------------------------------------------------
