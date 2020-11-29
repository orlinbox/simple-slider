"use strict";

/*!
MIT License | Copyright (c) 2021 | orlinbox | https://github.com/orlinbox/simple-slider
SS version 3.0
*/
(function () {
  /*
    <div class="js-simple-slider js-ss-nojs" data-ss-delay="7500" role="region" aria-label="Simple slider">
      <ul class="js-ss">
        <li>Slide content 1</li>
        <li>Slide content 2</li>
        <li>Slide content 3</li>
      </ul>
      <!-- wrapper is optional, navigation elements are optional -->
      <div class="ss-nav-wrap">
        <div class="js-ss-prev" tabindex="0" role="button" aria-label="Previous slide">Prev</div>
        <ul class="js-ss-nav" aria-hidden="true"></ul>
        <div class="js-ss-next" tabindex="0" role="button" aria-label="Next slide">Next</div>
      </div>
    </div>
  */
  if (!window.ss) window.ss = {}; // elements with focus

  window.ss.focusElements = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe'; // action method

  window.ss.action = function (goToPosition, slider, disableAutoRotate) {
    var goTo = goToPosition; // disable autorotate feature

    if (disableAutoRotate) clearInterval(slider.ssTimer); // current position

    var positionCurrent = parseInt(slider.getAttribute('data-ss-position') - 1, 10); // move logic and action

    if (goTo !== positionCurrent) {
      var totalSlides = parseInt(slider.getAttribute('data-ss-length'), 10);
      var goToNext = null;
      var goToPrev = null;
      if (goTo === 999) goTo = positionCurrent + 1;
      if (goTo === -999) goTo = positionCurrent - 1;
      if (goTo > totalSlides - 1) goTo = 0;
      if (goTo < 0) goTo = totalSlides - 1;
      slider.setAttribute('data-ss-position', goTo + 1);
      goToNext = goTo + 1;
      if (goToNext > totalSlides - 1) goToNext = 0;
      if (goToNext < 0) goToNext = totalSlides - 1;
      goToPrev = goTo - 1;
      if (goToPrev > totalSlides - 1) goToPrev = 0;
      if (goToPrev < 0) goToPrev = totalSlides - 1;
      slider.querySelectorAll('.js-ss li').forEach(function (li, index) {
        li.removeAttribute('class');
        li.setAttribute('aria-hidden', true);
        li.querySelectorAll(window.ss.focusElements).forEach(function (item) {
          return item.setAttribute('tabindex', -1);
        });

        if (index === goTo) {
          li.classList.add('js-ss-sl-current');
          li.removeAttribute('aria-hidden');
          li.querySelectorAll(window.ss.focusElements).forEach(function (item) {
            return item.removeAttribute('tabindex');
          });
          var dotsForNavigation = slider.querySelectorAll('.js-ss-nav li');

          if (dotsForNavigation.length > 0) {
            dotsForNavigation.forEach(function (item) {
              return item.removeAttribute('class');
            });
            dotsForNavigation.item(goTo).classList.add('active');
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
  };

  window.ss.init = function () {
    // each slider
    document.querySelectorAll('.js-simple-slider:not(.js-processed)').forEach(function (slider) {
      var ss = slider.querySelector('.js-ss');
      var li = ss.querySelectorAll('li');
      var totalSlides = li.length; // once

      slider.classList.add('js-processed');

      if (totalSlides > 2) {
        // we have more than 2 items in the slider
        slider.classList.remove('js-ss-nojs');
        slider.setAttribute('data-ss-position', 0);
        slider.setAttribute('data-ss-length', totalSlides);
        var dotsForNavigation = slider.querySelector('.js-ss-nav') || false;
        if (dotsForNavigation) li.forEach(function () {
          return dotsForNavigation.innerHTML += '<li></li>';
        }); // wrap and clone slider content (for placeholder purposes) with disabled focus

        var wrapperEl = document.createElement('div');
        wrapperEl.classList.add('js-ss-wrap');
        slider.insertBefore(wrapperEl, slider.firstChild);
        wrapperEl.appendChild(ss);
        var ssPlaceholder = ss.cloneNode(true);
        ssPlaceholder.querySelectorAll(window.ss.focusElements).forEach(function (item) {
          return item.setAttribute('tabindex', -1);
        });
        ssPlaceholder.classList.remove('js-ss');
        ssPlaceholder.classList.add('js-ss-placeholder');
        ssPlaceholder.setAttribute('aria-hidden', true);
        wrapperEl.appendChild(ssPlaceholder); // init slider

        window.ss.action(0, slider); // autorotate feature

        var timer = slider.getAttribute('data-ss-delay') || 0;
        if (timer > 0) slider.ssTimer = setInterval(function () {
          return window.ss.action(999, slider);
        }, timer); // click prev-next image

        li.forEach(function (item) {
          return item.addEventListener('click', function (elm) {
            if (elm.currentTarget.classList.contains('js-ss-sl-left')) window.ss.action(-999, slider, true);
            if (elm.currentTarget.classList.contains('js-ss-sl-right')) window.ss.action(999, slider, true);
          });
        }); // click prev-next button / press keyboard enter key

        var nextBtn = slider.querySelector('.js-ss-next') || false;

        if (nextBtn) {
          nextBtn.addEventListener('click', function () {
            return window.ss.action(999, slider, true);
          });
          nextBtn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') window.ss.action(999, slider, true);
          });
        }

        var prevBtn = slider.querySelector('.js-ss-prev') || false;

        if (prevBtn) {
          prevBtn.addEventListener('click', function () {
            return window.ss.action(-999, slider, true);
          });
          prevBtn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') window.ss.action(-999, slider, true);
          });
        } // click on navigation dot


        if (dotsForNavigation) dotsForNavigation.querySelectorAll('li').forEach(function (elm, index) {
          return elm.addEventListener('click', function () {
            return window.ss.action(index, slider, true);
          });
        }); // press keyboard left/right arrow keys

        document.body.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowLeft' || e.key === 'Left') window.ss.action(-999, slider, true);
          if (e.key === 'ArrowRight' || e.key === 'Right') window.ss.action(999, slider, true);
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
          var swipeThreshold = 20; // px

          var swipeTimeout = 500; // ms

          if (Math.abs(xDiff) > swipeThreshold && Date.now() - timeDown < swipeTimeout) window.ss.action(xDiff > 0 ? 999 : -999, slider, true);
        };

        ss.addEventListener('touchstart', handleTouchStart, false);
        ss.addEventListener('touchmove', handleTouchMove, false);
        ss.addEventListener('touchend', handleTouchEnd, false);
      } else if (totalSlides > 0) {
        // we have only 1 or 2 items in the slider
        slider.classList.remove('js-ss-nojs');
        slider.classList.add('js-ss-inactive');
      }
    });
  }; // init when DOM is ready


  document.addEventListener('DOMContentLoaded', function () {
    return window.ss.init();
  });
})();