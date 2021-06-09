'use strict';

import {
    API_KEY,
    BASE_URL,
    ENG_LANGUAGE,
    LANGUAGE_QUERY,
    MOVIES_SEARCH_QUERY,
    QUERY_PAGE
} from "./config";
import {
    setMovieCardClickListener,
    getData, createMovieListContent, initPagination, saveInputValue, getSearchResults
} from "./index";

setSearchFormEventListeners();

export function loadSearchResults(pageValue) {
    let xhr = new XMLHttpRequest();
    let input = document.getElementById('searchInput');
    let url = BASE_URL + MOVIES_SEARCH_QUERY + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + pageValue + '&' + `query=${input.value}`;

    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let response = JSON.parse(xhr.responseText);
            document.body.style.background = '#191919';
            window.scrollTo({top: 0});
            saveInputValue();

            createMovieListContent(response);
            setNoSearchResultsAreAvailable(response);

            let movieItem = document.getElementsByClassName('movie__item');
            setMovieCardClickListener(response, movieItem);

            initPagination(pageValue, response);
        }
    }
    getData(xhr, url);
}

function setNoSearchResultsAreAvailable(response) {
    let movieTitle = document.getElementById('movieTitle');
    if (response.total_results === 0) {
        movieTitle.textContent = `Movie not found`;
        movieTitle.style.textAlign = 'center';
        document.getElementById('pagination').remove();
    } else {
        movieTitle.textContent = `Found ${response.total_results} movies`;
        movieTitle.style.textAlign = 'center';
    }
}

export function setSearchFormEventListeners() {
    let input = document.getElementById('searchInput');
    let searchButton = document.getElementById('searchButton');

    input.addEventListener("keypress", function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                getSearchResults(1);
            }
        }
    );

    input.addEventListener('keypress', function () {
        input.style.borderBottom = 'solid #eeeeee 1px';
    });

    searchButton.addEventListener('click', function (event) {
        event.preventDefault();
        getSearchResults(1);
    })
}

