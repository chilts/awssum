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
var requiredJson  = { required : true,  type : 'param-json'  };
var optionalJson  = { required : false, type : 'param-json'  };

module.exports = {

    AddRoleToInstanceProfile : {
        defaults : {
            Action : 'AddRoleToInstanceProfile'
        },
        args : {
            Action              : required,
            InstanceProfileName : required,
            RoleName            : required,
        },
    },

    AddUserToGroup : {
        defaults : {
            Action : 'AddUserToGroup'
        },
        args : {
            Action    : required,
            GroupName : required,
            UserName  : required,
        },
    },

    ChangePassword : {
        defaults : {
            Action : 'ChangePassword'
        },
        args : {
            Action      : required,
            NewPassword : required,
            OldPassword : required,
        },
    },

    CreateAccessKey : {
        defaults : {
            Action : 'CreateAccessKey'
        },
        args : {
            Action   : required,
            UserName : optional,
        },
    },

    CreateAccountAlias : {
        defaults : {
            Action : 'CreateAccountAlias'
        },
        args : {
            Action       : required,
            AccountAlias : required,
        },
    },

    CreateGroup : {
        defaults : {
            Action : 'CreateGroup'
        },
        args : {
            Action    : required,
            GroupName : required,
            Path      : optional,
        },
    },

    CreateInstanceProfile : {
        defaults : {
            Action : 'CreateInstanceProfile'
        },
        args : {
            Action              : required,
            InstanceProfileName : required,
            Path                : optional,
        },
    },

    CreateLoginProfile : {
        defaults : {
            Action : 'CreateLoginProfile'
        },
        args : {
            Action   : required,
            Password : required,
            UserName : required,
        },
    },

    CreateRole : {
        defaults : {
            Action : 'CreateRole'
        },
        args : {
            Action                   : required,
            AssumeRolePolicyDocument : required,
            Path                     : optional,
            RoleName                 : required,
        },
    },

    CreateUser : {
        defaults : {
            Action : 'CreateUser'
        },
        args : {
            Action   : required,
            Path     : optional,
            UserName : required,
        },
    },

    CreateVirtualMFADevice : {
        defaults : {
            Action : 'CreateVirtualMFADevice'
        },
        args : {
            Action               : required,
            Path                 : optional,
            VirtualMFADeviceName : required,
        },
    },

    DeactivateMFADevice : {
        defaults : {
            Action : 'DeactivateMFADevice'
        },
        args : {
            Action       : required,
            SerialNumber : required,
            UserName     : required,
        },
    },

    DeleteAccessKey : {
        defaults : {
            Action : 'DeleteAccessKey'
        },
        args : {
            Action      : required,
            AccessKeyId : required,
            UserName    : optional,
        },
    },

    DeleteAccountAlias : {
        defaults : {
            Action : 'DeleteAccountAlias'
        },
        args : {
            Action       : required,
            AccountAlias : required,
        },
    },

    DeleteAccountPasswordPolicy : {
        defaults : {
            Action : 'DeleteAccountPasswordPolicy'
        },
        args : {
            Action : required,
        },
    },

    DeleteGroup : {
        defaults : {
            Action : 'DeleteGroup'
        },
        args : {
            Action    : required,
            GroupName : required,
        },
    },

    DeleteGroupPolicy : {
        defaults : {
            Action : 'DeleteGroupPolicy'
        },
        args : {
            Action     : required,
            GroupName  : required,
            PolicyName : required,
        },
    },

    DeleteInstanceProfile : {
        defaults : {
            Action : 'DeleteInstanceProfile'
        },
        args : {
            Action              : required,
            InstanceProfileName : required,
        },
    },

    DeleteLoginProfile : {
        defaults : {
            Action : 'DeleteLoginProfile'
        },
        args : {
            Action   : required,
            UserName : required,
        },
    },

    DeleteRole : {
        defaults : {
            Action : 'DeleteRole'
        },
        args : {
            Action   : required,
            RoleName : required,
        },
    },

    DeleteRolePolicy : {
        defaults : {
            Action : 'DeleteRolePolicy'
        },
        args : {
            Action     : required,
            PolicyName : required,
            RoleName   : required,
        },
    },

    DeleteServerCertificate : {
        defaults : {
            Action : 'DeleteServerCertificate'
        },
        args : {
            Action                : required,
            ServerCertificateName : required,
        },
    },

    DeleteSigningCertificate : {
        defaults : {
            Action : 'DeleteSigningCertificate'
        },
        args : {
            Action        : required,
            CertificateId : required,
            UserName      : required,
        },
    },

    DeleteUser : {
        defaults : {
            Action : 'DeleteUser'
        },
        args : {
            Action   : required,
            UserName : required,
        },
    },

    DeleteUserPolicy : {
        defaults : {
            Action : 'DeleteUserPolicy'
        },
        args : {
            Action     : required,
            PolicyName : required,
            UserName   : required,
        },
    },

    DeleteVirtualMFADevice : {
        defaults : {
            Action : 'DeleteVirtualMFADevice'
        },
        args : {
            Action       : required,
            SerialNumber : required,
        },
    },

    EnableMFADevice : {
        defaults : {
            Action : 'EnableMFADevice'
        },
        args : {
            Action              : required,
            AuthenticationCode1 : required,
            AuthenticationCode2 : required,
            SerialNumber        : required,
            UserName            : required,
        },
    },

    GetAccountPasswordPolicy : {
        defaults : {
            Action : 'GetAccountPasswordPolicy'
        },
        args : {
            Action : required,
        },
    },

    GetAccountSummary : {
        defaults : {
            Action : 'GetAccountSummary'
        },
        args : {
            Action : required,
        },
    },

    GetGroup : {
        defaults : {
            Action : 'GetGroup'
        },
        args : {
            Action    : required,
            GroupName : required,
            Marker    : optional,
            MaxItems  : optional,
        },
    },

    GetGroupPolicy : {
        defaults : {
            Action : 'GetGroupPolicy'
        },
        args : {
            Action     : required,
            GroupName  : required,
            PolicyName : required,
        },
    },

    GetInstanceProfile : {
        defaults : {
            Action : 'GetInstanceProfile'
        },
        args : {
            Action              : required,
            InstanceProfileName : required,
        },
    },

    GetLoginProfile : {
        defaults : {
            Action : 'GetLoginProfile'
        },
        args : {
            Action   : required,
            UserName : required,
        },
    },

    GetRole : {
        defaults : {
            Action : 'GetRole'
        },
        args : {
            Action   : required,
            RoleName : required,
        },
    },

    GetRolePolicy : {
        defaults : {
            Action : 'GetRolePolicy'
        },
        args : {
            Action     : required,
            PolicyName : required,
            RoleName   : required,
        },
    },

    GetServerCertificate : {
        defaults : {
            Action : 'GetServerCertificate'
        },
        args : {
            Action                : required,
            ServerCertificateName : required,
        },
    },

    GetUser : {
        defaults : {
            Action : 'GetUser'
        },
        args : {
            Action   : required,
            UserName : optional,
        },
    },

    GetUserPolicy : {
        defaults : {
            Action : 'GetUserPolicy'
        },
        args : {
            Action     : required,
            PolicyName : required,
            UserName   : required,
        },
    },

    ListAccessKeys : {
        defaults : {
            Action : 'ListAccessKeys'
        },
        args : {
            Action   : required,
            Marker   : optional,
            MaxItems : optional,
            UserName : optional,
        },
    },

    ListAccountAliases : {
        defaults : {
            Action : 'ListAccountAliases'
        },
        args : {
            Action   : required,
            Marker   : optional,
            MaxItems : optional,
        },
    },

    ListGroupPolicies : {
        defaults : {
            Action : 'ListGroupPolicies'
        },
        args : {
            Action    : required,
            GroupName : required,
            Marker    : optional,
            MaxItems  : optional,
        },
    },

    ListGroups : {
        defaults : {
            Action : 'ListGroups'
        },
        args : {
            Action     : required,
            Marker     : optional,
            MaxItems   : optional,
            PathPrefix : optional,
        },
    },

    ListGroupsForUser : {
        defaults : {
            Action : 'ListGroupsForUser'
        },
        args : {
            Action   : required,
            Marker   : optional,
            MaxItems : optional,
            UserName : optional,
        },
    },

    ListInstanceProfiles : {
        defaults : {
            Action : 'ListInstanceProfiles'
        },
        args : {
            Action     : required,
            Marker     : optional,
            MaxItems   : optional,
            PathPrefix : optional,
        },
    },

    ListInstanceProfilesForRole : {
        defaults : {
            Action : 'ListInstanceProfilesForRole'
        },
        args : {
            Action   : required,
            Marker   : optional,
            MaxItems : optional,
            RoleName : required,
        },
    },

    ListMFADevices : {
        defaults : {
            Action : 'ListMFADevices'
        },
        args : {
            Action   : required,
            Marker   : optional,
            MaxItems : optional,
            UserName : optional,
        },
    },

    ListRolePolicies : {
        defaults : {
            Action : 'ListRolePolicies'
        },
        args : {
            Action   : required,
            Marker   : optional,
            MaxItems : optional,
            RoleName : required,
        },
    },

    ListRoles : {
        defaults : {
            Action : 'ListRoles'
        },
        args : {
            Action     : required,
            Marker     : optional,
            MaxItems   : optional,
            PathPrefix : optional,
        },
    },

    ListServerCertificates : {
        defaults : {
            Action : 'ListServerCertificates'
        },
        args : {
            Action     : required,
            Marker     : optional,
            MaxItems   : optional,
            PathPrefix : optional,
        },
    },

    ListSigningCertificates : {
        defaults : {
            Action : 'ListSigningCertificates'
        },
        args : {
            Action   : required,
            Marker   : optional,
            MaxItems : optional,
            UserName : optional,
        },
    },

    ListUserPolicies : {
        defaults : {
            Action : 'ListUserPolicies'
        },
        args : {
            Action   : required,
            Marker   : optional,
            MaxItems : optional,
            UserName : optional,
        },
    },

    ListUsers : {
        defaults : {
            Action : 'ListUsers'
        },
        args : {
            Action     : required,
            Marker     : optional,
            MaxItems   : optional,
            PathPrefix : optional,
        },
    },

    ListVirtualMFADevices : {
        defaults : {
            Action : 'ListVirtualMFADevices'
        },
        args : {
            Action           : required,
            AssignmentStatus : optional,
            Marker           : optional,
            MaxItems         : optional,
        },
    },

    PutGroupPolicy : {
        method : 'POST', // see note saying that policy documents can be large
        defaults : {
            Action : 'PutGroupPolicy'
        },
        args : {
            Action         : required,
            GroupName      : required,
            PolicyDocument : requiredJson,
            PolicyName     : required,
        },
    },

    PutRolePolicy : {
        method : 'POST', // see note saying that policy documents can be large
        defaults : {
            Action : 'PutRolePolicy'
        },
        args : {
            Action         : required,
            PolicyDocument : requiredJson,
            PolicyName     : required,
            RoleName       : required,
        },
    },

    PutUserPolicy : {
        method : 'POST', // see note saying that policy documents can be large
        defaults : {
            Action : 'PutUserPolicy'
        },
        args : {
            Action         : required,
            PolicyDocument : requiredJson,
            PolicyName     : required,
            UserName       : required,
        },
    },

    RemoveRoleFromInstanceProfile : {
        defaults : {
            Action : 'RemoveRoleFromInstanceProfile'
        },
        args : {
            Action              : required,
            InstanceProfileName : required,
            RoleName            : required,
        },
    },

    RemoveUserFromGroup : {
        defaults : {
            Action : 'RemoveUserFromGroup'
        },
        args : {
            Action    : required,
            GroupName : required,
            UserName  : required,
        },
    },

    ResyncMFADevice : {
        defaults : {
            Action : 'ResyncMFADevice'
        },
        args : {
            Action              : required,
            AuthenticationCode1 : required,
            AuthenticationCode2 : required,
            SerialNumber        : required,
            UserName            : required,
        },
    },

    UpdateAccessKey : {
        defaults : {
            Action : 'UpdateAccessKey'
        },
        args : {
            Action      : required,
            AccessKeyId : required,
            Status      : required,
            UserName    : optional,
        },
    },

    UpdateAccountPasswordPolicy : {
        defaults : {
            Action : 'UpdateAccountPasswordPolicy'
        },
        args : {
            Action                     : required,
            AllowUsersToChangePassword : optional,
            MinimumPasswordLength      : optional,
            RequireLowercaseCharacters : optional,
            RequireNumbers             : optional,
            RequireSymbols             : optional,
            RequireUppercaseCharacters : optional,
        },
    },

    UpdateAssumeRolePolicy : {
        defaults : {
            Action : 'UpdateAssumeRolePolicy'
        },
        args : {
            Action         : required,
            PolicyDocument : required,
            RoleName       : required,
        },
    },

    UpdateGroup : {
        defaults : {
            Action : 'UpdateGroup'
        },
        args : {
            Action       : required,
            GroupName    : required,
            NewGroupName : optional,
            NewPath      : optional,
        },
    },

    UpdateLoginProfile : {
        defaults : {
            Action : 'UpdateLoginProfile'
        },
        args : {
            Action   : required,
            Password : required,
            UserName : required,
        },
    },

    UpdateServerCertificate : {
        defaults : {
            Action : 'UpdateServerCertificate'
        },
        args : {
            Action                   : required,
            NewPath                  : optional,
            NewServerCertificateName : optional,
            ServerCertificateName    : required,
        },
    },

    UpdateSigningCertificate : {
        defaults : {
            Action : 'UpdateSigningCertificate'
        },
        args : {
            Action        : required,
            CertificateId : required,
            Status        : required,
            UserName      : required,
        },
    },

    UpdateUser : {
        defaults : {
            Action : 'UpdateUser'
        },
        args : {
            Action      : required,
            NewPath     : optional,
            NewUserName : optional,
            UserName    : required,
        },
    },

    UploadServerCertificate : {
        defaults : {
            Action : 'UploadServerCertificate'
        },
        args : {
            Action                : required,
            CertificateBody       : required,
            CertificateChain      : optional,
            Path                  : optional,
            PrivateKey            : required,
            ServerCertificateName : required,
        },
    },

    UploadSigningCertificate : {
        defaults : {
            Action : 'UploadSigningCertificate'
        },
        args : {
            Action          : required,
            CertificateBody : required,
            UserName        : optional,
        },
    },

};

// --------------------------------------------------------------------------------------------------------------------
