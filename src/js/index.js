'use strict';

import Logo from '../images/tmdb-logo.svg';
import {loadMovieDetails, showPoster} from "./movie-details.js";
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

setHeaderLogoOnClickListener();
loadPopularMovies();

function loadPopularMovies() {
    let xhr = new XMLHttpRequest();
    let pageValue = 1;
    let url = BASE_URL + QUERY_POPULAR_MOVIES + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + pageValue;

    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            document.body.style.background = '#191919';
            let response = JSON.parse(xhr.responseText);

            createMovieListContent(response);

            let movieItem = document.getElementsByClassName('movie__item');
            setMovieCardClickListener(response, movieItem);

            initPagination(pageValue);
        }
    }
    getData(xhr, url);
}

export function createMovieListContent(response) {
    let mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = ' ';
    let mainTitle = document.createElement('h2');
    mainTitle.className = 'movie__title';
    mainTitle.id = 'movieTitle';
    mainTitle.textContent = 'Popular movies';
    let movieList = document.createElement('div');
    movieList.className = 'movie-list';
    let movieListContent = document.createElement('div');
    movieListContent.className = 'movie-list__content';
    movieListContent.id = 'movieList';
    movieList.appendChild(movieListContent);
    mainContent.append(mainTitle, movieList);

    createMovieCardContent(response, movieListContent);
}

function createMovieCardContent(response, movieListContent) {
    response.results.forEach(function (movie) {
        let item = document.createElement('div');
        item.className = "movie__item";
        item.id = "movieItem";
        let posterContent = document.createElement('div');
        posterContent.className = 'movie__item__img__content';
        let overlay = document.createElement('div');
        overlay.className = 'overlay';
        let overlayRating = document.createElement('div');
        overlayRating.className = 'overlay__rating';
        overlayRating.textContent = `${movie.vote_average}`;
        let overlayReleaseYear = document.createElement('div');
        overlayReleaseYear.className = "overlay__release-year";
        let overlayOverview = document.createElement('div');
        overlayOverview.textContent = `${movie.overview}`;
        overlayOverview.className = "overlay__overview";
        showOverlayDetails(movie, overlay, overlayReleaseYear, overlayOverview, overlayRating)
        let poster = document.createElement('img');
        poster.className = "movie__item__img";
        poster.id = "moviePoster";
        showPoster(movie, poster, BIG_IMAGE_SIZE);
        poster.alt = "Movie poster";
        posterContent.append(overlay, poster);
        let title = document.createElement('h3');
        title.className = "movie__item__title";
        title.textContent = `${movie.title}`;
        item.append(posterContent, title);
        movieListContent.append(item);
    });
}

function showOverlayDetails(movie, overlay, overlayReleaseYear, overlayOverview, overlayRating) {
    if (!!isNaN(movie.release_date)) {
        overlayReleaseYear.textContent = `${new Date(movie.release_date).getFullYear()}`
    } else {
        overlayReleaseYear.textContent = '';
    }

    if (movie.vote_average === 0) {
        overlay.append(overlayReleaseYear, overlayOverview);
    } else {
        overlay.append(overlayRating, overlayReleaseYear, overlayOverview);
    }

    if (movie.vote_average !== 0 && !!isNaN(movie.release_date) || !!isNaN(movie.release_date) && movie.overview !== '') {
        overlayReleaseYear.style.borderBottom = 'solid 1px #ffffff';
    } else {
        overlayReleaseYear.style.borderBottom = 'none'
    }
}

function setMovieList(xhr, response) {
    createMovieListContent(response);

    let movieItem = document.getElementsByClassName('movie__item');
    setMovieCardClickListener(response, movieItem);
}

export function setMovieCardClickListener(response, movieItem) {
    for (let i = 0; i < movieItem.length; i++) {
        movieItem[i].addEventListener('click', () => {
            let id = response.results[i].id;
            loadMovieDetails(id);
        });
        movieItem[i].addEventListener('click', () => {
            let id = response.similar.results[i].id;
            loadMovieDetails(id);
        })
    }
}

export function getData(xhr, url) {
    xhr.open('GET', url, true);
    xhr.send();
}

function setHeaderLogoOnClickListener() {
    let headerLogo = document.getElementById('headerLogo');
    headerLogo.addEventListener('click', function () {
    })
}

function initPagination(pageValue) {
    let mainContent = document.getElementById('mainContent');
    mainContent.append(document.getElementById('paginationTemplate').content.cloneNode(true));
    document.getElementById('page').textContent = pageValue;
    let url = BASE_URL + QUERY_POPULAR_MOVIES + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + pageValue;

    setBtnChangePageListener(pageValue, url);
}

function setBtnChangePageListener(pageValue, url) {
    document.getElementById('prevPageButton').addEventListener('click', function () {
        if (pageValue > 1) {
            pageValue--;
            getPage(pageValue, url);
        }
    });

    document.getElementById('nextPageButton').addEventListener('click', function () {
        if (pageValue >= 1) {
            pageValue++;
            getPage(pageValue, url);
        }
    });

    document.getElementById('page').addEventListener('click', function () {
        getPage(pageValue, url);
    });
}

function getPage(pageValue, url) {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);

            setMovieList(xhr, response);
            initPagination(pageValue);
        }
    }
    getData(xhr, url);
}
