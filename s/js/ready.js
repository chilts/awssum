$(function() {

    // Bind the event.
    $(window).hashchange(function(){
        $('.nav li').removeClass('active');
        $('.' + location.hash.substr(1)).addClass('active');
        window.scrollTop(0, 0);
    });

    // trigger the hashchange event on pageload
    $(window).hashchange();

});
