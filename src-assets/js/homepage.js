let picturefill = require('picturefill');
let LazyLoad = require('vanilla-lazyload');
let common = require('./common');

let slideTimer = 5000;
let intervalId;
let makeRadioChecked = function makeRadioChecked(idx) {
    let inputs = document.querySelectorAll(".slider_labels input[type='radio']");
    for (let i=0; i<inputs.length; i++) {
        inputs[0].checked = false;
    }
    inputs[idx-1].checked = true;
};

let selectSlide = function selectSlide(event) {
    let slides = document.querySelector(".slider_images");
    if (slides !== undefined && slides !== null) {
        let tar = null;
        if (undefined !== event) {
            tar = event.target || event.srcElement;
        }
        if (null === tar || undefined === tar) {
            let nextslide = -1;
            let currentslide = -1;
            let tot = slides.children.length;
            for (let i=1; i<=tot; i++) {
                if (slides.classList.contains("show" + i)) {
                    currentslide = i;
                }
            }
            if (currentslide > -1) {
                nextslide = currentslide + 1 > tot ? 1 : currentslide + 1;
            }

            if (nextslide > -1) {
                slides.classList.add("show" + nextslide);
                slides.classList.remove("show" + currentslide);
                makeRadioChecked(nextslide);
            }
        } else {
            let idx = tar.id.slice(-1);
            for (let j=1; j<=slides.children.length; j++) {
                slides.classList.remove("show" + j);
            }
            slides.classList.add("show" + idx);
            clearInterval(intervalId);
            intervalId = window.setInterval(selectSlide, slideTimer);
        }
    }
};

let genRandom = function genRandom(max) {
    return Math.floor(Math.random() * max)
};

let createSliderHtml = function createSliderHtml(data, numbers, max) {
    let html = "";
    for (let i=0; i<numbers.length; i++) {
        let caption = data[numbers[i]].recipeShortDesc;
        let title = data[numbers[i]].recipeTitle;
        let url = data[numbers[i]].recipeUrl;
        let curr = data[numbers[i]].recipeMainImage;
        while (caption === "" || caption === null) {
            let num = genRandom(max);
            caption = data[num].recipeShortDesc;
            title = data[num].recipeTitle;
            url = data[num].recipeUrl;
            curr = data[num].recipeMainImage;
        }
        curr = curr.split(".");
        html += "<div class='slide_image'>" +
            "<div class=\"figure\"><picture aria-labelledby=\"slide_image_" + i + "\"><source media=\"(min-width: 320px)\"" +
            " srcset=\"/assets/blogposts/recipeimages/" +
            curr[0] + "-w750h300." + curr[1] + " 750w," +
            "/assets/blogposts/recipeimages/" +
            curr[0] + "-w699h262." + curr[1] + " 699w," +
            "/assets/blogposts/recipeimages/" +
            curr[0] + "-w571h214." + curr[1] + " 571w," +
            "/assets/blogposts/recipeimages/" +
            curr[0] + "-w411h154." + curr[1] + " 411w," +
            "/assets/blogposts/recipeimages/" +
            curr[0] + "-w251h94." + curr[1] + " 251w\"" +
            " sizes=\"(max-width: 420px) 251px," +
            "((min-width: 421px) and (max-width: 600px)) 411px," +
            "((min-width: 601px) and (max-width: 768px)) 571px," +
            "((min-width: 769px) and (max-width: 1024px)) 699px," +
            "(min-width: 1025px) 750px\" />" +
            "<img src=\"/assets/blogposts/recipeimages/" +
            curr[0] + "-w699h262." + curr[1] + "\" alt=\"" + title + "\"></picture>" +
            "<div id=\"slide_image_" + i + "\" class=\"figcaption\" property=\"name\"><a href=\"" + url + "\" rel='bookmark'>" + title + "</a>";
        if (caption !== "" && caption !== null) {
            html += "<br><p class=\"desc\">" + caption + "</p></div></div></div>\n";
        } else {
            html += "<br><p class=\"desc\">&nbsp;</p></div></div></div>\n";
        }
    }
    document.querySelector(".slider_images").innerHTML = html;
};

let getRandomPosts = function getRandomPosts() {
    let request = new XMLHttpRequest();
    request.open('GET', '/services/allrecipes', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        // Success!
        let data = JSON.parse(request.responseText);
        let total = data.length;
        let numbers = [genRandom(total), genRandom(total), genRandom(total), genRandom(total), genRandom(total)];
        createSliderHtml(data, numbers, total);
      } else {
        // We reached our target server, but it returned an error

      }
    };
    request.onerror = function() {
      // There was a connection error of some sort
    };
    request.send();
};

let slideChanger = function slideChanger() {
    let obj = document.querySelectorAll(".slider_labels input[type='radio']");
    if (undefined !== obj && null !== obj) {
        for (let i=0; i<obj.length;i++) {
            if (i === 0) {
                obj[i].checked = true;
            }
            obj[i].addEventListener("change", selectSlide);
        }
        let intervalId = window.setInterval(selectSlide, slideTimer);
    }
};

window.addEventListener("DOMContentLoaded", function() {
    let myLazyLoad = new LazyLoad();
    getRandomPosts();
    slideChanger();
    common.backToTopEvtListener();
    common.backToTopShow();
});


