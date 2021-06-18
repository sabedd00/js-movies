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
    getData, saveInputValue, setMovieList, scrollToTop
} from "./index";
import {initPagination, getSearchResults} from './pagination';

setSearchFormEventListeners();

export function loadSearchResults(pageValue) {
    let xhr = new XMLHttpRequest();
    let input = document.getElementById('searchInput');
    let url = BASE_URL + MOVIES_SEARCH_QUERY + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + pageValue + '&' + `query=${input.value}`;

    setSearchResultsOnLoadEventListener(xhr, pageValue);
    getData(xhr, url);
}

function setSearchResultsOnLoadEventListener(xhr, pageValue) {
    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            document.body.style.background = '#191919';
            let response = JSON.parse(xhr.responseText);
            scrollToTop();
            setMovieList(xhr, response);
            setEmptySearchResults(response);
            initPagination(pageValue, response);
            saveInputValue();
        }
    }
}

function setEmptySearchResults(response) {
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
    setEnterKeypressListener();
    setSearchButtonClickListener();
}

function setEnterKeypressListener() {
    document.getElementById('searchInput').addEventListener("keypress", function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                getSearchResults(1);
            }
        }
    );
}

function setSearchButtonClickListener() {
    document.getElementById('searchButton').addEventListener('click', function (event) {
        event.preventDefault();
        getSearchResults(1);
    });
}
