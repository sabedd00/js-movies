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
import {loadSearchResults} from "./search-results";

setHeaderLogoOnClickListener();
setLoadPopularContentListener();
setPopStateListener();

function loadPopularMovies(pageValue) {
    let xhr = new XMLHttpRequest();
    let url = BASE_URL + QUERY_POPULAR_MOVIES + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + pageValue;

    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            document.body.style.background = '#191919';
            let response = JSON.parse(xhr.responseText);
            window.scrollTo({top: 0});

            setMovieList(xhr, response);
            initPagination(pageValue, response);
            saveInputValue();

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
            history.pushState({
                page: 'details',
                details_id: `${response.results[i].id}`
            }, '', `${response.results[i].title}`);
            loadMovieDetails(id);
        });
        movieItem[i].addEventListener('click', () => {
            let id = response.similar.results[i].id;
            history.pushState({
                page: 'details',
                details_id: `${response.similar.results[i].id}`
            }, '', `${response.similar.results[i].title}`);
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

export function initPagination(pageValue, response) {
    let mainContent = document.getElementById('mainContent');
    mainContent.append(document.getElementById('paginationTemplate').content.cloneNode(true));

    getPreviousPage(pageValue);
    getFirstPage(response, pageValue);
    getStepBack(pageValue);
    getCurrentPage(pageValue);
    getStepForward(response, pageValue);
    getNextPage(pageValue);
    getLastPage(response, pageValue);
    getAdditionalPageButtons(pageValue, response);
}

function getFirstPage(response, pageValue) {
    if (pageValue > 1 && pageValue >= 3) {
        document.getElementById('firstPageButton').style.visibility = 'visible';
        document.getElementById('firstPageButton').addEventListener('click', function () {
            if (document.getElementById("searchInput").value === '') {
                history.pushState({
                    page: 'popular',
                    page_id: response.total_pages / response.total_pages
                }, '', `popular?page=${response.total_pages / response.total_pages}`);
                loadPopularMovies(response.total_pages / response.total_pages);
            } else {
                history.pushState({
                    page: 'search',
                    page_id: response.total_pages
                }, '', `search?page=${response.total_pages}`);
                loadSearchResults(response.total_pages / response.total_pages);
            }
        });
    } else {
        document.getElementById('firstPageButton').remove();
    }
}

function getNextPage(pageValue) {
    document.getElementById('nextPageButton').addEventListener('click', function () {
        if (pageValue >= 1) {
            pageValue++;
            if (document.getElementById("searchInput").value === '') {
                history.pushState({page: 'popular', page_id: pageValue}, '', `popular?page=${pageValue}`);
                loadPopularMovies(pageValue);
            } else {
                history.pushState({page: 'search', page_id: pageValue}, '', `search?page=${pageValue}`);
                loadSearchResults(pageValue);
            }
        }
    });
}

function getPreviousPage(pageValue) {
    if (pageValue > 1) {
        document.getElementById('prevPageButton').addEventListener('click', function () {
            pageValue--;
            if (document.getElementById("searchInput").value === '') {
                history.pushState({page: 'popular', page_id: pageValue}, '', `popular?page=${pageValue}`);
                loadPopularMovies(pageValue);
            } else {
                history.pushState({page: 'search', page_id: pageValue}, '', `search?page=${pageValue}`);
                loadSearchResults(pageValue);
            }
        });
    } else {
        document.getElementById('prevPageButton').remove();
    }
}

function getCurrentPage(pageValue) {
    document.getElementById('currentPageButton').textContent = pageValue;
    document.getElementById('currentPageButton').addEventListener('click', function () {
        if (document.getElementById("searchInput").value === '') {
            history.pushState({page: 'popular', page_id: pageValue}, '', `popular?page=${pageValue}`);
            loadPopularMovies(pageValue);
        } else {
            history.pushState({page: 'search', page_id: pageValue}, '', `search?page=${pageValue}`);
            loadSearchResults(pageValue);
        }
    });
}

function getLastPage(response, pageValue) {
    if (response.total_pages > 1) {
        document.getElementById('lastPageButton').textContent = response.total_pages;
        document.getElementById('lastPageButton').addEventListener('click', function () {
            if (document.getElementById("searchInput").value === '') {
                history.pushState({
                    page: 'popular',
                    page_id: response.total_pages
                }, '', `popular?page=${response.total_pages}`);
                loadPopularMovies(response.total_pages);
            } else {
                history.pushState({
                    page: 'search',
                    page_id: response.total_pages
                }, '', `search?page=${response.total_pages}`);
                loadSearchResults(response.total_pages);
            }
        });
    }
    if (pageValue === response.total_pages) {
        document.getElementById('lastPageButton').remove();
        document.getElementById('nextPageButton').style.visibility = 'hidden';
    }
    if (pageValue === response.total_pages - 1) {
        document.getElementById('lastPageButton').remove();
    }
}

function getStepBack(pageValue) {
    if (pageValue < 4) {
        document.getElementById('stepBackPageButton').remove();
    } else {
        document.getElementById('stepBackPageButton').addEventListener('click', function () {
            if (document.getElementById("searchInput").value === '') {
                history.pushState({page: 'popular', page_id: pageValue - 3}, '', `popular?page=${pageValue - 3}`);
                loadPopularMovies(pageValue - 3);
            } else {
                history.pushState({page: 'search', page_id: pageValue - 3}, '', `search?page=${pageValue - 3}`);
                loadSearchResults(pageValue - 3);
            }
        });
    }
}

function getStepForward(response, pageValue) {
    if (pageValue + 3 > response.total_pages) {
        document.getElementById('stepForwardPageButton').remove();
    } else {
        document.getElementById('stepForwardPageButton').addEventListener('click', function () {
            if (document.getElementById("searchInput").value === '') {
                history.pushState({page: 'popular', page_id: pageValue + 3}, '', `popular?page=${pageValue + 3}`);
                loadPopularMovies(pageValue + 3);
            } else {
                history.pushState({page: 'search', page_id: pageValue + 3}, '', `search?page=${pageValue + 3}`);
                loadSearchResults(pageValue + 3);
            }
        });
    }
}

function getAdditionalPageButtons(pageValue, response) {
    if (document.getElementById('stepForwardPageButton') && document.getElementById('stepBackPageButton') === true) {
        document.getElementById('backPageButton').remove();
        document.getElementById('forwardPageButton').remove();
    } else {
        document.getElementById('backPageButton').textContent = `${pageValue - 1}`;
        document.getElementById('backPageButton').addEventListener('click', function () {
            if (document.getElementById("searchInput").value === '') {
                history.pushState({page: 'popular', page_id: pageValue - 1}, '', `popular?page=${pageValue - 1}`);
                loadPopularMovies(pageValue - 1);
            } else {
                history.pushState({page: 'search', page_id: pageValue - 1}, '', `search?page=${pageValue - 1}`);
                loadSearchResults(pageValue - 1);
            }

        });
        document.getElementById('forwardPageButton').textContent = `${pageValue + 1}`;
        document.getElementById('forwardPageButton').addEventListener('click', function () {
            if (document.getElementById("searchInput").value === '') {
                history.pushState({page: 'popular', page_id: pageValue + 1}, '', `popular?page=${pageValue + 1}`);
                loadPopularMovies(pageValue + 1);
            } else {
                history.pushState({page: 'search', page_id: pageValue + 1}, '', `search?page=${pageValue + 1}`);
                loadSearchResults(pageValue + 1);
            }
        });
        if (pageValue === 1) {
            document.getElementById('backPageButton').remove();
        }
        if (response.total_pages === pageValue) {
            document.getElementById('forwardPageButton').remove();
        }
    }
}

function setLoadPopularContentListener() {
    if (history.state === null) {
        history.pushState({page: 'popular', page_id: 1}, '', 'popular?page=1')
        loadPopularMovies(1);
    } else {
        window.addEventListener("load", function (event) {
            if (history.state.page === 'popular') {
                loadPopularMovies(history.state.page_id);
            } else if (history.state.page === 'search') {
                document.getElementById('searchInput').value = localStorage.getItem('inputValue');
                loadSearchResults(history.state.page_id);
            } else if (history.state.page === 'details') {
                loadMovieDetails(history.state.details_id);
            }
        });
    }
}

function saveInputValue() {
    let input = document.getElementById('searchInput');
    localStorage.setItem("inputValue", input.value);
}

function setPopStateListener() {
    window.addEventListener('popstate', () => {
        if (history.state.page === 'popular') {
            loadPopularMovies(history.state.page_id);
        } else if (history.state.page === 'search') {
            document.getElementById('searchInput').value = localStorage.getItem('inputValue');
            loadSearchResults(history.state.page_id);
        } else if (history.state.page === 'details') {
            loadMovieDetails(history.state.details_id);
        }
    });
}
