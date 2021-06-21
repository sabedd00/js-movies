'use strict';

import Logo from '../images/tmdb-logo.svg';
import {loadMovieDetails, setPoster} from "./movie-details.js";
import '../css/index.css';
import {
    API_KEY,
    BASE_URL, BIG_IMAGE_SIZE,
    ENG_LANGUAGE,
    LANGUAGE_QUERY,
    QUERY_PAGE,
    QUERY_POPULAR_MOVIES,
} from "./config";
import emptyPoster from "../images/empty-poster.png";
import {loadSearchResults} from "./search-results";
import {getMovieDetails, getPopularMovies, initPagination} from "./pagination";

setHeaderLogoOnClickListener();
setLoadPopularContentListener();
setPopStateListener();

export function loadPopularMovies(pageValue) {
    let xhr = new XMLHttpRequest();
    let url = BASE_URL + QUERY_POPULAR_MOVIES + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + pageValue;

    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            document.body.style.background = '#191919';
            let response = JSON.parse(xhr.responseText);
            scrollToTop();
            setMovieList(xhr, response);
            initPagination(pageValue, response);
        }
    }
    getData(xhr, url);
}

export function createMovieListContent(response) {
    let mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = ' ';
    mainContent.append(document.getElementById('movieListTemplate').content.cloneNode(true));
    document.getElementById('movieTitle').textContent = 'Popular movies';

    createMovieCardContent(response);
}

function createMovieCardContent(response) {
    response.results.forEach(function (movie) {
        let item = document.createElement('div');
        item.className = "movie__item";
        item.id = "movieItem";
        let posterContent = document.createElement('div');
        posterContent.className = 'movie__item__img__content';
        let overlay = document.createElement('div');
        createOverlayContent(movie, overlay);
        let poster = document.createElement('img');
        createMoviePosterContent(movie, poster);
        let title = document.createElement('h3');
        createMovieTitleContent(movie, title);

        posterContent.append(overlay, poster);
        item.append(posterContent, title);
        document.getElementById('movieList').append(item);
    });
}

function createOverlayContent(movie, overlay) {
    overlay.className = 'overlay';
    let overlayRating = document.createElement('div');
    overlayRating.className = 'overlay__rating';
    overlayRating.textContent = `${movie.vote_average}`;
    let overlayReleaseYear = document.createElement('div');
    overlayReleaseYear.className = "overlay__release-year";
    let overlayOverview = document.createElement('div');
    overlayOverview.textContent = `${movie.overview}`;
    overlayOverview.className = "overlay__overview";

    showOverlayReleaseYear(movie, overlayReleaseYear);
    if (movie.vote_average === 0) {
        overlay.append(overlayReleaseYear, overlayOverview);
    } else {
        overlay.append(overlayRating, overlayReleaseYear, overlayOverview);
    }
}

function createMoviePosterContent(movie, poster) {
    poster.className = "movie__item__img";
    poster.id = "moviePoster";
    setPoster(movie, poster, BIG_IMAGE_SIZE);
    poster.alt = "Movie poster";
}

function createMovieTitleContent(movie, title) {
    title.className = "movie__item__title";
    title.textContent = `${movie.title}`;
}

function showOverlayReleaseYear(movie, overlayReleaseYear) {
    if (!!isNaN(movie.release_date)) {
        overlayReleaseYear.textContent = `${new Date(movie.release_date).getFullYear()}`
    } else {
        overlayReleaseYear.textContent = '';
    }

    if (movie.vote_average !== 0 && !!isNaN(movie.release_date) || !!isNaN(movie.release_date) && movie.overview !== '') {
        overlayReleaseYear.style.borderBottom = 'solid 1px #ffffff';
    } else {
        overlayReleaseYear.style.borderBottom = 'none'
    }
}

export function setMovieList(xhr, response) {
    createMovieListContent(response);

    let movieItem = document.getElementsByClassName('movie__item');
    setMovieCardClickListener(response, movieItem);
}

export function setMovieCardClickListener(response, movieItem) {
    for (let i = 0; i < movieItem.length; i++) {
        movieItem[i].addEventListener('click', () => {
            let id = response.results[i].id;
            getMovieDetails(id);
        });
        movieItem[i].addEventListener('click', () => {
            let id = response.similar.results[i].id;
            getMovieDetails(id);
        })
    }
}

export function getData(xhr, url) {
    xhr.open('GET', url, true);
    xhr.send();
}

function setHeaderLogoOnClickListener() {
    document.getElementById('headerLogo').addEventListener('click', function () {
        document.getElementById('searchInput').value = '';
        getPopularMovies(1);
    })
}

function setLoadPopularContentListener() {
    if (history.state === null) {
        getPopularMovies(1);
    } else {
        window.addEventListener("load", function () {
            getPageContent();
        });
    }
}

export function saveInputValue() {
    let input = document.getElementById('searchInput');
    localStorage.setItem("inputValue", input.value);
}

function setPopStateListener() {
    window.addEventListener('popstate', () => {
        getPageContent();
    });
}

function getPageContent() {
    if (history.state.page === 'popular') {
        document.getElementById('searchInput').value = '';
        loadPopularMovies(history.state.page_id);
    } else if (history.state.page === 'search') {
        document.getElementById('searchInput').value = localStorage.getItem('inputValue');
        loadSearchResults(history.state.page_id);
    } else if (history.state.page === 'details') {
        loadMovieDetails(history.state.details_id);
    }
}

export function scrollToTop() {
    window.scrollTo({top: 0});
}
