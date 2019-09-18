// ==================================================
// Project Name  :  Cloud Defense
// File          :  JS Base
// Version       :  1.0.0
// Last change   :  12 September 2019
// Author        :  ----------
// Developer:    :  Rakibul Islam Dewan
// ==================================================




(function($) {
  "use strict";




  
  // back to top - start
  // --------------------------------------------------
  $(window).scroll(function() {
    if ($(this).scrollTop() > 200) {
      $('#backtotop:hidden').stop(true, true).fadeIn();
    } else {
      $('#backtotop').stop(true, true).fadeOut();
    }
  });
  $(function() {
    $("#scroll").on('click', function() {
      $("html,body").animate({
        scrollTop: $("#thetop").offset().top
      }, "slow");
      return false
    })
  });
  // back to top - end
  // --------------------------------------------------




  
  // back to top - start
  // --------------------------------------------------
  $('select').niceSelect();
  // back to top - end
  // --------------------------------------------------




  
  // menu button - start
  // --------------------------------------------------
  $(document).ready(function () {
    $('.close-btn, .overlay').on('click', function () {
      $('#sidebar-menu').removeClass('active');
      $('.overlay').removeClass('active');
    });

    $('#sidebar-collapse').on('click', function () {
      $('#sidebar-menu').addClass('active');
      $('.overlay').addClass('active');
    });
  });
  // menu button - end
  // --------------------------------------------------





  // sticky menu - start
  // --------------------------------------------------
  var headerId = $(".sticky-header");
  $(window).on('scroll' , function() {
    var amountScrolled = $(window).scrollTop();
    if ($(this).scrollTop() > 60) {
      headerId.removeClass("not-stuck");
      headerId.addClass("stuck");
    } else {
      headerId.removeClass("stuck");
      headerId.addClass("not-stuck");
    }
  });
  // sticky menu - end
  // --------------------------------------------------



  
})(jQuery);