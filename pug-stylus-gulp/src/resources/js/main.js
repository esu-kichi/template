// 変数
var breakPoint = 736;
var minWidth = {minWidth: breakPoint + 1};
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var userAgent = navigator.userAgent;
var UA_iPhone = (userAgent.indexOf('iPhone') > -1)? true:false;
var UA_iPad = (userAgent.indexOf('iPad') > -1)? true:false;
var UA_android = (userAgent.indexOf('Android') > -1)? true:false;

$(function() {

  // スムーススクロール
  $('a[href^="#"]').on('click',function (e) {
      e.preventDefault();
      var target = this.hash;
      var tagetName = $(this).attr('href');
      $('html, body').stop().animate({
        'scrollTop': $(target).offset().top
      }, 800, 'easeInOutExpo', function () {
        window.location.hash = target;
      });
  });

  // SPのみ電話番号をリンクに変更
  if(UA_iPhone || UA_android) {
    $('.js_telNum').each(function() {
      var telNum = $(this).attr('data-tel');
      $(this).wrap('<a></a>');
      $(this).parent('a').attr('href', 'tel:' + telNum);
    });
  }

});
