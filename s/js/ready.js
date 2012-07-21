$(function() {

    var cache = {};

    function preload(item, callback) {
        callback = callback || function(){};

        // see if we already have it cached
        if ( cache[item] ) {
            callback();
            return;
        }

        $.ajax({
            url      : '/f/' + item + '.html',
            data     : {},
            dataType : 'html',
            success  : function(data, textStatus) {
                // we're not going load the data into the document, but just cache it here
                cache[item] = data;
                callback();
            }
        });
    }

    function load(item, callback) {
        callback = callback || function(){};

        // already in the document
        if ( $('.content-' + item).size() > 0 ) {
            callback();
            return;
        }

        // see if we have a copy
        if ( cache[item] ) {
            $('#content').append(cache[item]);
            callback();
            return;
        }

        // not anywhere yet, so ask for it and put it in the document
        preload(item, function() {
            $('#content').append(cache[item]);
            callback();
        });
    }

    function showHash() {
        // firstly, hide everything
        $('.content').hide();

        // now just show the one in the hash
        var item = location.hash.substr(1);
        load(item);
    }

    // Bind the event.
    $(window).hashchange(function(){
        var item = location.hash.substr(1);

        $('.nav li').removeClass('active');
        $('.tab-' + item).addClass('active');
        window.scrollTo(0, 0);

        // let's load up this particular part of the page if we don't yet have it
        showHash();
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
            preload(initial[i]);
        }
    }, 5000);

});
