/*!

MIT License | Copyright (c) 2019 | orlinbox | https://github.com/orlinbox/simple-slider

SS version 2.0

*/

/*
  <div
    class="js-simple-slider js-ss-nojs"
    data-ss-delay="7500" role="region"
    aria-label="Simple slider"
  >
    <ul class="js-ss">
      <li>Slide content</li>
    </ul>
    <!-- wrapper is optional, navigation elements are optional -->
    <div class="ss-nav-wrap">
      <div class="js-ss-prev" tabindex="0" role="button" aria-label="Previous slide">Prev</div>
      <ul class="js-ss-nav" aria-hidden="true"></ul>
      <div class="js-ss-next" tabindex="0" role="button" aria-label="Next slide">Next</div>
    </div>
  </div>
*/

(() => {

  // elements with focus
  const foc = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe';
  // main function
  const simsl = (goToP, sli, disable) => {
    let goTo = goToP;
    // disable autorotate feature
    if (disable) clearInterval(sli.int);
    // current position
    const pos = parseInt(sli.attr('data-ss-position') - 1, 10);
    // move logic and action
    if (goTo !== pos) {
      const len = parseInt(sli.attr('data-ss-length'), 10);
      let goToNext = null;
      let goToPrev = null;
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
      $('.js-ss li', sli).each((index, el) => {
        const li = $(el);
        li.removeAttr('class').attr('aria-hidden', true);
        $(foc, li).attr('tabindex', -1);
        if (index === goTo) {
          li.addClass('js-ss-sl-current').removeAttr('aria-hidden');
          $(foc, li).removeAttr('tabindex');
          $('.js-ss-nav li', sli).removeAttr('class').eq(goTo).addClass('active');
        } else if (index === goToNext) {
          li.addClass('js-ss-sl-right');
        } else if (index === goToPrev) {
          li.addClass('js-ss-sl-left');
        } else {
          li.addClass('js-ss-sl');
        }
      });
    }
  }
  // each slider
  $('.js-simple-slider').each((i, el) => {
    const ss = $('.js-ss', el);
    const li = $('li', ss);
    const sli = $(el).removeClass('js-ss-nojs').attr('data-ss-position', 0).attr('data-ss-length', li.length);
    const dots = $('.js-ss-nav', el);
    li.each(() => dots.append('<li></li>'));
    // clone slider content (for placeholder purposes) and disable focus
    ss.wrap('<div class="js-ss-wrap"></div>');
    $(foc, ss.clone().removeClass('js-ss').addClass('js-ss-placeholder').attr('aria-hidden', true).insertAfter(ss)).attr('tabindex', -1);
    // init slider
    simsl(0, sli);
    // autorotate feature
    const timer = sli.attr('data-ss-delay') || 0;
    if (timer > 0) sli.int = setInterval(() => simsl(9999, sli), timer);
    // click prev-next image
    li.click(elm => {
      if ($(elm.currentTarget).hasClass('js-ss-sl-left')) simsl(-9999, sli, true);
      if ($(elm.currentTarget).hasClass('js-ss-sl-right')) simsl(9999, sli, true);
    });
    // click prev-next button / press keyboard enter key
    $('.js-ss-next', el).click(() => simsl(9999, sli, true))
    .on('keydown', e => {
      if (e.originalEvent.key === 'Enter') simsl(9999, sli, true);
    });
    $('.js-ss-prev', el).click(() => simsl(-9999, sli, true))
    .on('keydown', e => {
      if (e.originalEvent.key === 'Enter') simsl(-9999, sli, true);
    });
    // click on dot
    $('li', dots).each((index, elm) => $(elm).click(() => simsl(index, sli, true)));
    // press keyboard left-right arrow keys
    $('body').on('keydown', e => {
      if (e.originalEvent.key === 'ArrowLeft' || e.originalEvent.key === 'Left') simsl(-9999, sli, true);
      if (e.originalEvent.key === 'ArrowRight' || e.originalEvent.key === 'Right') simsl(9999, sli, true);
    });
    // swipe for touch devices
    let xDown = null;
    let xDiff = null;
    let timeDown = null;
    let startEl = null;
    const handleTouchStart = e => {
      startEl = e.target;
      timeDown = Date.now();
      xDown = e.touches[0].clientX;
      xDiff = 0;
    }
    const handleTouchMove = e => {
      xDiff = xDown - e.touches[0].clientX;
    }
    const handleTouchEnd = e => {
      if (startEl !== e.target) return;
      const swipeThreshold = 25; // px
      const swipeTimeout = 500; // ms
      if (Math.abs(xDiff) > swipeThreshold && (Date.now() - timeDown) < swipeTimeout) {
        if (xDiff > 0) {
          simsl(9999, sli, true);
        } else {
          simsl(-9999, sli, true);
        }
      }
    }
    ss[0].addEventListener('touchstart', handleTouchStart, false);
    ss[0].addEventListener('touchmove', handleTouchMove, false);
    ss[0].addEventListener('touchend', handleTouchEnd, false);
  });
  // keyboard focus
  const simslkey = () => {
    $('.js-simple-slider').addClass('ss-keyboard');
    $('body').off('keydown', simslkey);
  }
  $('body').on('keydown', simslkey);

})();