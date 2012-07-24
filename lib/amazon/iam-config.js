// --------------------------------------------------------------------------------------------------------------------
//
// iam-config.js - class for AWS Identity and Access Management
//
// Copyright (c) 2011, 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// From: http://docs.amazonwebservices.com/IAM/latest/APIReference/API_Operations.html
//
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_AddRoleToInstanceProfile.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_AddUserToGroup.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_ChangePassword.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_CreateAccessKey.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_CreateAccountAlias.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_CreateGroup.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_CreateInstanceProfile.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_CreateLoginProfile.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_CreateRole.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_CreateUser.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_CreateVirtualMFADevice.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_DeactivateMFADevice.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_DeleteAccessKey.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_DeleteAccountAlias.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_DeleteAccountPasswordPolicy.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_DeleteGroup.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_DeleteGroupPolicy.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_DeleteInstanceProfile.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_DeleteLoginProfile.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_DeleteRole.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_DeleteRolePolicy.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_DeleteServerCertificate.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_DeleteSigningCertificate.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_DeleteUser.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_DeleteUserPolicy.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_DeleteVirtualMFADevice.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_EnableMFADevice.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_GetAccountPasswordPolicy.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_GetAccountSummary.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_GetGroup.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_GetGroupPolicy.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_GetInstanceProfile.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_GetLoginProfile.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_GetRole.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_GetRolePolicy.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_GetServerCertificate.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_GetUser.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_GetUserPolicy.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_ListAccessKeys.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_ListAccountAliases.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_ListGroupPolicies.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_ListGroups.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_ListGroupsForUser.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_ListInstanceProfiles.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_ListInstanceProfilesForRole.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_ListMFADevices.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_ListRolePolicies.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_ListRoles.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_ListServerCertificates.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_ListSigningCertificates.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_ListUserPolicies.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_ListUsers.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_ListVirtualMFADevices.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_PutGroupPolicy.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_PutRolePolicy.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_PutUserPolicy.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_RemoveRoleFromInstanceProfile.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_RemoveUserFromGroup.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_ResyncMFADevice.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_UpdateAccessKey.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_UpdateAccountPasswordPolicy.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_UpdateAssumeRolePolicy.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_UpdateGroup.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_UpdateLoginProfile.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_UpdateServerCertificate.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_UpdateSigningCertificate.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_UpdateUser.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_UploadServerCertificate.html
// * http://docs.amazonwebservices.com/IAM/latest/APIReference/API_UploadSigningCertificate.html

var required      = { required : true,  type : 'param'       };
var optional      = { required : false, type : 'param'       };
var requiredArray = { required : true,  type : 'param-array' };
var optionalArray = { required : false, type : 'param-array' };
var requiredData  = { required : false, type : 'param-data'  };
var optionalData  = { required : false, type : 'param-data'  };

module.exports = {

    GetAccountSummary : {
        defaults : {
            Action : 'GetAccountSummary'
        },
        args : {
            Action : required,
        },
    },

};

// --------------------------------------------------------------------------------------------------------------------
