// --------------------------------------------------------------------------------------------------------------------
//
// importexport-config.js - config for AWS Import/Export
//
// Copyright (c) 2011, 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// From: http://docs.amazonwebservices.com/AWSImportExport/latest/DG/WebCommands.html
//
// * http://docs.amazonwebservices.com/AWSImportExport/latest/DG/WebCancelJob.html
// * http://docs.amazonwebservices.com/AWSImportExport/latest/DG/WebCreateJob.html
// * http://docs.amazonwebservices.com/AWSImportExport/latest/DG/WebGetStatus.html
// * http://docs.amazonwebservices.com/AWSImportExport/latest/DG/WebListJobs.html
// * http://docs.amazonwebservices.com/AWSImportExport/latest/DG/WebUpdateJob.html

var required = { required : true,  type : 'param'       };
var optional = { required : false, type : 'param'       };

module.exports = {

    CancelJob : {
        defaults : {
            Action : 'CancelJob',
        },
        args : {
            Action : required,
            JobId  : required,
        },
    },

    CreateJob : {
        defaults : {
            Action : 'CreateJob',
        },
        args : {
            Action       : required,
            JobType      : required,
            Manifest     : required,
            ValidateOnly : optional,
        },
    },

    GetStatus : {
        defaults : {
            Action : 'GetStatus',
        },
        args : {
            Action : required,
            JobId  : required,
        },
    },

    ListJobs : {
        defaults : {
            Action : 'ListJobs',
        },
        args : {
            Action  : required,
            Marker  : optional,
            MaxJobs : optional,
        },
    },

    UpdateJob : {
        defaults : {
            Action : 'UpdateJob',
        },
        args : {
            Action   : required,
            JobId    : required,
            JobType  : required,
            Manifest : required,
        },
    },

};

// --------------------------------------------------------------------------------------------------------------------
