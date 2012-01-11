// --------------------------------------------------------------------------------------------------------------------
//
// cloud-identity-config.js - class for Rackspace Cloud Identity
//
// Copyright (c) 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

var _ = require('underscore');
var data2xml = require('data2xml');
var crypto = require('crypto');

// --------------------------------------------------------------------------------------------------------------------

function bodyAuth(options, args) {
    var self = this;

    var body = {
        auth : {},
    };

    if ( self.type === 'password' ) {
        // password
        body.auth.passwordCredentials = {
            username : self.username,
            password : self.password,
        };
    }
    else {
        // apiKey
        body.auth['RAX-KSKEY:apiKeyCredentials'] = {
            username : self.username,
            apiKey   : self.apiKey,
        };
    }

    return JSON.stringify(body);
}

function headersAddAuthToken(options, args) {
    var self = this;
    options.headers['X-Auth-Token'] = self.authToken();
}

// --------------------------------------------------------------------------------------------------------------------

// From: http://docs.rackspace.com/auth/api/v2.0/auth-client-devguide/content/Client_Operations.html
//
// * http://docs.rackspace.com/auth/api/v2.0/auth-client-devguide/content/POST_authenticate_v2.0_tokens_Client_Operations.html
// * http://docs.rackspace.com/auth/api/v2.0/auth-client-devguide/content/GET_listTenants_v2.0_tenants_Client_Operations.html

module.exports = {

    // Client Operations

    Authenticate : {
        method : 'POST',
        path   : '/v2.0/tokens',
        body   : bodyAuth,
        statusCode : [ 200, 203 ],
    },

    GetTenants : {
        method    : 'GET',
        path      : '/v2.0/tenants',
        addExtras : headersAddAuthToken,
    },

};

// --------------------------------------------------------------------------------------------------------------------
