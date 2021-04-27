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
    createMovieCardContent,
    initPagination,
    getData
} from "./index";

setSearchFormEventListeners();

export function loadSearchResults(evt) {
    let xhr = new XMLHttpRequest();
    let pageValue = 1;
    let input = document.getElementById("searchInput");

    let url = BASE_URL + MOVIES_SEARCH_QUERY + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + pageValue + '&' + `query=${input.value}`;

    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let movieList = document.getElementById('movieList');
            let movieTitle = document.getElementById('movieTitle');

            let response = JSON.parse(xhr.responseText);

            movieList.innerHTML = ' ';
            movieTitle.textContent = `Found ${response.total_results} movies`;

            createMovieCardContent(movieList, response);

            let movieItem = document.getElementsByClassName('movie__item');
            setMovieCardClickListener(response, movieItem);
            initPagination(pageValue);
        }
    }

    getData(xhr, url);
    evt.preventDefault();
}

function setSearchFormEventListeners() {
    let searchForm = document.getElementById("searchForm");
    let input = document.getElementById('searchInput');

    input.addEventListener("keypress", function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                loadSearchResults();
            }
        }
    );

    searchForm.addEventListener("focusout", function () {
        input.style.borderBottom = 'none';
        input.value = '';
    });

    input.addEventListener('keypress', function () {
        input.style.borderBottom = 'solid #eeeeee 1px';
    });
}
