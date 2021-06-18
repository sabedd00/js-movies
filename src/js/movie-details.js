'use strict';

import {getData, scrollToTop, setMovieCardClickListener} from './index.js';
import logo from '../images/tmdb-logo.svg';
import emptyPoster from '../images/empty-poster.png';
import {
    API_KEY,
    BASE_IMAGE_URL,
    BASE_URL,
    BIG_IMAGE_SIZE,
    ORIGINAL_IMAGE_SIZE, QUERY_APPEND_TO_RESPONSE,
    SMALL_IMAGE_SIZE,
    URL_YOUTUBE
} from "./config";
import '../css/movie-details.css';
import Glider from '/node_modules/glider-js/glider.min.js';
import '/node_modules/glider-js/glider.min.css';
import {setSearchFormEventListeners} from "./search-results";

setSearchFormEventListeners();

export function loadMovieDetails(movieId) {
    let xhr = new XMLHttpRequest();
    let url = BASE_URL + `movie/${movieId}?` + API_KEY + QUERY_APPEND_TO_RESPONSE + 'videos,similar';

    setMovieDetailsOnLoadEventListener(xhr);
    getData(xhr, url);
}

function setMovieDetailsOnLoadEventListener(xhr) {
    xhr.addEventListener('load', function () {
            if (xhr.status === 200 && xhr.readyState === 4) {
                document.getElementById('searchInput').value = '';
                let movieDetails = document.getElementById('mainContent');
                movieDetails.innerHTML = ' ';
                movieDetails.append(document.getElementById('movieDetailsTemplate').content.cloneNode(true));
                let response = JSON.parse(xhr.responseText);

                changeBackgroundByMovie(response);
                scrollToTop();
                setMovieDetailsContent(response);
                setSimilarMovies(response);
                setMovieCardClickListener(response, document.getElementsByClassName('similar-movie__item'));
            }
        }
    )
}

function setMovieDetailsContent(response) {
    showRating(response);
    showAdditionalDetails(response);
    showMediaContent(response);
    document.getElementById('movieTitleByDetails').textContent = `${response.title}`;
    document.getElementById('genresList').innerHTML = `${response.genres.map(genre => genre.name).join(', ')}`;
    document.getElementById('overview').textContent = `${response.overview}`;
}

function showAdditionalDetails(response) {
    showReleaseDate(response);
    showRuntime(response);
    showBudget(response);
}

function showReleaseDate(response) {
    if (response.release_date === '') {
        document.getElementById('releaseDate').textContent = '';
        document.getElementById('releaseDate').style.marginRight = '0';
        document.getElementById('firstDot').innerHTML = '';
    } else {
        document.getElementById('releaseDate').textContent = `${new Date(response.release_date).getFullYear()}`
    }
}

function showRuntime(response) {
    if (response.runtime == null || response.runtime === 0) {
        document.getElementById('runningTime').innerHTML = '';
        document.getElementById('runningTime').style.marginRight = '0';
        document.getElementById('secondDot').innerHTML = '';
        document.getElementById('firstDot').innerHTML = '';
    } else {
        document.getElementById('runningTime').innerHTML = `${response.runtime + ' min'}`;
    }
}

function showBudget(response) {
    if (response.budget.toLocaleString() !== '0') {
        document.getElementById('budget').innerHTML = '$' + response.budget.toLocaleString();
    } else {
        document.getElementById('budget').innerHTML = ' ';
        document.getElementById('secondDot').innerHTML = '';
    }
}

function showRating(response) {
    if (response.vote_average === 0) {
        document.getElementById('rating').innerHTML = ''
        document.getElementById('rating').style.background = '0';
    } else {
        document.getElementById('voteAverage').innerHTML = `${response.vote_average}`;
    }
}

function showMediaContent(response) {
    showDetailsPoster(response);
    showTrailer(response);
}

function showDetailsPoster(response) {
    let poster = document.getElementById('posterByDetails');
    poster.src = `${BASE_IMAGE_URL + BIG_IMAGE_SIZE + response.poster_path}`;
    if (poster.src === 'https://image.tmdb.org/t/p/w342null') {
        poster.src = emptyPoster;
    }
}

function showTrailer(response) {
    if (response.videos.results.length === 0) {
        document.getElementById('trailerContent').innerHTML = ' ';
    } else {
        document.getElementById('trailer').src = `${URL_YOUTUBE + response.videos.results[0].key}`;
    }
}

function setSimilarMovies(response) {
    let similarMovies = document.getElementById('similarMovies');
    if (response.similar.total_results === 0) {
        similarMovies.remove();
        document.getElementById('mainContent').style.margin = '2.5% 0 2.5% 0';
    } else {
        let similarMovieList = document.getElementById('similarMovieList');
        response.similar.results.forEach(function (movie) {
            let item = document.createElement('div');
            item.className = "similar-movie__item";
            item.id = "similarMovie"
            let poster = document.createElement('img');
            createDetailsPosterContent(movie, poster);
            let title = document.createElement('h3');
            createDetailsTitleContent(movie, title);
            item.append(poster, title);
            similarMovieList.appendChild(item);
        })
        initSlider();
    }
}

function createDetailsPosterContent(movie, poster) {
    poster.className = "similar-movie__img";
    showPoster(movie, poster, SMALL_IMAGE_SIZE);
    poster.alt = "Similar movie poster";
}

export function showPoster(movie, poster, size) {
    if (movie.poster_path == null) {
        poster.src = emptyPoster;
    } else {
        poster.src = `${BASE_IMAGE_URL + size + movie.poster_path}`;
    }
}

function createDetailsTitleContent(movie, title) {
    title.className = "similar-movie__title";
    if (!!isNaN(movie.release_date)) {
        title.textContent = `${movie.title}` + ` (${new Date(movie.release_date).getFullYear()})`;
    } else {
        title.textContent = `${movie.title}`
    }
}

function initSlider() {
    new Glider(document.querySelector('.similar-movie__list'), {
        slidesToShow: 6,
        slidesToScroll: 3,
        draggable: true,
        dots: '.dots',
        arrows: {
            prev: '.glider-prev',
            next: '.glider-next'
        }
    });
}

function changeBackgroundByMovie(response) {
    let background = BASE_IMAGE_URL + ORIGINAL_IMAGE_SIZE + response.backdrop_path;
    document.body.style.backgroundImage = 'url(' + background + ')';
}
