$(function() {

    // Twitter "Follow" button (from https://twitter.com/about/resources/buttons#follow)
    var js, fjs = document.getElementsByTagName('script')[0];
    if ( !document.getElementById('twitter-wjs') ) {
        js = document.createElement('script');
        js.id = 'twitter-wjs';
        js.src = '//platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js, fjs);
    }

});
