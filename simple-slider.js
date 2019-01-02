/*
  <div class="js-simple-slider">
    <ul class="js-ss">
      <li>Slide content</li>
    </ul>
    <ul class="js-ss-nav"></ul>
    <div class="js-ss-prev" tabindex="0" aria-label="Previous slide">Prev</div>
    <div class="js-ss-next" tabindex="0" aria-label="Next slide">Next</div>
  </div>
*/
(function() {
  function simsl(arr) {
    $.each(arr, function(index, el) {
      el.removeAttr('class').attr('aria-hidden', true);
      if (index === 0) {
        el.addClass('js-ss-sl-current').removeAttr('aria-hidden');
        var dotsEl = $('.js-ss-nav li', el.parents('.js-simple-slider')).removeAttr('class');
        dotsEl.eq(el.attr('data-ss-index')).addClass('active');
      } else if (index === 1) { el.addClass('js-ss-sl-right');
      } else if (index === (arr.length - 1)) { el.addClass('js-ss-sl-left');
      } else { el.addClass('js-ss-sl'); }
    });
  }
  function simslNext(arr, pos) {
    pos[0]++;
    arr.push(arr.shift());
    simsl(arr);
  }
  function simslPrev(arr, pos) {
    pos[0]--;
    arr.unshift(arr.pop());
    simsl(arr);
  }
  function simslCustom(arr, pos, len, goto) {
    var moveBy = goto - pos[0]%len;
    if (moveBy < 0) moveBy = moveBy + len;
    if (moveBy > len) moveBy = moveBy - len;
    while(moveBy-- > 0) { simslNext(arr, pos); }
  }
  // sliders
  $('.js-simple-slider').each(function() {
    var ss = $('.js-ss', this);
    var elm = $('.js-ss li', this);
    var pos = [0];
    var arr = [];
    var dots = $('.js-ss-nav', this);
    var i = 0;
    elm.each(function() {
      arr.push($(this).attr('data-ss-index', i++));
      dots.append('<li></li>');
    });
    // clone (for placeholder purposes)
    ss.wrap('<div class="js-ss-wrap"></div>');
    ss.clone().removeClass('js-ss').addClass('js-ss-placeholder').attr('aria-hidden', true).insertAfter(ss);
    // init
    simsl(arr);
    // click / keyboard (enter key)
    $('.js-ss-next', this).click(function() { simslNext(arr, pos); }).on('keydown', function(e) { if (e.which == 13) { simslNext(arr, pos); } });
    $('.js-ss-prev', this).click(function() { simslPrev(arr, pos); }).on('keydown', function(e) { if (e.which == 13) { simslPrev(arr, pos); } });
    // click on dot
    $('li', dots).each(function(index) { $(this).click(function() { simslCustom(arr, pos, elm.length, index); }); });
    // keyboard (left and right arrow keys)
    $('body').on('keydown', function(e) {
      if (e.which == 39) { simslNext(arr, pos); }
      if (e.which == 37) { simslPrev(arr, pos); }
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
        if (xDiff > 0) { simslNext(arr, pos); } else { simslPrev(arr, pos); }
      }
    }
  });
})();
