function defer(method) {
    if (window.jQuery) {
        method();
    } else {
        setTimeout(function() { defer(method); }, 50);
    }
}

function sortData(arr, key, reverse) {
    sorted = arr.sort(function(a,b) {
          var akey = a[key], bkey = b[key];
          return akey > bkey ? 1 : akey < bkey ? -1 : 0;
    });
    if (reverse === true) {
        return sorted.reverse();
    } else {
        return sorted;
    }
}

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

// Scroll to Top
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

// https://stackoverflow.com/questions/12199363/scrollto-with-animation
// main function
function scrollToY(scrollTargetY, speed, easing) {
    // scrollTargetY: the target scrollY property of the window
    // speed: time in pixels per second
    // easing: easing equation to use

    var scrollY = window.scrollY,
        currentTime = 0;
    scrollTargetY = scrollTargetY || 0,
    speed = speed || 2000,
    easing = easing || 'easeOutSine';

    // min time .1, max time .8 seconds
    var time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 0.8));

    // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
    var PI_D2 = Math.PI / 2,
        easingEquations = {
            easeOutSine: function (pos) {
                return Math.sin(pos * (Math.PI / 2));
            },
            easeInOutSine: function (pos) {
                return (-0.5 * (Math.cos(Math.PI * pos) - 1));
            },
            easeInOutQuint: function (pos) {
                if ((pos /= 0.5) < 1) {
                    return 0.5 * Math.pow(pos, 5);
                }
                return 0.5 * (Math.pow((pos - 2), 5) + 2);
            }
        };

    // add animation loop
    function tick() {
        currentTime += 1 / 60;
        var p = currentTime / time;
        var t = easingEquations[easing](p);
        if (p < 1) {
            requestAnimFrame(tick);
            window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
        } else {
            window.scrollTo(0, scrollTargetY);
        }
    }
    // call it once to get started
    tick();
}

function backToTopShow() {
    var backToTop = document.querySelector("#backtotopbutton");
    window.addEventListener('scroll', function() {
        if (window.pageYOffset >= 800) {
            backToTop.setAttribute('style', 'display: block');
        } else {
            backToTop.setAttribute('style', 'display: none');
        }
    });
}

function backToTopEvtListener() {
    var backToTop = document.querySelector("#backtotopbutton");
    backToTop.addEventListener("click", function() {
        scrollToY(0, 1500, 'easeInOutQuint');
    });
}
