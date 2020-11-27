/*!
MIT License | Copyright (c) 2021 | orlinbox | https://github.com/orlinbox/simple-slider
SS version 3.0
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
  // action function
  const simsl = (goToP, sli, disable) => {
    let goTo = goToP;
    // disable autorotate feature
    if (disable) clearInterval(sli.int);
    // current position
    const pos = parseInt(sli.getAttribute('data-ss-position') - 1, 10);
    // move logic and action
    if (goTo !== pos) {
      const len = parseInt(sli.getAttribute('data-ss-length'), 10);
      let goToNext = null;
      let goToPrev = null;
      if (goTo === 9999) goTo = pos + 1;
      if (goTo === -9999) goTo = pos - 1;
      if (goTo > (len-1)) goTo = 0;
      if (goTo < 0) goTo = len - 1;
      sli.setAttribute('data-ss-position', goTo + 1);
      goToNext = goTo + 1;
      if (goToNext > (len-1)) goToNext = 0;
      if (goToNext < 0) goToNext = len - 1;
      goToPrev = goTo - 1;
      if (goToPrev > (len-1)) goToPrev = 0;
      if (goToPrev < 0) goToPrev = len - 1;
      sli.querySelectorAll('.js-ss li').forEach((li, index) => {
        li.removeAttribute('class');
        li.setAttribute('aria-hidden', true);
        li.querySelectorAll(foc).forEach((item) => item.setAttribute('tabindex', -1));
        if (index === goTo) {
          li.classList.add('js-ss-sl-current');
          li.removeAttribute('aria-hidden');
          li.querySelectorAll(foc).forEach((item) => item.removeAttribute('tabindex'));
          const dots = sli.querySelectorAll('.js-ss-nav li');
          if (dots.length > 0) {
            dots.forEach((item) => item.removeAttribute('class'));
            dots.item(goTo).classList.add('active');
          }
        } else if (index === goToNext) {
          li.classList.add('js-ss-sl-right');
        } else if (index === goToPrev) {
          li.classList.add('js-ss-sl-left');
        } else {
          li.classList.add('js-ss-sl');
        }
      });
    }
  }
  // each slider
  document.querySelectorAll('.js-simple-slider').forEach((sli) => {
    const ss = sli.querySelector('.js-ss');
    const li = ss.querySelectorAll('li');
    const count = li.length;
    if (count > 2) {
      // if we have more than 2 items in the slider
      sli.classList.remove('js-ss-nojs');
      sli.setAttribute('data-ss-position', 0);
      sli.setAttribute('data-ss-length', count);
      const dots = sli.querySelector('.js-ss-nav') || false;
      if (dots) li.forEach(() => dots.innerHTML += '<li></li>');
      // wrap and clone slider content (for placeholder purposes) with disabled focus
      const wrapEl = document.createElement('div');
      wrapEl.classList.add('js-ss-wrap');
      sli.insertBefore(wrapEl, sli.firstChild);
      wrapEl.appendChild(ss);
      const ssPl = ss.cloneNode(true);
      ssPl.querySelectorAll(foc).forEach((item) => item.setAttribute('tabindex', -1));
      ssPl.classList.remove('js-ss');
      ssPl.classList.add('js-ss-placeholder');
      ssPl.setAttribute('aria-hidden', true);
      wrapEl.appendChild(ssPl);
      // init slider
      simsl(0, sli);
      // autorotate feature
      const timer = sli.getAttribute('data-ss-delay') || 0;
      if (timer > 0) sli.int = setInterval(() => simsl(9999, sli), timer);
      // click prev-next image
      li.forEach((item) => item.addEventListener('click', (elm) => {
        if (elm.currentTarget.classList.contains('js-ss-sl-left')) simsl(-9999, sli, true);
        if (elm.currentTarget.classList.contains('js-ss-sl-right')) simsl(9999, sli, true);
      }));
      // click prev-next button / press keyboard enter key
      const nextBtn = sli.querySelector('.js-ss-next') || false;
      if (nextBtn) {
        nextBtn.addEventListener('click', () => simsl(9999, sli, true));
        nextBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter') simsl(9999, sli, true) });
      }
      const prevBtn = sli.querySelector('.js-ss-prev') || false;
      if (prevBtn) {
        prevBtn.addEventListener('click', () => simsl(-9999, sli, true));
        prevBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter') simsl(-9999, sli, true) });
      }
      // click on dot
      if (dots) dots.querySelectorAll('li').forEach((elm, index) => elm.addEventListener('click', () => simsl(index, sli, true)));
      // press keyboard left-right arrow keys
      document.body.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'Left') simsl(-9999, sli, true);
        if (e.key === 'ArrowRight' || e.key === 'Right') simsl(9999, sli, true);
      })
      // swipe for touch devices
      let xDown = null;
      let xDiff = null;
      let timeDown = null;
      let startEl = null;
      const handleTouchStart = (e) => {
        startEl = e.target;
        timeDown = Date.now();
        xDown = e.touches[0].clientX;
        xDiff = 0;
      }
      const handleTouchMove = (e) => {
        xDiff = xDown - e.touches[0].clientX;
      }
      const handleTouchEnd = (e) => {
        if (startEl !== e.target) return;
        const swipeThreshold = 20; // px
        const swipeTimeout = 500; // ms
        if (Math.abs(xDiff) > swipeThreshold && (Date.now() - timeDown) < swipeTimeout) simsl((xDiff > 0) ? 9999 : -9999, sli, true);
      }
      ss.addEventListener('touchstart', handleTouchStart, false);
      ss.addEventListener('touchmove', handleTouchMove, false);
      ss.addEventListener('touchend', handleTouchEnd, false);
    } else if (count > 0) {
      // if we have only 1 or 2 items in the slider
      sli.classList.remove('js-ss-nojs');
      sli.classList.add('js-ss-inactive');
    }
  });
  // keyboard focus
  const simslkey = () => {
    document.querySelectorAll('.js-simple-slider').forEach((item) => item.classList.add('ss-keyboard'));
    document.body.removeEventListener('keydown', simslkey);
  }
  document.body.addEventListener('keydown', simslkey);
})();
