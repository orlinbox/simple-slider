/*
  <div class="js-simple-slider" data-ss-delay="7500" role="region" aria-label="Simple slider">
    <ul class="js-ss">
      <li>Slide content</li>
    </ul>
    <!-- optional -->
    <ul class="js-ss-nav" aria-hidden="true"></ul>
    <div class="js-ss-prev" tabindex="0" aria-label="Previous slide">Prev</div>
    <div class="js-ss-next" tabindex="0" aria-label="Next slide">Next</div>
  </div>
*/
(function() {
  // main function
  function simsl(goTo, sli, disable) {
    // disable autorotate feature
    if (disable) clearInterval(sli.int);
    // current position
    var pos = parseInt(sli.attr('data-ss-position') - 1);
    // move logic and action
    if (goTo !== pos) {
      var len = parseInt(sli.attr('data-ss-length'));
      if (goTo === 9999) goTo = pos + 1;
      if (goTo === -9999) goTo = pos - 1;
      if (goTo > (len-1)) goTo = 0;
      if (goTo < 0) goTo = len - 1;
      sli.attr('data-ss-position', goTo + 1);
      goToNext = goTo + 1;
      if (goToNext > (len-1)) goToNext = 0;
      if (goToNext < 0) goToNext = len - 1;
      goToPrev = goTo - 1;
      if (goToPrev > (len-1)) goToPrev = 0;
      if (goToPrev < 0) goToPrev = len - 1;
      $('.js-ss li', sli).each(function(index) {
        var li = $(this);
        li.removeAttr('class').attr('aria-hidden', true);
        if (index === goTo) {
          li.addClass('js-ss-sl-current').removeAttr('aria-hidden');
          $('.js-ss-nav li', sli).removeAttr('class').eq(goTo).addClass('active');
        } else if (index === goToNext) { li.addClass('js-ss-sl-right');
        } else if (index === goToPrev) { li.addClass('js-ss-sl-left');
        } else { li.addClass('js-ss-sl'); }
      });
    }
  }
  // each slider
  $('.js-simple-slider').each(function() {
    var ss = $('.js-ss', this);
    var li = $('li', ss);
    var sli = $(this).attr('data-ss-position', 0).attr('data-ss-length', li.length);
    var dots = $('.js-ss-nav', this);
    li.each(function() { dots.append('<li></li>'); });
    // clone slider content (for placeholder purposes)
    ss.wrap('<div class="js-ss-wrap"></div>');
    ss.clone().removeClass('js-ss').addClass('js-ss-placeholder').attr('aria-hidden', true).insertAfter(ss);
    // init slider
    simsl(0, sli);
    // autorotate feature
    var timer = sli.attr('data-ss-delay') || 0;
    if (timer > 0) sli.int = setInterval(function(){ simsl(9999, sli); }, timer);
    // click prev-next image
    li.click(function() {
      if ($(this).hasClass('js-ss-sl-left')) simsl(-9999, sli, true);
      if ($(this).hasClass('js-ss-sl-right')) simsl(9999, sli, true);
    });
    // click prev-next button / press keyboard enter key
    $('.js-ss-next', this).click(function() { simsl(9999, sli, true); }).on('keydown', function(e) { if (e.which == 13) { simsl(9999, sli, true); } });
    $('.js-ss-prev', this).click(function() { simsl(-9999, sli, true); }).on('keydown', function(e) { if (e.which == 13) { simsl(-9999, sli, true); } });
    // click on dot
    $('li', dots).each(function(index) { $(this).click(function() { simsl(index, sli, true); }); });
    // press keyboard left-right arrow keys
    $('body').on('keydown', function(e) {
      if (e.which == 39) { simsl(9999, sli, true); }
      if (e.which == 37) { simsl(-9999, sli, true); }
    });
    // swipe for touch devices
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
        if (xDiff > 0) { simsl(9999, sli, true); } else { simsl(-9999, sli, true); }
      }
    }
  });
})();
