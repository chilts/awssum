// --------------------------------------------------------------------------------------------------------------------
//
// fps-config.js - config for Amazon DynamoDB
//
// Copyright (c) 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

var _ = require('underscore');

// --------------------------------------------------------------------------------------------------------------------

// This list from: http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/AllAPIs.html
//
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/Cancel.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/CancelToken.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/FundPrepaid.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/GetAccountActivity.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/GetAccountBalance.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/GetDebtBalance.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/GetOutstandingDebtBalance.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/GetPrepaidBalance.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/GetRecipientVerificationStatus.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/GetTokens.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/GetTokensByCaller.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/GetTokenUsage.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/GetTotalPrepaidLiability.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/GetTransaction.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/GetTransactionStatus.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/Pay.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/Refund.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/Reserve.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/Settle.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/SettleDebt.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/VerifySignatureAPI.html
// * http://docs.amazonwebservices.com/AmazonFPS/latest/FPSAPIReference/WriteOffDebt.html

var required = {
    'required' : true,
    'type'     : 'param',
};

var optional = {
    'required' : false,
    'type'     : 'param',
};

module.exports = {

    Cancel : {
        defaults : {
            Action : 'Cancel',
        },
        args : {
            Action         : required,
            Description    : optional,
            OverrideIpnUrl : optional,
            TransactionId  : required,
        },
    },

    CancelToken : {
        defaults : {
            Action : 'CancelToken',
        },
        args : {
            Action         : required,
            OverrideIpnUrl : optional,
            ReasonText     : optional,
            TokenId        : required,
        },
    },

    FundPrepaid : {
        defaults : {
            Action : 'FundPrepaid',
        },
        args : {
            Action                              : required,
            CallerDescription                   : optional,
            CallerReference                     : required,
            'DescriptorPolicy.CSOwner'            : optional,
            'DescriptorPolicy.SoftDescriptorType' : optional,
            'FundingAmount.CurrencyCode'          : required,
            'FundingAmount.Value'                 : required,
            OverrideIPNURL                      : optional,
            PrepaidInstrumentId                 : required,
            SenderDescription                   : optional,
            SenderTokenId                       : required,
            TransactionTimeoutInMins            : optional

        },
    },

    GetTokens : {
        defaults : {
            Action : 'GetTokens',
        },
        args : {
            Action          : required,
            CallerReference : optional,
            TokenStatus     : optional,
            TokenType       : optional,
        },
    },

};

// --------------------------------------------------------------------------------------------------------------------
