$(function() {

    function load(item, callback) {
        callback = callback || function(){};

        if ( $('.content-' + item).size() > 0 ) {
            callback();
            return;
        }

        $.ajax({
            url      : '/f/' + item + '.html',
            data     : {},
            dataType : 'html',
            success  : function(data, textStatus) {
                $('#content').append(data);
                callback();
            }
        });
    }

    function showHash() {
        // firstly, hide everything
        $('.content').hide();
        // now just show the one in the hash
        var item = location.hash.substr(1);
        $('.content-' + item).show();
    }

    // Bind the event.
    $(window).hashchange(function(){
        var item = location.hash.substr(1);

        $('.nav li').removeClass('active');
        $('.tab-' + item).addClass('active');
        window.scrollTo(0, 0);

        // let's load up this particular part of the page if we don't yet have it
        if ( $('.content-' + item).size() > 0 ) {
            showHash();
        }
        else {
            load(item, function() {
                showHash();
            });
        }
    });

    // see if there is an initial hash (and that we know about it)
    if ( location.hash && $('.tab-' + location.hash.substr(1)).size() ) {
        $(window).hashchange();
    }
    else {
        location.hash = '#home';
    }

    // in a short while, load up some other pages
    setTimeout(function() {
        var initial = [ 'installing', 'loading', 'async', 'operations'];
        for(var i = 0; i < initial.length; i++ ) {
            load(initial[i]);
        }
    }, 5000);

});
