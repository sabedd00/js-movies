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

            response.results.forEach(function (movie) {
                createResultItemContent(movieItem, movie);
            });

            setResultItemOnClickEventListener(response);
            initPagination(pageValue);
        }
    }

    getData(xhr, url);
    evt.preventDefault();
}

function setSearchFromSubmitEventListener() {
    document.getElementById("searchForm").addEventListener("submit", loadSearchResults);
}

function initPagination(pageValue) {
    let main = document.getElementById('mainContent');
    let pagination = document.createElement('div');
    pagination.className = "pagination";
    let nextPageButton = document.createElement('button');
    nextPageButton.className = "next-page__button";
    nextPageButton.textContent = "Next";
    pagination.appendChild(nextPageButton);
    main.appendChild(pagination);

    setNextPageOfResultsOnClickEventListener(pageValue, nextPageButton);
}

function setNextPageOfResultsOnClickEventListener(pageValue, nextPageButton) {
    nextPageButton.addEventListener('click', function () {
        let xhr = new XMLHttpRequest();
        let url = BASE_URL + MOVIES_SEARCH_QUERY + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + pageValue + '&' + `query=${input.value}`;
        pageValue++;
        window.scroll(0, 0);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                let movieItem = document.getElementById('movieItem');

                movieItem.innerHTML = ' ';
                response.results.forEach(function (movie) {
                    createResultItemContent(movieItem, movie);
                });

                setResultItemOnClickEventListener(response);
            }
        }

        getData(xhr, url);
    });
}

function createResultItemContent(movieItem, movie) {
    let releaseYear = new Date(movie.release_date).getFullYear();
    let resultItem = document.createElement('div');
    resultItem.className = "search-movie-result__item";
    resultItem.id = "resultItem";
    let poster = document.createElement('img');
    poster.className = "search-movie-result__item__img";
    poster.src = `${BASE_IMAGE_URL + BIG_IMAGE_SIZE + movie.poster_path}`;
    poster.alt = "Search result movie poster";
    let title = document.createElement('h3');
    title.className = "search-movie-result__item__title";
    title.textContent = `${movie.title + ` (${releaseYear})`}`;
    resultItem.append(poster, title);
    movieItem.appendChild(resultItem);
}

function setResultItemOnClickEventListener(response) {
    let searchResultItem = document.getElementsByClassName('search-movie-result__item');
    for (let i = 0; i < searchResultItem.length; i++) {
        searchResultItem[i].addEventListener('click', () => {
            let id = response.results[i].id;
            loadMovieDetails(id);
        });
    }
}
