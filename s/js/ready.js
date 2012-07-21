$(function() {

    // Bind the event.
    $(window).hashchange(function(){
        $('.nav li').removeClass('active');
        $('.tab-' + location.hash.substr(1)).addClass('active');
        window.scrollTo(0, 0);
    });

    // see if we know about this hash
    if ( location.hash && $('.tab-' + location.hash.substr(1)).size() ) {
        $(window).hashchange();
    }
    else {
        location.hash = '#home';
    }

});
