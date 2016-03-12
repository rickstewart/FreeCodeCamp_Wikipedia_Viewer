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

	/* function search(), using JSONP, first builds the query string */
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

	/*  */
	function displaySearchResults(jsonData) {
		searchBoxValue = '';               // reset search box stored value.
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
	}

	/* function provides an event listener for the random search button, and on a click event does
	 * a random article query on Wikipedia.  */
	$('#random-button').click(function () {
		window.open(randomURL);                    // open a new window, do a random page search.
	});

	/* function provides an event listener for the search button, and on a click event does
	 * an article query on Wikipedia using user's search criteria.  */
	$('#search-button').click(function () {
		getSearchBoxValue();                       // update variable holding search criteria.
		search();                                  // run search.
	});

	/* function provides an event listener for the search box, and detects the Enter key. On Enter key, do
	 * an article query on Wikipedia using user's search criteria. */
	$('#search-box').click(function () {
		if (event.which === 13) {                  // test for Enter key.
			getSearchBoxValue();                   // update variable holding search criteria.
			search();                              // run search.
		}
	});

	/* function detects if a Wikipedia article summary has been clicked, and if so the article is displayed */
	$('#response-area').click(function (e) {
		if ($(e.target).parent().closest('div').attr('class') === 'response') { // selects for article text.
			var articleID = $(e.target).parent().closest('div').attr('id');     // finds the id of the div.
			window.open('http://en.wikipedia.org/wiki?curid=' + articleID);     // get article.
		}
		else if ($(e.target).closest('div').attr('class') === 'response') {   // else selects border area around text.
			window.open('http://en.wikipedia.org/wiki?curid=' + $(e.target).closest('div').attr('id')); // get article.
		}
	});

}

/* function runs main script when page has loaded. Program entry point. */
$(document).ready(function () {
	wikipediaViewerMain();
});

