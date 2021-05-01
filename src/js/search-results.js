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
    initPagination,
    getData, createMovieListContent
} from "./index";

setSearchFormEventListeners();

export function loadSearchResults(evt) {
    let xhr = new XMLHttpRequest();
    let pageValue = 1;
    let input = document.getElementById("searchInput");

    let url = BASE_URL + MOVIES_SEARCH_QUERY + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + pageValue + '&' + `query=${input.value}`;

    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let mainContent = document.getElementById('mainContent');
            let footer = document.getElementById('footer');
            let response = JSON.parse(xhr.responseText);

            mainContent.innerHTML = ' ';

            createMovieListContent(response);

            let movieTitle = document.getElementById('movieTitle');
            if (response.total_results === 0) {
                movieTitle.textContent = `Movie not found`;
                movieTitle.style.textAlign = 'center';
                footer.style.position = 'absolute';
                footer.style.bottom = '0';
                footer.style.width = '100%'
            } else {
                movieTitle.textContent = `Found ${response.total_results} movies`;
                movieTitle.style.textAlign = 'left';
                footer.style.position = 'relative';
                initPagination(pageValue);
            }

            let movieItem = document.getElementsByClassName('movie__item');
            setMovieCardClickListener(response, movieItem);
        }
    }

    getData(xhr, url);
    evt.preventDefault();
}

export function setSearchFormEventListeners() {
    let input = document.getElementById('searchInput');

    input.addEventListener("keypress", function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                loadSearchResults();
            }
        }
    );

    input.addEventListener('keypress', function () {
        input.style.borderBottom = 'solid #eeeeee 1px';
    });
}
