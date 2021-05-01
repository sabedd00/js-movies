'use strict';

import Logo from '../images/tmdb-logo.svg';
import {loadMovieDetails} from "./movie-details.js";
import '../css/index.css';
import {
    API_KEY, BASE_IMAGE_URL,
    BASE_URL, BIG_IMAGE_SIZE,
    ENG_LANGUAGE,
    LANGUAGE_QUERY, MOVIES_SEARCH_QUERY,
    QUERY_PAGE,
    QUERY_POPULAR_MOVIES,
} from "./config";

setHeaderLogoOnClickListener();
loadPopularMovies();

function loadPopularMovies() {
    let xhr = new XMLHttpRequest();
    let url = BASE_URL + QUERY_POPULAR_MOVIES + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + '1';

    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            document.body.style.background = '#1a143b';
            let response = JSON.parse(xhr.responseText);

            createMovieListContent(response);

            let movieItem = document.getElementsByClassName('movie__item');
            setMovieCardClickListener(response, movieItem);
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
        let poster = document.createElement('img');
        poster.className = "movie__item__img";
        poster.id = "moviePoster"
        poster.src = `${BASE_IMAGE_URL + BIG_IMAGE_SIZE + movie.poster_path}`;
        poster.alt = "Movie poster";
        let title = document.createElement('h3');
        title.className = "movie__item__title";
        title.textContent = `${movie.title + ` (${new Date(movie.release_date).getFullYear()})`}`;
        item.append(poster, title);
        movieListContent.append(item);
    });
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
        window.location.reload();
    })
}

export function initPagination(pageValue) {
    let mainContent = document.getElementById('mainContent');
    let pagination = document.createElement('div');
    pagination.className = "pagination";
    let prevPageButton = document.createElement('button');
    prevPageButton.className = "prev-page__button";
    prevPageButton.textContent = "← Prev page";
    let nextPageButton = document.createElement('button');
    nextPageButton.className = "next-page__button";
    nextPageButton.textContent = "Next page →";
    pagination.append(prevPageButton, nextPageButton);
    mainContent.append(pagination);

    setBtnChangePageListener(pageValue, prevPageButton, nextPageButton);
}

export function setBtnChangePageListener(pageValue, prevPageButton, nextPageButton) {
    let input = document.getElementById("searchInput");
    let inputValue = input.value;

    nextPageButton.addEventListener('click', function () {
        let xhr = new XMLHttpRequest();
        pageValue++;
        let url = BASE_URL + MOVIES_SEARCH_QUERY + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + pageValue + '&' + `query=${inputValue}`;

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);

                setMovieList(xhr, response);
            }
        }
        getData(xhr, url);
    });

    prevPageButton.addEventListener('click', function () {
        let xhr = new XMLHttpRequest();
        pageValue--;
        let url = BASE_URL + MOVIES_SEARCH_QUERY + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + pageValue + '&' + `query=${inputValue}`;

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);

                setMovieList(xhr, response);
            }
        }
        getData(xhr, url);
    })
}
