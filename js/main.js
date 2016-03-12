/**
 * Created by Rick on 3/4/2016.
 */
/**
 * set JSHint not to flag these variables as 'unresolved variable'
 * @param data.query.pages
 *
 */
'use strict';
function wikipediaViewerMain() {
    var searchButton = document.getElementById('search-button');
    var randomButton = document.getElementById('random-button');
    var searchBox = document.getElementById('search-box');
    //var responsesWrapper = document.getElementById('response-area');
    var randomURL = 'http://en.wikipedia.org/wiki/Special:Random';
    var searchURL = 'http://en.wikipedia.org/w/api.php?callback=?';  // Wiki searchURL uses Jsonp to avoid CORS issue.
    var jsonData = '';
    var str = '';
    var startSub = '';

    $(randomButton).click(function () {            // add event listener to 'Random Search' button.
        window.open(randomURL);
    });

    searchButton.onclick = function () {           // add event listener to 'Search' button.
        if (searchBox.value.length !== 0) {        // if 'search for' not blank, proceed with search.
            searchBox.value = searchBox.value.replace(/(\r\n|\n|\r)/gm, ''); // module 'Title Normalization' suggests removing line breaks.
            $.getJSON(searchURL, {                 // build the query string by adding following parameters.
                action: 'query',
                generator: 'search',
                gsrnamespace: '0',
                gsrsearch: searchBox.value,
                gsrlimit: '10',                // limit generator to 10 results.
                prop: 'extracts',              // get article extracts (truncated article text)
                exintro: '',
                exlimit: 'max',
                format: 'json'                 // return results formatted in json.
            })
            .done(function (data) {
                jsonData = data.query.pages;
                for (var prop in jsonData) {
                        if (!jsonData.hasOwnProperty(prop)) { // skip loop if the property is from prototype
                            continue;
                        }
                        str = JSON.stringify(jsonData[prop], null, 4);
                        var $div = $('<div>', {id: prop, class: 'response'});
                        $('#response-area').append($div);
                        startSub = str.indexOf('extract');
                        str = '<p>' + str.substr(startSub + 11).split('</p>')[0] + '</p>';
                        str = str.replace(/\\(?!\n)/g, '');  // remove any backslash not part of a newline.
                        $(str).appendTo('#' + prop);
                }
            });
        }
    };
}

$(document).ready(function () {
    wikipediaViewerMain();
});

//  ^(?!ABC$).*
// https://api.jquery.com/category/manipulation/dom-insertion-inside/
// http://www.w3schools.com/jquery/html_insertafter.asp
 // <div id="response"></div>
//#response {
//    margin: 4px auto;
//    Background-color: #fafafa;
//    width: 70%;
//    text-align: left;
//    padding: 20px;
//    border: solid 2px red;
//    border-radius: 16px;
//}

//var $div = $("<div>", {id: "foo", class: "a"});
//$div.click(function(){ /* ... */ });
//$("#box").append($div);iv);