/*
 * Swipe 2.0.0
 * Brad Birdsall
 * https://github.com/thebird/Swipe
 * Copyright 2013-2015, MIT License
 *
*/

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Swipe = factory();
  }
}(this, function () {
  'use strict';

  return function Swipe(container, options) {
    // utilities
    var noop = function () {}; // simple no operation function
    var offloadFn = function (fn) {setTimeout(fn || noop, 0);}; // offload a functions execution

    // quit if no root element
    if (!container) {
      return;
    }
    var element = container.children[0];
    var slides;
    var browser = {transitions: true, addEventListener: true};

    options = options || {};
    var index = 0;
    var slideSpeed = 0;
    var speed = options.speed || 2000;
    var minSpeed = options.minSpeed || 20;
    var height = options.height || 0;
    var delay = options.auto || 0;

    function setup() {
      // cache slides
      index = 0;
      slideSpeed = 0;
      slides = element.children;

      // determine width of each slide
      height = height || slides[0].getBoundingClientRect().height;

      element.style.height = (slides.length * height) + 'px';

      // stack elements
      var pos = slides.length;

      while (pos--) {
        var slide = slides[pos];

        slide.style.height = height + 'px';
        slide.setAttribute('data-index', pos);

        // slide.style.top = (height) + 'px';
        if (pos === 0) {
          move(pos, 0, 0);
        } else {
          move(pos, height, 0);
        }
      }

      container.style.visibility = 'visible';
    }

    function next() {
      slide(index);
    }

    function slide(to) {
      move(to, -height, slideSpeed || speed);
      move(to + 1, 0, slideSpeed || speed);
      offloadFn(options.callback && options.callback(index, slides[index]));
    }

    function circle(index) {
      // a simple positive modulo using slides.length
      return (slides.length + (index % slides.length)) % slides.length;
    }

    function move(to, dist, speed) {
      translate(to, dist, speed);
      // slidePos[index] = dist;
    }

    function translate(to, dist, speed) {
      var slide = element.children[to - index];
      var style = slide && slide.style;

      if (!style) {
        return;
      }

      style.webkitTransitionDuration = speed + 'ms';
      style.MozTransitionDuration = speed + 'ms';
      style.msTransitionDuration = speed + 'ms';
      style.OTransitionDuration = speed + 'ms';
      style.transitionDuration = speed + 'ms';
      style.webkitTransform = 'translate3d(0, ' + dist + 'px, 0)';
      // style.webkitTransform = 'translate3d(0, ' + dist + ' px, 0)';
      // style.top = dist + 'px';
    }

    // setup auto slideshow
    var interval;

    function begin() {
      clearTimeout(interval);
      interval = setTimeout(next, delay);
    }

    function stop() {
      delay = 0;
      clearTimeout(interval);
    }

    // setup event capturing
    var events = {
      handleEvent: function (event) {
        switch (event.type) {
          case 'webkitTransitionEnd':
          case 'msTransitionEnd':
          case 'oTransitionEnd':
          case 'otransitionend':
          case 'transitionend': offloadFn(this.transitionEnd(event)); break;
          case 'resize': offloadFn(setup); break;
          default: break;
        }
      },
      transitionEnd: function (event) {
        if (parseInt(event.target.getAttribute('data-index'), 10) == circle(index + 1)) {
          var prev = element.children[0];

          // prev.style.top = height + 'px';
          prev.style.webkitTransform = 'translate3d(0, ' + height + 'px, 0';
          element.append(prev);
          index = circle(index + 1);
          if (delay) {
            begin();
          }
        }
      }
    };

    // trigger setup
    setup();

    // start auto slideshow if applicable
    if (delay) {
      setTimeout(begin, delay);
    }

    // add event listeners
    if (browser.addEventListener) {
      // set resize event on window
      window.addEventListener('resize', events, false);
    }

    if (browser.transitions) {
      element.addEventListener('webkitTransitionEnd', events, false);
      element.addEventListener('msTransitionEnd', events, false);
      element.addEventListener('oTransitionEnd', events, false);
      element.addEventListener('otransitionend', events, false);
      element.addEventListener('transitionend', events, false);
    }

    // expose the Swipe API
    return {
      setup: function () {
        setup();
      },
      begin: function (auto) {
        delay = auto === undefined ? (options.auto || 0) : auto;
        delay && begin();
      },
      stop: function () {
        // stop auto scroll
        stop();
      },
      updateSpeed: function (msec, set = false) {
        if (set) {
          slideSpeed = msec > minSpeed ? msec : minSpeed;
          console.log('==update speed==', slideSpeed);

          return;
        }
        if (!slideSpeed) {
          slideSpeed = speed;
        }
        if (slideSpeed + msec > minSpeed) {
          slideSpeed = slideSpeed + msec;
        } else {
          slideSpeed = minSpeed;
        }
        console.log('==update speed==', slideSpeed);
      },
      kill: function () {
        // cancel slideshow
        stop();
        // reset element
        element.style.height = '';
        // element.style.top = '';
        element.style.webkitTransform = '';
        slideSpeed = 0;
        // reset slides
        var pos = slides.length;

        while (pos--) {
          var slide = slides[pos];

          slide.style.height = '';
          slide.style.top = '';
          slide.style.webkitTransform = '';
          // if (browser.transitions) {
          //   translate(pos, 0, 0);
          // }
        }
        // removed event listeners
        if (browser.addEventListener) {
          // remove current event listeners
          element.removeEventListener('webkitTransitionEnd', events, false);
          element.removeEventListener('msTransitionEnd', events, false);
          element.removeEventListener('oTransitionEnd', events, false);
          element.removeEventListener('otransitionend', events, false);
          element.removeEventListener('transitionend', events, false);
          window.removeEventListener('resize', events, false);
        }
      }
    };
  };
}));
