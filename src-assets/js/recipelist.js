let $ = require('jquery');
let common = require('./common');

let ORIGINAL_DATA = [];
let CURR_DATA = [];
let CURR_VIEW = 'image';
let CURR_SORT = 'date_desc';

let listView = function listView(data) {
    if (undefined === data) {
        data = CURR_DATA;
    }
    let recipeHtml = "";
    for (let i = 0; i< data.length; i++) {
        let currRecipe = data[i];
        recipeHtml += '<li>' + '<a class="recipelistname" href="' +
        currRecipe.recipeUrl + '" target="' + currRecipe.recipeTitle + '">' + currRecipe.recipeTitle + ' ';
        if (currRecipe.recipeShortDesc !== '' && currRecipe.recipeShortDesc !== null) {
            recipeHtml += '<span>' + currRecipe.recipeShortDesc + '</span>';
        }
        recipeHtml += '</a></li>';
    }
    $('.recipelistentries ul').html(recipeHtml);
    $('.recipeentries').addClass('hide');
    $('.recipelistentries').removeClass('hide');
    $('.sortingoptions .selected').removeClass('selected');
    $('.viewbylist').addClass('selected');
};

let imageView = function imageView(data) {
    if (undefined === data) {
        data = CURR_DATA;
    }
    let recipeHtml = "";
    for (let i = 0; i< data.length; i++) {
        let currRecipe = data[i];
        let currRecImage = '';
        if (currRecipe.recipeMainImage !== '') {
            let tempImg = currRecipe.recipeMainImage.split('/').slice(-1)[0];
            tempImg = tempImg.split('.');
            currRecImage = "/assets/blogposts/recipeimages/" + tempImg[0] + "-w411h308." + tempImg[1];
        }
        recipeHtml += '<div class="recipeentry column">' +
            '<a class="recipeentryimage" href="' + currRecipe.recipeUrl + '"><img src="' + currRecImage + '" alt="' +
            currRecipe.recipeTitle + '"></a>' +
            '<div class="recipelisttitle">' +
            '<p class="recipename"><a href="' + currRecipe.recipeUrl + '">' + currRecipe.recipeTitle + '</a></p>';
        if (currRecipe.recipeShortDesc !== '' && currRecipe.recipeShortDesc !== null) {
            recipeHtml += '<p class="desc"><a href="' + currRecipe.recipeUrl + '">' + currRecipe.recipeShortDesc + '</a></p>';
        }
        recipeHtml += '</div></div>';
    }
    $('.recipeentries').html(recipeHtml);
    $('.recipeentries').removeClass('hide');
    $('.recipelistentries').addClass('hide');
    $('.sortingoptions .selected').removeClass('selected');
    $('.viewbyimage').addClass('selected');
};

let displayRecipes = function displayRecipes(data) {
    if (undefined === data) {
        data = CURR_DATA;
    }
    if ($('.sortingoptions .selected').hasClass('viewbylist')) {
        listView(data);
    } else {
        imageView(data);
    }
};

let parseRecipeDate = function parseRecipeDate() {
    for (let i=0; i<CURR_DATA.length; i++) {
        let dateParts = CURR_DATA[i].recipeDateTime.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/);
        CURR_DATA[i].timestamp = new Date(dateParts[1], parseInt(dateParts[2], 10) - 1, parseInt(dateParts[3], 10), parseInt(dateParts[4], 10), parseInt(dateParts[5], 10));
    }
};

let getAllRecipes = function getAllRecipes() {
    let url = '/services/allrecipes/';
    let request = {
            url : url,
            type : 'get',
            async : true,
            cache : true,
            dataType : 'json',
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            success : function(data) {
                ORIGINAL_DATA = data;
                CURR_DATA = ORIGINAL_DATA.slice(0);
                parseRecipeDate();
                if (CURR_DATA.length > 0) {
                    displayRecipes();
                }
            }
    };
    $.ajax(request);
};

let mainMethod = function mainMethod() {

    $(document).ready(function() {
        getAllRecipes();

        $('.recipelistview').click(function(event) {
            event.preventDefault();
            listView();
        });

        $('.recipeimageview').click(function(event) {
            event.preventDefault();
            imageView();
        });

        $('.recipesortasc').click(function(event) {
            event.preventDefault();
            CURR_DATA = common.sortData(CURR_DATA, 'recipeTitle');
            displayRecipes(CURR_DATA);
            $(this).parent().siblings().removeClass('hide');
            $(this).parent().addClass('hide');
        });

        $('.recipesortdesc').click(function(event) {
            event.preventDefault();
            CURR_DATA = common.sortData(CURR_DATA, 'recipeTitle', true);
            displayRecipes(CURR_DATA);
            $(this).parent().siblings().removeClass('hide');
            $(this).parent().addClass('hide');
        });

        $('.recipesortdateoldestfirst').click(function(event) {
            event.preventDefault();
            CURR_DATA = common.sortData(CURR_DATA, 'timestamp');
            displayRecipes(CURR_DATA);
            $(this).parent().siblings().removeClass('hide');
            $(this).parent().addClass('hide');
        });

        $('.recipesortdaterecentfirst').click(function(event) {
            event.preventDefault();
            CURR_DATA = common.sortData(CURR_DATA, 'timestamp', true);
            displayRecipes(CURR_DATA);
            $(this).parent().siblings().removeClass('hide');
            $(this).parent().addClass('hide');
        });

    });

};

window.addEventListener("DOMContentLoaded", function() {
    common.backToTopEvtListener();
    common.backToTopShow();
    mainMethod();
});
