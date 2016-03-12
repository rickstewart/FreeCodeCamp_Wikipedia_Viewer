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
	//var searchButton = document.getElementById('search-button');
	//var randomButton = document.getElementById('random-button');
	var searchBox = document.getElementById('search-box');
	//var responsesWrapper = document.getElementById('response-area');
	var randomURL = 'http://en.wikipedia.org/wiki/Special:Random';
	var searchURL = 'http://en.wikipedia.org/w/api.php?callback=?';  // Wiki searchURL uses Jsonp to avoid CORS issue.
	var jsonData = '';
	var str = '';
	var startSub = '';
	var searchBoxValue = '';

	function getSearchBoxValue() {
		if (searchBox.value.length !== 0) {        // if 'search box' not blank, proceed with search.
			searchBoxValue = searchBox.value;
			searchBoxValue = searchBoxValue.replace(/(\r\n|\n|\r)/gm, ''); // Wikipedia suggests removing line breaks.
			searchBox.value = '';
		}
	}

	function search() {
		$.getJSON(searchURL, {                 // build the query string by adding following parameters.
				action: 'query',
				generator: 'search',
				gsrnamespace: '0',
				gsrsearch: searchBoxValue,
				gsrlimit: '10',                    // limit generator to 10 results.
				prop: 'extracts',                  // get article extracts (truncated article text)
				exintro: '',
				exlimit: 'max',
				format: 'json'                     // return results formatted in json.
			})
			.done(function (data) {
				searchBoxValue = '';               // reset search box stored value.
				jsonData = data.query.pages;
				for (var prop in jsonData) {
					if (!jsonData.hasOwnProperty(prop)) {   // skip loop if the property is from prototype
						continue;
					}
					str = JSON.stringify(jsonData[prop], null, 4);
					var $div = $('<div>', {id: prop, class: 'response'});
					$('#response-area').append($div);
					startSub = str.indexOf('extract');
					str = '<p>' + str.substr(startSub + 11).split('</p>')[0] + '</p>';
					str = str.replace(/\\(?!\n)/g, '');     // remove any backslash not part of a newline.
					$(str).appendTo('#' + prop);
				}
			});
	}


	$('#random-button').click(function () {        // add event listener to 'Random Search' button.
		window.open(randomURL);                    // open a new window, do a random page search.
	});

	$('#search-button').click(function () {        // add event listener to 'Search' button.
		getSearchBoxValue();
		search();
	});

	$('#search-box').click(function () {               // add event listener to Search Box.
		if (event.which === 13) {                  // test for Enter key.
			getSearchBoxValue();
			search();                              // run search on Search Box contents.
		}
	});

	$('#response-area').click(function(e) {
		if($(e.target).parent().closest('div').attr('class') === 'response') {
			var articleID = $(e.target).parent().closest('div').attr('id');
			window.open('http://en.wikipedia.org/wiki?curid=' + articleID);
		}
		//else if($(e.target) === 'p'){
		//	window.open('http://en.wikipedia.org/wiki?curid=' + $(e.target).closest('div').attr('id'));
		//}
	});

}
$(document).ready(function () {
	wikipediaViewerMain();                         // run program on page load.
});

