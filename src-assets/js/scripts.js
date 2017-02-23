let picturefill = require('picturefill');
let LazyLoad = require('vanilla-lazyload');
let common = require('./common');

window.addEventListener("DOMContentLoaded", function() {
    let myLazyLoad = new LazyLoad();
    common.backToTopEvtListener();
    common.backToTopShow();
});

