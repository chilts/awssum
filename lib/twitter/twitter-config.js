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

// helper variables
var paramRequired   = { type : 'param',   required : false };
var paramOptional   = { type : 'param',   required : false };
var specialRequired = { type : 'special', required : false };

module.exports = {

    // Timelines

    GetHomeTimeline : {
        path : '/1/statuses/home_timeline.json',
        args : {
            count               : paramOptional,
            since_id            : paramOptional,
            max_id              : paramOptional,
            page                : paramOptional,
            trim_user           : paramOptional,
            include_rts         : paramOptional,
            include_entities    : paramOptional,
            exclude_replies     : paramOptional,
            contributor_details : paramOptional,
        },
        auth : true,
        // response
        extractBody : 'json',
    },

    GetMentions : {
        path : '/1/statuses/mentions.json',
        args : {
            count               : paramOptional,
            since_id            : paramOptional,
            max_id              : paramOptional,
            page                : paramOptional,
            trim_user           : paramOptional,
            include_rts         : paramOptional,
            include_entities    : paramOptional,
            contributor_details : paramOptional,
        },
        auth : true,
        // response
        extractBody : 'json',
    },

    GetRetweetedByMe : {
        path : '/1/statuses/retweeted_by_me.json',
        args : {
            count               : paramOptional,
            since_id            : paramOptional,
            max_id              : paramOptional,
            page                : paramOptional,
            trim_user           : paramOptional,
            include_entities    : paramOptional,
        },
        auth : true,
        // response
        extractBody : 'json',
    },

    GetRetweetedToMe : {
        path : '/1/statuses/retweeted_to_me.json',
        args : {
            count               : paramOptional,
            since_id            : paramOptional,
            max_id              : paramOptional,
            page                : paramOptional,
            trim_user           : paramOptional,
            include_entities    : paramOptional,
        },
        auth : true,
        // response
        extractBody : 'json',
    },

    GetRetweetsOfMe : {
        path : '/1/statuses/retweets_of_me.json',
        args : {
            count               : paramOptional,
            since_id            : paramOptional,
            max_id              : paramOptional,
            page                : paramOptional,
            trim_user           : paramOptional,
            include_entities    : paramOptional,
        },
        auth : true,
        // response
        extractBody : 'json',
    },

    GetUserTimeline : {
        path : '/1/statuses/user_timeline.json',
        args : {
            user_id             : paramOptional,
            screen_name         : paramOptional,
            count               : paramOptional,
            since_id            : paramOptional,
            max_id              : paramOptional,
            page                : paramOptional,
            trim_user           : paramOptional,
            include_rts         : paramOptional,
            include_entities    : paramOptional,
            exclude_replies     : paramOptional,
            contributor_details : paramOptional,
        },
        auth : true,
        // response
        extractBody : 'json',
    },

    GetRetweetedToUser : {
        path : '/1/statuses/retweeted_to_user.json',
        args : {
            screen_name         : paramOptional,
            id                  : paramOptional,
            count               : paramOptional,
            since_id            : paramOptional,
            max_id              : paramOptional,
            page                : paramOptional,
            trim_user           : paramOptional,
            include_entities    : paramOptional,
        },
        auth : true,
        // response
        extractBody : 'json',
    },

    GetRetweetedByUser : {
        path : '/1/statuses/retweeted_by_user.json',
        args : {
            screen_name         : paramOptional,
            id                  : paramOptional,
            count               : paramOptional,
            since_id            : paramOptional,
            max_id              : paramOptional,
            page                : paramOptional,
            trim_user           : paramOptional,
            include_entities    : paramOptional,
        },
        auth : true,
        // response
        extractBody : 'json',
    },

    // Tweets

    RetweetedBy : {
        path : function(options, args) { return '/1/statuses/' + args.id + '/retweeted_by.json'; },
        args : {
            id    : specialRequired,
            count : paramOptional,
            page  : paramOptional,
        },
        auth : true,
        // response
        extractBody : 'json',
    },

    RetweetedByIds : {
        path : function(options, args) { return '/1/statuses/' + args.id + '/retweeted_by/ids.json'; },
        args : {
            id            : specialRequired,
            count         : paramOptional,
            page          : paramOptional,
            stringify_ids : paramOptional,
        },
        auth : true,
        // response
        extractBody : 'json',
    },

    Retweets : {
        path : function(options, args) { return '/1/statuses/retweets/' + args.id + '.json'; },
        args : {
            id               : specialRequired,
            count            : paramOptional,
            trim_user        : paramOptional,
            include_entities : paramOptional,
        },
        auth : true,
        // response
        extractBody : 'json',
    },

    Show : {
        path : function(options, args) { return '/1/statuses/show/' + args.id + '.json'; },
        args : {
            id                 : specialRequired,
            trim_user          : paramOptional,
            include_entities   : paramOptional,
            include_my_retweet : paramOptional,
        },
        auth : true,
        // response
        extractBody : 'json',
    },

    Destroy : {
        method : 'POST',
        path : function(options, args) { return '/1/statuses/destroy/' + args.id + '.json'; },
        args : {
            id                 : specialRequired,
            include_entities   : paramOptional,
            trim_user          : paramOptional,
        },
        auth : true,
        // response
        extractBody : 'json',
    },

    Retweet : {
        method : 'POST',
        path : function(options, args) { return '/1/statuses/retweet/' + args.id + '.json'; },
        args : {
            id                 : specialRequired,
            include_entities   : paramOptional,
            trim_user          : paramOptional,
        },
        auth : true,
        // response
        extractBody : 'json',
    },

    Update : {
        method : 'POST',
        path : function(options, args) { return '/1/statuses/update.json'; },
        args : {
            'status'                : paramRequired,
            'in_reply_to_status_id' : paramOptional,
            'lat'                   : paramOptional,
            'long'                  : paramOptional,
            'place_id'              : paramOptional,
            'display_coordinates'   : paramOptional,
            'trim_user'             : paramOptional,
            'include_entities'      : paramOptional,
        },
        auth : true,
        // response
        extractBody : 'json',
    },

    // UpdateWithMedia : {
    //     host   : 'upload.twitter.com', // for Media uploads
    //     method : 'POST',
    //     path : function(options, args) { return '/1/statuses/update_with_media.json'; },
    //     args : {
    //         'status'                : paramRequired
    //         'media'                 : paramOptional,
    //         'possibly_sensitive'    : paramOptional,
    //         'in_reply_to_status_id' : paramOptional,
    //         'lat'                   : paramOptional,
    //         'long'                  : paramOptional,
    //         'place_id'              : paramOptional,
    //         'display_coordinates'   : paramOptional,
    //     },
    //     auth : true,
    //     // response
    //     extractBody : 'json',
    // },

    OEmbed : {
        path : function(options, args) { return '/1/statuses/oembed.json'; },
        args : {
            id          : paramOptional,
            url         : paramOptional,
            maxwidth    : paramOptional,
            hide_media  : paramOptional,
            hide_thread : paramOptional,
            omit_script : paramOptional,
            align       : paramOptional,
            related     : paramOptional,
            lang        : paramOptional,
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
            UserId     : paramOptional,
            ScreenName : paramOptional,
        },
        auth : true,
        // response
        extractBody : 'json',
    },

};

// --------------------------------------------------------------------------------------------------------------------
