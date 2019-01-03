/*
  <div class="js-simple-slider" role="region" aria-label="Simple slider">
    <ul class="js-ss">
      <li>Slide content</li>
    </ul>
    <ul class="js-ss-nav" aria-hidden="true"></ul>
    <div class="js-ss-prev" tabindex="0" aria-label="Previous slide">Prev</div>
    <div class="js-ss-next" tabindex="0" aria-label="Next slide">Next</div>
  </div>
*/
(function() {
  function simsl(goTo, sli) {
    var el = $(sli);
    var pos = parseInt(el.attr('data-ss-position'));
    if (goTo !== pos) {
      var len = parseInt(el.attr('data-ss-length'));
      if (goTo === 9999) goTo = pos + 1;
      if (goTo === -9999) goTo = pos - 1;
      if (goTo > (len-1)) goTo = 0;
      if (goTo < 0) goTo = len - 1;
      el.attr('data-ss-position', goTo);
      goToNext = goTo + 1;
      if (goToNext > (len-1)) goToNext = 0;
      if (goToNext < 0) goToNext = len - 1;
      goToPrev = goTo - 1;
      if (goToPrev > (len-1)) goToPrev = 0;
      if (goToPrev < 0) goToPrev = len - 1;
      $('.js-ss li', el).each(function(index) {
        var elm = $(this);
        elm.removeAttr('class').attr('aria-hidden', true);
        if (index === goTo) {
          elm.addClass('js-ss-sl-current').removeAttr('aria-hidden');
          $('.js-ss-nav li', el).removeAttr('class').eq(goTo).addClass('active');
        } else if (index === goToNext) { elm.addClass('js-ss-sl-right');
        } else if (index === goToPrev) { elm.addClass('js-ss-sl-left');
        } else { elm.addClass('js-ss-sl'); }
      });
    }
  }
  // sliders
  $('.js-simple-slider').each(function() {
    var ss = $('.js-ss', this);
    var elm = $('li', ss);
    var sli = $(this).attr('data-ss-position', -1).attr('data-ss-length', elm.length);
    var dots = $('.js-ss-nav', this);
    elm.each(function() { dots.append('<li></li>'); });
    // clone (for placeholder purposes)
    ss.wrap('<div class="js-ss-wrap"></div>');
    ss.clone().removeClass('js-ss').addClass('js-ss-placeholder').attr('aria-hidden', true).insertAfter(ss);
    // init
    simsl(0, sli);
    // click / keyboard (enter key)
    $('.js-ss-next', this).click(function() { simsl(9999, sli); }).on('keydown', function(e) { if (e.which == 13) { simsl(9999, sli); } });
    $('.js-ss-prev', this).click(function() { simsl(-9999, sli); }).on('keydown', function(e) { if (e.which == 13) { simsl(-9999, sli); } });
    // click on dot
    $('li', dots).each(function(index) { $(this).click(function() { simsl(index, sli); }); });
    // keyboard (left and right arrow keys)
    $('body').on('keydown', function(e) {
      if (e.which == 39) { simsl(9999, sli); }
      if (e.which == 37) { simsl(-9999, sli); }
    });
    // swipe (on touch devices)
    ss[0].addEventListener('touchstart', handleTouchStart, false);
    ss[0].addEventListener('touchmove', handleTouchMove, false);
    ss[0].addEventListener('touchend', handleTouchEnd, false);
    var xDown, xDiff, timeDown, startEl;
    function handleTouchStart(e) {
      startEl = e.target;
      timeDown = Date.now();
      xDown = e.touches[0].clientX;
      xDiff = 0;
    }
    function handleTouchMove(e) { xDiff = xDown - e.touches[0].clientX; }
    function handleTouchEnd(e) {
      if (startEl !== e.target) return;
      var swipeThreshold = 25; // px
      var swipeTimeout = 500; // ms
      if (Math.abs(xDiff) > swipeThreshold && (Date.now() - timeDown) < swipeTimeout) {
        if (xDiff > 0) { simsl(9999, sli); } else { simsl(-9999, sli); }
      }
    }
  });
})();
