'use strict';

import Logo from '../images/tmdb-logo.svg';
import {loadMovieDetails} from "./movie-details.js";
import '../css/index.css';
import {
    API_KEY, BASE_IMAGE_URL,
    BASE_URL, BIG_IMAGE_SIZE,
    ENG_LANGUAGE,
    LANGUAGE_QUERY,
    QUERY_PAGE,
    QUERY_POPULAR_MOVIES,
} from "./config";
import {createMovieCardContent} from "./search-results";

setHeaderLogoOnClickListener();
loadPopularMovies();

function loadPopularMovies() {
    let xhr = new XMLHttpRequest();
    let url = BASE_URL + QUERY_POPULAR_MOVIES + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + '1';

    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let movieItem = document.getElementById('movieItem');
            let movieTitle = document.getElementById('movieTitle');
            movieItem.innerHTML = ' ';
            movieTitle.textContent = "Popular";

            document.body.style.background = '#1a143b';
            let response = JSON.parse(xhr.responseText);

            createMovieCardContent(movieItem, response);

            let popularMovieItem = document.getElementsByClassName('popular-movie__item');
            setMovieCardClickListener(response, popularMovieItem);
        }
    }

    getData(xhr, url);
}

export function setMovieCardClickListener(response, movieItem) {
    for (let i = 0; i < movieItem.length; i++) {
        movieItem[i].addEventListener('click', () => {
            let id = response.results[i].id;
            loadMovieDetails(id);
        });
    }
}

export function getData(xhr, url) {
    xhr.open('GET', url, true);
    xhr.send();
}

function setHeaderLogoOnClickListener() {
    let headerLogo = document.getElementById('headerLogo');
    headerLogo.addEventListener('click', function () {
        window.location.reload();
    })
}
