(function() {

    var CURR_SEARCH_DATA = {};
    var Q_PARAMS = "";
    var MAX_RESULTS_PER_CALL = 10;
    var CURR_TOTAL_RESULTS = 0;
    var CURR_TOTAL_PAGES = 0;
    var CURR_PAGE_NO = 0;
    var SEARCH_DATA = {};

    var sortNumber = function sortNumber(a,b) {
        return a - b;
    };
    var getUniques = function getUniques(arr) {
        var a = [];
        for (var i=0, l=arr.length; i<l; i++)
            if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
                a.push(arr[i]);
        return a;
    };


    var loadingText = function loadingText(target, message, index, interval) {
        if (index < message.length) {
            $(target).append(message[index++]);
            setTimeout(function () { loadingText(target, message, index, interval); }, interval);
        } else {
            $(target).html("");
            index = 0;
            setTimeout(function () { loadingText(target, message, index, interval); }, interval);
        }
    };

    var updateHeadingText = function updateHeadingText(content) {
        var qtext = "";
        if (content !== undefined) {
            qtext = content;
        } else {
            if (Q_PARAMS === "") {
                Q_PARAMS = getUrlVars().q;
                Q_PARAMS = Q_PARAMS.split("+").join(" ");
            }
            qtext = "Here are your search results for \"" + Q_PARAMS + "\"";
        }
        $(".searchresultspage .content-post p:first-child").html(qtext);
    };

    var getPaginationNos = function getPaginationNos() {
        var showPages = [];
        if (CURR_TOTAL_PAGES === 1) {
            showPages.push(1);
            return showPages;
        } else if (CURR_TOTAL_PAGES === 0) {
            return showPages;
        } else if (CURR_TOTAL_PAGES > 1 && CURR_TOTAL_PAGES <= 5) {
            for (var i=1; i<=CURR_TOTAL_PAGES; i++) {
                showPages.push(i);
            }
        } else {
            showPages.push(1);
            showPages.push(CURR_TOTAL_PAGES);
            showPages.push(CURR_PAGE_NO);
            if (CURR_PAGE_NO === 1) {
                showPages.push(2)
                showPages.push(3);
            } else if (CURR_PAGE_NO === CURR_TOTAL_PAGES) {
                showPages.push(CURR_TOTAL_PAGES-1);
                showPages.push(CURR_TOTAL_PAGES-2);
            } else {
                showPages.push(CURR_PAGE_NO - 1);
                showPages.push(CURR_PAGE_NO + 1);
            }
        }
        showPages.sort(sortNumber);
        showPages = getUniques(showPages);
        return showPages;
    };

    var generatePagination = function generatePagination() {
        if (CURR_TOTAL_PAGES > 1) {
            var page_div = $(".receivedsearch .wp-pagenavi");
            var pagi_html = "";
            if (CURR_PAGE_NO === 0 && CURR_TOTAL_PAGES > 0) {
                CURR_PAGE_NO = 1;
            } else if (CURR_PAGE_NO < CURR_TOTAL_PAGES) {
                CURR_PAGE_NO++;
            }
            if (CURR_PAGE_NO > 1) {
                pagi_html = pagi_html + "<a rel=\"nofollow\" href=\"#page1\">« First</a>";
                pagi_html = pagi_html + "<a rel=\"nofollow\" href=\"#page" + (CURR_PAGE_NO - 1).toString() + "\">« Previous</a>";
            }

            var pageNos = getPaginationNos();
            for (var i=0; i<pageNos.length; i++) {
                if (pageNos[i] === CURR_PAGE_NO) {
                    pagi_html = pagi_html + "<span class=\"current\">" + pageNos[i] + "</span>";
                } else {
                    pagi_html = pagi_html + "<a rel=\"nofollow\" href=\"#page" + (pageNos[i]).toString() + "\">" + pageNos[i] + "</a>";
                }
                if (pageNos[i] !== CURR_TOTAL_PAGES) {
                    if (pageNos[i] !== (pageNos[i+1] - 1)) {
                        pagi_html = pagi_html + "<span>...</span>";
                    }
                }
            }

            if (CURR_PAGE_NO < CURR_TOTAL_PAGES) {
                pagi_html = pagi_html + "<a rel=\"nofollow\" href=\"#page" + (CURR_PAGE_NO + 1).toString() + "\">Next »</a>";
                pagi_html = pagi_html + "<a rel=\"nofollow\" href=\"#page" + (CURR_TOTAL_PAGES).toString() + "\">Last »</a>";
            }

            page_div.html(pagi_html);
        }
    };

    var processSearchResults = function processSearchResults() {
        try {
            CURR_TOTAL_RESULTS = parseInt(CURR_SEARCH_DATA.searchInformation.totalResults);
            CURR_TOTAL_PAGES = parseInt(CURR_TOTAL_RESULTS) / parseInt(MAX_RESULTS_PER_CALL);
            CURR_TOTAL_PAGES = Math.ceil(CURR_TOTAL_PAGES);
            console.log(CURR_TOTAL_RESULTS);
            console.log(CURR_TOTAL_PAGES);
            generatePagination();
        } catch(e) {}
    };

    var getSearchResults = function getAllRecipes() {
        var url = '/boomboomisgood/searchtest6.php';
        // var url = 'https://www.googleapis.com/customsearch/v1?q=Paneer+Sweet&cx=013661604466927761390:v6ucpipysmm&key=AIzaSyCbHP_dsEH_LAsGm261_GQhZb3_2URz3wY';
        var request = {
                url : url,
                type : 'get',
                async : true,
                cache : true,
                dataType : 'json',
                headers : {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                beforeSend: function() {
                    $(".waitingforsearch").show();
                    $(".receivedsearch").hide();
                    loadingText(".gettingwait", "..........", 0, 200);
                },
                complete: function(){
                    $(".waitingforsearch").hide();
                    $(".receivedsearch").show();
                },
                success : function(data) {
                    console.log(data);
                    CURR_SEARCH_DATA = data;
                    processSearchResults();
                },
                error : function(data) {
                    $(".waitingforsearch").hide();
                    $(".receivedsearch").show();
                    updateHeadingText("Could not fetch search results");
                }
        };
        $.ajax(request);
    };

    var searchMainMethod = function mainMethod() {
        $(document).ready(function() {
            $(".receivedsearch").hide();
            $(".waitingforsearch").hide();
            updateHeadingText();
            getSearchResults();
        });
    };
    defer(searchMainMethod);
})();
