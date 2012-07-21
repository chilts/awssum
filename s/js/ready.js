$(function() {

    // Bind the event.
    $(window).hashchange(function(){
        $('.nav li').removeClass('active');
        $('#' + location.hash).addClass('active');
    })

    // trigger the hashchange event on pageload
    $(window).hashchange();

});
