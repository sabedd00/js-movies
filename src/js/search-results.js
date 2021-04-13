'use strict';

import {loadMovieDetails} from "./movie-details.js";
import {getData} from "./index";
import {
    API_KEY,
    BASE_IMAGE_URL,
    BASE_URL, BIG_IMAGE_SIZE,
    ENG_LANGUAGE,
    LANGUAGE_QUERY,
    MOVIES_SEARCH_QUERY,
    QUERY_PAGE
} from "./config";
import {setMovieCardClickListener} from "./index";

setSearchFromSubmitEventListener();

let input = document.getElementById("searchText");
let movieTitle = document.getElementById('movieTitle');
let additionalMovieTitle = document.getElementById('additionalMovieTitle');

export function loadSearchResults(evt) {
    let xhr = new XMLHttpRequest();
    let pageValue = 1;
    let url = BASE_URL + MOVIES_SEARCH_QUERY + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + pageValue + '&' + `query=${input.value}`;

    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let movieItem = document.getElementById('movieItem');
            let additionalMovieItem = document.getElementById('additionalMovieItem');
            let response = JSON.parse(xhr.responseText);

            movieItem.innerHTML = ' ';
            additionalMovieItem.innerHTML = ' ';
            additionalMovieTitle.textContent = ' ';
            movieTitle.textContent = `Search Results: ${response.total_results} movies`;

            createMovieCardContent(movieItem, response);

            let popularMovieItem = document.getElementsByClassName('popular-movie__item');
            setMovieCardClickListener(response, popularMovieItem);
            initPagination(pageValue);
        }
    }

    getData(xhr, url);
    evt.preventDefault();
}

function setSearchFromSubmitEventListener() {
    document.getElementById("searchForm").addEventListener("submit", loadSearchResults);
}

export function initPagination(pageValue) {
    let main = document.getElementById('mainContent');
    let pagination = document.createElement('div');
    pagination.className = "pagination";
    let prevPageButton = document.createElement('button');
    prevPageButton.className = "prev-page__button";
    prevPageButton.textContent = "← Prev page";
    let nextPageButton = document.createElement('button');
    nextPageButton.className = "next-page__button";
    nextPageButton.textContent = "Next page →";
    pagination.append(prevPageButton, nextPageButton);
    main.appendChild(pagination);

    setBtnChangePageListener(pageValue, prevPageButton, nextPageButton);
}

function setBtnChangePageListener(pageValue, prevPageButton, nextPageButton) {
    nextPageButton.addEventListener('click', function () {
        let xhr = new XMLHttpRequest();
        let url = BASE_URL + MOVIES_SEARCH_QUERY + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + pageValue + '&' + `query=${input.value}`;
        pageValue++;

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
        let url = BASE_URL + MOVIES_SEARCH_QUERY + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + pageValue + '&' + `query=${input.value}`;
        pageValue--;

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);

                setMovieList(xhr, response);
            }
        }
        getData(xhr, url);
    })
}

function setMovieList(xhr, response) {
    let movieItem = document.getElementById('movieItem');

    movieItem.innerHTML = ' ';
    createMovieCardContent(movieItem, response);

    let popularMovieItem = document.getElementsByClassName('popular-movie__item');
    setMovieCardClickListener(response, popularMovieItem);
}

export function createMovieCardContent(movieItem, response) {
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
