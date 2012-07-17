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

module.exports = {

    GetTokens : {
        defaults : {
            Action : 'GetTokens',
        },
        args : {
            Action : {
                required : true,
                type     : 'param',
            },
            CallerReference : {
                required : false,
                type     : 'param',
            },
            TokenStatus : {
                required : false,
                type     : 'param',
            },
            TokenType : {
                required : false,
                type     : 'param',
            },
        },
    },

};

// --------------------------------------------------------------------------------------------------------------------
