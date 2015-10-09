var tb = {

      // setup
      init: function(){
            tb.mainPage.init();
      },
      loadPage: function(){
            if(tb.sCurrent) tb[tb.sCurrent].init();
      },

      // events

      event_scroll: function(e){
            tb.iCurrentScrollPos = $(document).scrollTop();
            tb.checkNavHomeLink();
      },

      // functions
      getElements: function(){
            tb.$body = $('body');
            tb.$content = $('#content');
            tb.$homeLink = $('.tb_home');
      },
      getCurrentPage: function(){
            var pageClasses = ['mainPage'];
            tb.sCurrent = false;
            for (var i = 0; i < pageClasses.length; i++) {
                  if(tb.$body.hasClass(pageClasses[i])) tb.sCurrent = pageClasses[i];
            }
      },
      checkNavHomeLink: function(){
            if(tb.iCurrentScrollPos ===  0){
                  tb.$homeLink.removeClass('tb_home--shown');
            }
            else{
                  tb.$homeLink.addClass('tb_home--shown');
            }
      }
};

$(window).on('load',tb.init);