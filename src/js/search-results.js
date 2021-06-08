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
    getData, createMovieListContent, initPagination
} from "./index";

setSearchFormEventListeners();
let evt;
setLoadSearchResultContentListener();

export function loadSearchResults(pageValue) {
    let xhr = new XMLHttpRequest();
    let input = document.getElementById('searchInput');
    let url = BASE_URL + MOVIES_SEARCH_QUERY + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + pageValue + '&' + `query=${input.value}`;

    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let mainContent = document.getElementById('mainContent');
            let response = JSON.parse(xhr.responseText);
            document.body.style.background = '#191919';
            mainContent.innerHTML = ' ';
            window.scrollTo({top: 0, behavior: 'smooth'});

            localStorage.setItem('inputValue', document.getElementById('searchInput').value);

            createMovieListContent(response);
            setNoSearchResultsAreAvailable(response);

            let movieItem = document.getElementsByClassName('movie__item');
            setMovieCardClickListener(response, movieItem);

            if (pageValue === undefined) {
                pageValue = 1;
                initPagination(pageValue, response);
            } else {
                initPagination(pageValue, response);
            }
        }
    }

    getData(xhr, url);
    evt.preventDefault();
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
                history.pushState({page: 'search', page_id: 1}, '', `search?page=${1}`);
                loadSearchResults(1);
            }
        }
    );

    input.addEventListener('keypress', function () {
        input.style.borderBottom = 'solid #eeeeee 1px';
    });

    searchButton.addEventListener('click', function (event) {
        event.preventDefault();
        history.pushState({page: 'search', page_id: 1}, '', `search?page=${1}`);
        loadSearchResults(1);
    })
}

function setLoadSearchResultContentListener() {
    window.addEventListener("load", function (event) {
        if (history.state.page === 'search') {
            let inputValue = localStorage.getItem('inputValue')
            loadSearchResults(history.state.page_id);
        }
    });
}

