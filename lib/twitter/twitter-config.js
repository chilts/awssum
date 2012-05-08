// --------------------------------------------------------------------------------------------------------------------
//
// twitter-config.js - config for Twitter
//
// Copyright (c) 2012 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// requires
// none

// --------------------------------------------------------------------------------------------------------------------

// From: https://dev.twitter.com/docs/api
//
// Timelines:
//
// * https://dev.twitter.com/docs/api/1/get/statuses/home_timeline
// * https://dev.twitter.com/docs/api/1/get/statuses/mentions
// * https://dev.twitter.com/docs/api/1/get/statuses/retweeted_by_me
// * https://dev.twitter.com/docs/api/1/get/statuses/retweeted_to_me
// * https://dev.twitter.com/docs/api/1/get/statuses/retweets_of_me
// * https://dev.twitter.com/docs/api/1/get/statuses/user_timeline
// * https://dev.twitter.com/docs/api/1/get/statuses/retweeted_to_user
// * https://dev.twitter.com/docs/api/1/get/statuses/retweeted_by_user
//
// Tweets:
//
// * https://dev.twitter.com/docs/api/1/get/statuses/%3Aid/retweeted_by
// * https://dev.twitter.com/docs/api/1/get/statuses/%3Aid/retweeted_by/ids
// * https://dev.twitter.com/docs/api/1/get/statuses/retweets/%3Aid
// * https://dev.twitter.com/docs/api/1/get/statuses/show/%3Aid
// * https://dev.twitter.com/docs/api/1/post/statuses/destroy/%3Aid
// * https://dev.twitter.com/docs/api/1/post/statuses/retweet/%3Aid
// * https://dev.twitter.com/docs/api/1/post/statuses/update
// * https://dev.twitter.com/docs/api/1/post/statuses/update_with_media
// * https://dev.twitter.com/docs/api/1/get/statuses/oembed
//
// Search:
//
// * https://dev.twitter.com/docs/api/1/get/search
//
// Direct Messages:
//
// * https://dev.twitter.com/docs/api/1/get/direct_messages
// * https://dev.twitter.com/docs/api/1/get/direct_messages/sent
// * https://dev.twitter.com/docs/api/1/post/direct_messages/destroy/%3Aid
// * https://dev.twitter.com/docs/api/1/post/direct_messages/new
// * https://dev.twitter.com/docs/api/1/get/direct_messages/show/%3Aid
//
// Friends and Followers:
//
// * https://dev.twitter.com/docs/api/1/get/followers/ids
// * https://dev.twitter.com/docs/api/1/get/friends/ids
// * https://dev.twitter.com/docs/api/1/get/friendships/exists
// * https://dev.twitter.com/docs/api/1/get/friendships/incoming
// * https://dev.twitter.com/docs/api/1/get/friendships/outgoing
// * https://dev.twitter.com/docs/api/1/get/friendships/show
// * https://dev.twitter.com/docs/api/1/post/friendships/create
// * https://dev.twitter.com/docs/api/1/post/friendships/destroy
// * https://dev.twitter.com/docs/api/1/get/friendships/lookup
// * https://dev.twitter.com/docs/api/1/post/friendships/update
// * https://dev.twitter.com/docs/api/1/get/friendships/no_retweet_ids
//
// Users:
//
// * https://dev.twitter.com/docs/api/1/get/users/lookup
// * https://dev.twitter.com/docs/api/1/get/users/profile_image/%3Ascreen_name
// * https://dev.twitter.com/docs/api/1/get/users/search
// * https://dev.twitter.com/docs/api/1/get/users/show
// * https://dev.twitter.com/docs/api/1/get/users/contributees
// * https://dev.twitter.com/docs/api/1/get/users/contributors
//
// Suggested Users:
//
// * https://dev.twitter.com/docs/api/1/get/users/suggestions
// * https://dev.twitter.com/docs/api/1/get/users/suggestions/%3Aslug
// * https://dev.twitter.com/docs/api/1/get/users/suggestions/%3Aslug/members
//
// Favourites:
//
// * https://dev.twitter.com/docs/api/1/get/favorites
// * https://dev.twitter.com/docs/api/1/post/favorites/create/%3Aid
// * https://dev.twitter.com/docs/api/1/post/favorites/destroy/%3Aid
//
// Lists:
//
// * https://dev.twitter.com/docs/api/1/get/lists/all
// * https://dev.twitter.com/docs/api/1/get/lists/statuses
// * https://dev.twitter.com/docs/api/1/post/lists/members/destroy
// * https://dev.twitter.com/docs/api/1/get/lists/memberships
// * https://dev.twitter.com/docs/api/1/get/lists/subscribers
// * https://dev.twitter.com/docs/api/1/post/lists/subscribers/create
// * https://dev.twitter.com/docs/api/1/get/lists/subscribers/show
// * https://dev.twitter.com/docs/api/1/post/lists/subscribers/destroy
// * https://dev.twitter.com/docs/api/1/post/lists/members/create_all
// * https://dev.twitter.com/docs/api/1/get/lists/members/show
// * https://dev.twitter.com/docs/api/1/get/lists/members
// * https://dev.twitter.com/docs/api/1/post/lists/members/create
// * https://dev.twitter.com/docs/api/1/post/lists/destroy
// * https://dev.twitter.com/docs/api/1/post/lists/update
// * https://dev.twitter.com/docs/api/1/post/lists/create
// * https://dev.twitter.com/docs/api/1/get/lists
// * https://dev.twitter.com/docs/api/1/get/lists/show
// * https://dev.twitter.com/docs/api/1/get/lists/subscriptions
// * https://dev.twitter.com/docs/api/1/post/lists/members/destroy_all
//
// Accounts:
//
// * https://dev.twitter.com/docs/api/1/get/account/rate_limit_status
// * https://dev.twitter.com/docs/api/1/get/account/verify_credentials
// * https://dev.twitter.com/docs/api/1/post/account/end_session
// * https://dev.twitter.com/docs/api/1/post/account/update_profile
// * https://dev.twitter.com/docs/api/1/post/account/update_profile_background_image
// * https://dev.twitter.com/docs/api/1/post/account/update_profile_colors
// * https://dev.twitter.com/docs/api/1/post/account/update_profile_image
// * https://dev.twitter.com/docs/api/1/get/account/totals
// * https://dev.twitter.com/docs/api/1/get/account/settings
// * https://dev.twitter.com/docs/api/1/post/account/settings
//
// Notification:
//
// * https://dev.twitter.com/docs/api/1/post/notifications/follow
// * https://dev.twitter.com/docs/api/1/post/notifications/leave
//
// Saved Searches:
//
// * https://dev.twitter.com/docs/api/1/get/saved_searches
// * https://dev.twitter.com/docs/api/1/get/saved_searches/show/%3Aid
// * https://dev.twitter.com/docs/api/1/post/saved_searches/create
// * https://dev.twitter.com/docs/api/1/post/saved_searches/destroy/%3Aid
//
// Places and Geo:
//
// * https://dev.twitter.com/docs/api/1/get/geo/id/%3Aplace_id
// * https://dev.twitter.com/docs/api/1/get/geo/reverse_geocode
// * https://dev.twitter.com/docs/api/1/get/geo/search
// * https://dev.twitter.com/docs/api/1/get/geo/similar_places
// * https://dev.twitter.com/docs/api/1/post/geo/place
//
// Trends:
//
// * https://dev.twitter.com/docs/api/1/get/trends/%3Awoeid
// * https://dev.twitter.com/docs/api/1/get/trends/available
// * https://dev.twitter.com/docs/api/1/get/trends/daily
// * https://dev.twitter.com/docs/api/1/get/trends/weekly
//
// Block:
//
// * https://dev.twitter.com/docs/api/1/get/blocks/blocking
// * https://dev.twitter.com/docs/api/1/get/blocks/blocking/ids
// * https://dev.twitter.com/docs/api/1/get/blocks/exists
// * https://dev.twitter.com/docs/api/1/post/blocks/create
// * https://dev.twitter.com/docs/api/1/post/blocks/destroy
//
// Spam Reporting:
//
// * https://dev.twitter.com/docs/api/1/post/report_spam
//
// OAuth (already included in oauth.js):
//
// * https://dev.twitter.com/docs/api/1/get/oauth/authenticate
// * https://dev.twitter.com/docs/api/1/get/oauth/authorize
// * https://dev.twitter.com/docs/api/1/post/oauth/access_token
// * https://dev.twitter.com/docs/api/1/post/oauth/request_token
//
// Help:
//
// * https://dev.twitter.com/docs/api/1/get/help/test
// * https://dev.twitter.com/docs/api/1/get/help/configuration
// * https://dev.twitter.com/docs/api/1/get/help/languages
//
// Legal:
//
// * https://dev.twitter.com/docs/api/1/get/legal/privacy
// * https://dev.twitter.com/docs/api/1/get/legal/tos
//
// Deprecated:
//
// * 26 operations which aren't implemented in AwsSum!

module.exports = {

    // Timelines

    GetHomeTimeline : {
        path : '/1/statuses/home_timeline.json',
        args : {
            count : {
                type     : 'param',
                required : false,
            },
            since_id : {
                type     : 'param',
                required : false,
            },
            max_id : {
                type     : 'param',
                required : false,
            },
            page : {
                type     : 'param',
                required : false,
            },
            trim_user : {
                type     : 'param',
                required : false,
            },
            include_rts : {
                type     : 'param',
                required : false,
            },
            include_entities : {
                type     : 'param',
                required : false,
            },
            exclude_replies : {
                type     : 'param',
                required : false,
            },
            contributor_details : {
                type     : 'param',
                required : false,
            },
        },
        auth : true,
        // response
        extractBody : 'json',
    },

    // Lists

    ListsAll : {
        // request
        path : '/1/lists/all.json',
        args : {
            UserId : {
                required : false,
                type     : 'param',
            },
            ScreenName : {
                required : false,
                type     : 'param',
            },
        },
        auth : true,
        // response
        extractBody : 'json',
    },

};

// --------------------------------------------------------------------------------------------------------------------
