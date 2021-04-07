'use strict';

import Logo from '../images/tmdb-logo.svg';
import { loadMovieDetails } from "./movie-details.js";
import '../css/main.css';
import {
    API_KEY, BASE_IMAGE_URL,
    BASE_URL, BIG_IMAGE_SIZE,
    ENG_LANGUAGE,
    LANGUAGE_QUERY,
    QUERY_PAGE,
    QUERY_POPULAR_MOVIES,
} from "./config";
import { loadSearchResults } from './search-results'

loadPopularMovies();

function loadPopularMovies() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let movieItem = document.getElementById('movieItem');
            let movieTitle = document.getElementById('movieTitle');
            movieTitle.textContent = "Popular";
            let movieAdditionalTitle = document.getElementById('additionalMovieTitle');
            movieAdditionalTitle.textContent = "Top Rated";
            let response = JSON.parse(xhr.responseText);
            document.body.style.background = '#1a143b';
            window.scroll(0, 0);
            movieItem.innerHTML = ' ';

            response.results.forEach(function (movie) {
                let releaseYear = new Date(movie.release_date).getFullYear();
                let item = document.createElement('div');
                item.className = "popular-movie__item";
                item.id = "popularMovieItem";
                let poster = document.createElement('img');
                poster.className = "popular-movie__item__img";
                poster.id = "posterOfPopularMovie"
                poster.src = `${BASE_IMAGE_URL + BIG_IMAGE_SIZE + movie.poster_path}`;
                poster.alt = "Poster of a popular movie";
                // let voteAverage = document.createElement('p');
                // voteAverage.className = "popular-vote-average";
                // voteAverage.id = "popularVoteAverage";
                // voteAverage.textContent = `${movie.vote_average}`;
                let title = document.createElement('h3');
                title.className = "popular-movie__item__title";
                title.textContent = `${movie.title + ` (${releaseYear})`}`;
                item.append(poster, title);
                movieItem.appendChild(item);
            });

            let popularMovieItem = document.getElementsByClassName('popular-movie__item');
            for (let i = 0; i < popularMovieItem.length; i++) {
                popularMovieItem[i].addEventListener('click', () => {
                    let id = response.results[i].id;
                    loadMovieDetails(id);
                });
            }
        }
    }
    xhr.open('GET', BASE_URL + QUERY_POPULAR_MOVIES + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + '1', true);
    xhr.send();
}