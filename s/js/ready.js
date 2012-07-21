$(function() {

    // Bind the event.
    $(window).hashchange(function(){
        $('.nav li').removeClass('active');
        $('.tab-' + location.hash.substr(1)).addClass('active');
        window.scrollTo(0, 0);
    });

    // trigger the hashchange event on pageload
    if ( location.hash ) {
        $(window).hashchange();
    }
    else {
        location.hash = '#home';
    }

});
