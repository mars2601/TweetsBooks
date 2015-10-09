tb.mainPage = {
    conf: {
        sFilterButton: 'main__filter__button',
        sAddStatusButton: 'param__item',
        sTweetTitle: 'tweets-list__item__title',
        sClassStatusReaded: 'readed',
        sClassStatusFavorite: 'favorite',
        sCookieNameReaded: 'cReaded',
        sCookieNameFavorite: 'cFavorite',
        sCookieNameNotReaded: 'cNotReaded'
    },

    $toggleFilter: null,
    $toggleStatus: null,
    $setCookie: null,
    $setHeight: null,

    init:function(){
        tb.mainPage.getElements();
        tb.mainPage.setEvents();
    },

    //    SETUP

    getElements: function(){
        tb.mainPage.$toggleFilter = $('.' + tb.mainPage.conf.sFilterButton);
        tb.mainPage.$toggleStatus = $('.' + tb.mainPage.conf.sAddStatusButton);
        tb.mainPage.$setCookie = $(document);
        tb.mainPage.$setHeight = $(document);
    },

    setEvents: function(){
        tb.mainPage.$toggleFilter.on('click',tb.mainPage.change_filter);
        tb.mainPage.$toggleStatus.on('click',tb.mainPage.change_status);
        tb.mainPage.$setHeight.ready(tb.mainPage.set_height);
        tb.mainPage.$setCookie.ready(tb.mainPage.set_main_cookie);
    },

    //    EVENTS

    set_height: function(){
        $(".main").css("min-height", $(window).height()-($("header").height() + $("footer").height()));
    },

    change_filter: function(e){
            var $el = $(this);
        var label = $el.text();
        var labelRectified = label.replace(/\s+/g, '').toLowerCase();

        if(labelRectified != "allfilter"){
            $(".main__list").css("width", "100%").hide();
            $('#' + labelRectified).fadeIn();
            $('.' + tb.mainPage.conf.sFilterButton).removeClass("current");
        }else{
            $(".main__list").removeAttr('style').fadeIn();
        }
        $(".main__filter__button").removeClass("current");
        $el.toggleClass("current");
    },

    change_status: function(e){
        var $el = $(this);
        var $status = $el.attr("class").split("--").slice(-1)[0];
        var $tweetID = $el.parent(".param").find('.tweet_id').text();
        if($status === tb.mainPage.conf.sClassStatusReaded){
            tb.mainPage.add_id(tb.mainPage.conf.sCookieNameReaded, $tweetID);
            $('#readedtweets').load(document.URL + ' #readedtweets-content');

        }else if($status === tb.mainPage.conf.sClassStatusFavorite){
            tb.mainPage.add_id(tb.mainPage.conf.sCookieNameFavorite, $tweetID);
            $('#favoritetweets').load(document.URL + ' #favoritetweets-content');

        }else{
            console.log("error");
        }
        $el.parent(".param").parent(".tweets-list__item__art").parent("li").fadeOut();
    },

    add_id: function(cookieName, tweetId){
        var now = new Date();
        var time = now.getTime();
        var expireTime = time + 1000*36000;
        if(tb.mainPage.get_cookie(cookieName).length == '0'){
            var $my_tweets_array = [];
            $my_tweets_array.push(tweetId);

            tb.mainPage.set_cookie(cookieName, JSON.stringify($my_tweets_array), expireTime);

        }else{
            var $my_tweets_array = JSON.parse(tb.mainPage.get_cookie(cookieName));
            if(jQuery.inArray(tweetId, $my_tweets_array) == -1){
                $my_tweets_array.push(tweetId);
                tb.mainPage.set_cookie(cookieName, JSON.stringify($my_tweets_array), expireTime);
            }else{
                console.log('repeated');
            }
        }
    },

 /*   remove_id: function(cookieName, tweetId){
        var now = new Date();
        var time = now.getTime();
        var expireTime = time + 1000*36000;
        var $my_tweets_array_m = JSON.parse(tb.mainPage.get_cookie(cookieName));

            if(jQuery.inArray(tweetId, $my_tweets_array_m) != -1){
                var index = $my_tweets_array_m.indexOf(tweetId);
                if (index > -1) {
                    $my_tweets_array_m.splice(index, 1);
                }
                tb.mainPage.set_cookie(cookieName, JSON.stringify($my_tweets_array_m), expireTime);
                tb.mainPage.check_cookie(cookieName);
            }else{
                console.log('not in array');
            }
*//*
        $('#notreaded').load(document.URL + ' #notreaded-content');
*//*
    },*/

    set_main_cookie: function(){
        var now = new Date();
        var time = now.getTime();
        var expireTime = time + 1000*36000;
        var length = JSON.parse(tb.mainPage.get_cookie(tb.mainPage.conf.sCookieNameNotReaded)).length;        console.log(tb.mainPage.get_cookie(tb.mainPage.conf.sCookieNameNotReaded).length);
        console.log(length);

        if(length === 0) {
            var $my_tweets_array_main = [];
            if($(".tweet_id_main")){
                $(".tweet_id_main").each(function(){
                    $my_tweets_array_main.push($(this).text());
                });
            }
        }else{
            var $my_tweets_array_main = JSON.parse(tb.mainPage.get_cookie(tb.mainPage.conf.sCookieNameNotReaded));
        }
        $('#alltweets').load(document.URL + ' #alltweets-content');
        tb.mainPage.set_cookie(tb.mainPage.conf.sCookieNameNotReaded, JSON.stringify($my_tweets_array_main), expireTime);
    },


    set_cookie: function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    },

    get_cookie: function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    },

    check_cookie: function(cname) {
        var user = tb.mainPage.get_cookie(cname);
        if (user != "") {
            alert("Welcome again " + user);
        } else {
            user = prompt("Please enter your name:", "");
            if (user != "" && user != null) {
                tb.mainPage.set_cookie("username", user, 365);
            }
        }
    }



};