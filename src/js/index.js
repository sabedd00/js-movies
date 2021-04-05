'use strict';

import Logo from '../images/tmdb-logo.svg';
import {loadMovieDetails} from "./movie-details.js";
import '../css/main.css';
import {
    API_KEY, BASE_IMAGE_URL,
    BASE_URL, BIG_IMAGE_SIZE,
    ENG_LANGUAGE,
    LANGUAGE_QUERY,
    QUERY_PAGE,
    QUERY_POPULAR_MOVIES,
} from "./config";

loadPopularMovies();

function loadPopularMovies() {
    let xhr = new XMLHttpRequest();
    let url = BASE_URL + QUERY_POPULAR_MOVIES + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + '1';

    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let response = JSON.parse(xhr.responseText);

            setPopularMoviesToUI(response);

            let popularMovieItem = document.getElementsByClassName('popular-movie__item');
            setMovieItemClickEventListener(response, popularMovieItem);
        }
    }

    getData(xhr, url);
}

function setPopularMoviesToUI(response) {
    let movieItem = document.getElementById('movieItem');
    movieItem.innerHTML = ' ';
    let movieTitle = document.getElementById('movieTitle');
    movieTitle.textContent = "Popular";
    document.body.style.background = '#1a143b';
    window.scroll(0, 0);

    response.results.forEach(function (movie) {
        let item = document.createElement('div');
        item.className = "popular-movie__item";
        item.id = "popularMovieItem";
        let poster = document.createElement('img');
        poster.className = "popular-movie__item__img";
        poster.id = "posterOfPopularMovie"
        poster.src = `${BASE_IMAGE_URL + BIG_IMAGE_SIZE + movie.poster_path}`;
        poster.alt = "Poster of a popular movie";
        let title = document.createElement('h3');
        title.className = "popular-movie__item__title";
        title.textContent = `${movie.title + ` (${new Date(movie.release_date).getFullYear()})`}`;
        item.append(poster, title);
        movieItem.appendChild(item);
    });
}

function setMovieItemClickEventListener(response, movieItem) {
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
