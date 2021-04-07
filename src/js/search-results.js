'use strict';

import {loadMovieDetails} from "./movie-details.js";
import {
    API_KEY,
    BASE_IMAGE_URL,
    BASE_URL, BIG_IMAGE_SIZE,
    ENG_LANGUAGE,
    LANGUAGE_QUERY,
    MOVIES_SEARCH_QUERY,
    QUERY_PAGE
} from "./config";

document.getElementById("searchForm").addEventListener("submit", loadSearchResults);
let input = document.getElementById("searchText");
let movieTitle = document.getElementById('movieTitle');
let additionalMovieTitle = document.getElementById('additionalMovieTitle');
let url = `BASE_URL + MOVIES_SEARCH_QUERY + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + pageValue + '&' + \`query=${input.value}\``;

export function loadSearchResults(evt) {
    let xhr = new XMLHttpRequest();
    let pageValue = 1;
    xhr.open("GET", BASE_URL + MOVIES_SEARCH_QUERY + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + pageValue + '&' + `query=${input.value}`, true);
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
                addDataToValues(movieItem, movie);
            });
            openMovieDetails(response);
            pagination(pageValue);
        }
    }
    xhr.send();
    evt.preventDefault();
}

function pagination(pageValue) {
    let main = document.getElementById('mainContent');
    let pagination = document.createElement('div');
    pagination.className = "pagination";
    let pageButtonPrev = document.createElement('button');
    pageButtonPrev.className = "prev-page__button";
    pageButtonPrev.textContent = "Prev";
    let pageButtonNext = document.createElement('button');
    pageButtonNext.className = "next-page__button";
    pageButtonNext.textContent = "Next";
    pagination.append(pageButtonPrev, pageButtonNext);
    main.appendChild(pagination);

    pageButtonNext.addEventListener('click', function () {
        let xhr = new XMLHttpRequest();
        pageValue++;
        xhr.open("GET", BASE_URL + MOVIES_SEARCH_QUERY + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + pageValue + '&' + `query=${input.value}`, true);
        window.scroll(0, 0);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                // let currentPage = response.page;
                // let totalPages = response.total_pages;

                let movieItem = document.getElementById('movieItem');
                movieItem.innerHTML = ' ';
                response.results.forEach(function (movie) {
                    addDataToValues(movieItem, movie);
                });
                openMovieDetails(response);
            }
        }
        xhr.send();
    });

    pageButtonPrev.addEventListener('click', function () {
        let xhr = new XMLHttpRequest();
        pageValue--;
        xhr.open("GET", url, true);
        window.scroll(0, 0);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                // let currentPage = response.page;
                // let totalPages = response.total_pages;

                let movieItem = document.getElementById('movieItem');
                movieItem.innerHTML = ' ';
                response.results.forEach(function (movie) {
                    addDataToValues(movieItem, movie);
                });
                openMovieDetails(response);
            }
        }
        xhr.send();
    });
}

function addDataToValues(movieItem, movie) {
    let releaseYear = new Date(movie.release_date).getFullYear();
    let resultItem = document.createElement('div');
    resultItem.className = "search-movie-result__item";
    resultItem.id = "resultItem";
    let poster = document.createElement('img');
    poster.className = "search-movie-result__item__img";
    // if (movie.poster_path == null) {
    //     poster.src = './images/empty-poster.png';
    // } else {
        poster.src = `${BASE_IMAGE_URL + BIG_IMAGE_SIZE + movie.poster_path}`;
   // }
    poster.alt = "Search result movie poster";
    let title = document.createElement('h3');
    title.className = "search-movie-result__item__title";
    title.textContent = `${movie.title + ` (${releaseYear})`}`;
    resultItem.append(poster, title);
    movieItem.appendChild(resultItem);
}

function openMovieDetails(response) {
    let searchMovieResultItem = document.getElementsByClassName('search-movie-result__item');
    for (let i = 0; i < searchMovieResultItem.length; i++) {
        searchMovieResultItem[i].addEventListener('click', () => {
            let id = response.results[i].id;
            loadMovieDetails(id);
        });
    }
}