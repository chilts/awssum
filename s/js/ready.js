$(function() {

    // Bind the event.
    $(window).hashchange(function(){
        $('.nav li').removeClass('active');
        $(location.hash).addClass('active');
        $(window).scrollTop();
    });

    // trigger the hashchange event on pageload
    $(window).hashchange();

});
