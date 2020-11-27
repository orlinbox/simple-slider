"use strict";

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
(function () {
  // elements with focus
  var foc = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe'; // action function

  var simsl = function simsl(goToP, sli, disable) {
    var goTo = goToP; // disable autorotate feature

    if (disable) clearInterval(sli["int"]); // current position

    var pos = parseInt(sli.getAttribute('data-ss-position') - 1, 10); // move logic and action

    if (goTo !== pos) {
      var len = parseInt(sli.getAttribute('data-ss-length'), 10);
      var goToNext = null;
      var goToPrev = null;
      if (goTo === 9999) goTo = pos + 1;
      if (goTo === -9999) goTo = pos - 1;
      if (goTo > len - 1) goTo = 0;
      if (goTo < 0) goTo = len - 1;
      sli.setAttribute('data-ss-position', goTo + 1);
      goToNext = goTo + 1;
      if (goToNext > len - 1) goToNext = 0;
      if (goToNext < 0) goToNext = len - 1;
      goToPrev = goTo - 1;
      if (goToPrev > len - 1) goToPrev = 0;
      if (goToPrev < 0) goToPrev = len - 1;
      sli.querySelectorAll('.js-ss li').forEach(function (li, index) {
        li.removeAttribute('class');
        li.setAttribute('aria-hidden', true);
        li.querySelectorAll(foc).forEach(function (item) {
          return item.setAttribute('tabindex', -1);
        });

        if (index === goTo) {
          li.classList.add('js-ss-sl-current');
          li.removeAttribute('aria-hidden');
          li.querySelectorAll(foc).forEach(function (item) {
            return item.removeAttribute('tabindex');
          });
          var dots = sli.querySelectorAll('.js-ss-nav li');

          if (dots.length > 0) {
            dots.forEach(function (item) {
              return item.removeAttribute('class');
            });
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
  }; // each slider


  document.querySelectorAll('.js-simple-slider').forEach(function (sli) {
    var ss = sli.querySelector('.js-ss');
    var li = ss.querySelectorAll('li');
    var count = li.length;

    if (count > 2) {
      // if we have more than 2 items in the slider
      sli.classList.remove('js-ss-nojs');
      sli.setAttribute('data-ss-position', 0);
      sli.setAttribute('data-ss-length', count);
      var dots = sli.querySelector('.js-ss-nav') || false;
      if (dots) li.forEach(function () {
        return dots.innerHTML += '<li></li>';
      }); // wrap and clone slider content (for placeholder purposes) with disabled focus

      var wrapEl = document.createElement('div');
      wrapEl.classList.add('js-ss-wrap');
      sli.insertBefore(wrapEl, sli.firstChild);
      wrapEl.appendChild(ss);
      var ssPl = ss.cloneNode(true);
      ssPl.querySelectorAll(foc).forEach(function (item) {
        return item.setAttribute('tabindex', -1);
      });
      ssPl.classList.remove('js-ss');
      ssPl.classList.add('js-ss-placeholder');
      ssPl.setAttribute('aria-hidden', true);
      wrapEl.appendChild(ssPl); // init slider

      simsl(0, sli); // autorotate feature

      var timer = sli.getAttribute('data-ss-delay') || 0;
      if (timer > 0) sli["int"] = setInterval(function () {
        return simsl(9999, sli);
      }, timer); // click prev-next image

      li.forEach(function (item) {
        return item.addEventListener('click', function (elm) {
          if (elm.currentTarget.classList.contains('js-ss-sl-left')) simsl(-9999, sli, true);
          if (elm.currentTarget.classList.contains('js-ss-sl-right')) simsl(9999, sli, true);
        });
      }); // click prev-next button / press keyboard enter key

      var nextBtn = sli.querySelector('.js-ss-next') || false;

      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          return simsl(9999, sli, true);
        });
        nextBtn.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') simsl(9999, sli, true);
        });
      }

      var prevBtn = sli.querySelector('.js-ss-prev') || false;

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          return simsl(-9999, sli, true);
        });
        prevBtn.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') simsl(-9999, sli, true);
        });
      } // click on dot


      if (dots) dots.querySelectorAll('li').forEach(function (elm, index) {
        return elm.addEventListener('click', function () {
          return simsl(index, sli, true);
        });
      }); // press keyboard left-right arrow keys

      document.body.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft' || e.key === 'Left') simsl(-9999, sli, true);
        if (e.key === 'ArrowRight' || e.key === 'Right') simsl(9999, sli, true);
      }); // swipe for touch devices

      var xDown = null;
      var xDiff = null;
      var timeDown = null;
      var startEl = null;

      var handleTouchStart = function handleTouchStart(e) {
        startEl = e.target;
        timeDown = Date.now();
        xDown = e.touches[0].clientX;
        xDiff = 0;
      };

      var handleTouchMove = function handleTouchMove(e) {
        xDiff = xDown - e.touches[0].clientX;
      };

      var handleTouchEnd = function handleTouchEnd(e) {
        if (startEl !== e.target) return;
        var swipeThreshold = 15; // px

        var swipeTimeout = 500; // ms

        if (Math.abs(xDiff) > swipeThreshold && Date.now() - timeDown < swipeTimeout) simsl(xDiff > 0 ? 9999 : -9999, sli, true);
      };

      ss.addEventListener('touchstart', handleTouchStart, false);
      ss.addEventListener('touchmove', handleTouchMove, false);
      ss.addEventListener('touchend', handleTouchEnd, false);
    } else if (count > 0) {
      // if we have only 1 or 2 items in the slider
      sli.classList.remove('js-ss-nojs');
      sli.classList.add('js-ss-inactive');
    }
  }); // keyboard focus

  var simslkey = function simslkey() {
    document.querySelectorAll('.js-simple-slider').forEach(function (item) {
      return item.classList.add('ss-keyboard');
    });
    document.body.removeEventListener('keydown', simslkey);
  };

  document.body.addEventListener('keydown', simslkey);
})();