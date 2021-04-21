'use strict';

import {getData} from './index.js';
import logo from '../images/tmdb-logo.svg';
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

export function loadMovieDetails(movieId) {
    let xhr = new XMLHttpRequest();
    let url = BASE_URL + `movie/${movieId}?` + API_KEY + QUERY_APPEND_TO_RESPONSE + 'videos,similar';

    setMovieDetailsOnLoadEventListener(xhr);

    getData(xhr, url);
}

function setMovieDetailsOnLoadEventListener(xhr) {
    xhr.addEventListener('load', function () {
            if (xhr.status === 200 && xhr.readyState === 4) {
                let movieDetails = document.getElementById('mainContent');
                let response = JSON.parse(xhr.responseText);

                changeBackgroundByMovie(response);
                window.scroll(0, 0);

                movieDetails.innerHTML = ' ';
                let main = document.createElement('main');
                main.className = "movie-details";

                let movieDetailsSection = document.createElement('section');
                createMovieDetailsContent(response, movieDetailsSection);

                let additionalDetailsSection = document.createElement('section');
                createAdditionalDetailsContent(response, additionalDetailsSection);

                let similarMoviesSection = document.createElement('section');
                createSimilarMoviesContent(response, similarMoviesSection);

                main.append(movieDetailsSection, additionalDetailsSection, similarMoviesSection);
                movieDetails.appendChild(main);

                setSimilarMovies(response, similarMoviesSection);
            }
        }
    )
}

function createMovieDetailsContent(response, sectionDetails) {
    sectionDetails.className = "details";
    let posterContainer = document.createElement('div');
    posterContainer.className = "poster__img-container";
    let posterImg = document.createElement('img');
    posterImg.className = "poster__img";
    posterImg.src = `${BASE_IMAGE_URL + BIG_IMAGE_SIZE + response.poster_path}`;
    posterImg.alt = "Poster";
    posterContainer.appendChild(posterImg);
    let detailsContent = document.createElement('div');
    detailsContent.className = "details__content";
    let movieTitle = document.createElement('h1');
    movieTitle.className = "movie__title";
    movieTitle.textContent = `${response.title}` + ` (${new Date(response.release_date).getFullYear()})`;
    let genresList = document.createElement('div');
    genresList.className = "genres__list";
    genresList.innerHTML = `${response.genres.map(genre => genre.name).join(', ')}`;
    let overviewContainer = document.createElement('div');
    overviewContainer.className = "overview-container";
    let overviewText = document.createElement('p');
    overviewText.className = "overview__text";
    overviewText.textContent = `${response.overview}`;
    overviewContainer.appendChild(overviewText);
    detailsContent.append(movieTitle, genresList, overviewContainer);
    sectionDetails.append(posterContainer, detailsContent);
}

function createAdditionalDetailsContent(response, additionalDetails) {
    additionalDetails.className = "additional-details";
    let trailerContent = document.createElement('iframe');
    trailerContent.className = "trailer";
    trailerContent.src = `${URL_YOUTUBE + response.videos.results[0].key}`;
    trailerContent.width = '800px';
    trailerContent.height = '450px';
    let runtimeContainer = document.createElement('div');
    runtimeContainer.className = "running-time";
    runtimeContainer.innerHTML = '<br>Running Time:<br>';
    let runtimeData = document.createElement('span');
    runtimeData.className = "meta-data";
    runtimeData.innerHTML = `${response.runtime + ' mins'}`;
    runtimeContainer.appendChild(runtimeData);
    let voteAverageContainer = document.createElement('div');
    voteAverageContainer.className = "vote-average";
    voteAverageContainer.innerHTML = '<br>Vote Average:<br>';
    let voteAverageData = document.createElement('span');
    voteAverageData.className = "meta-data";
    voteAverageData.innerHTML = `${response.vote_average + ' / 10'}`;
    voteAverageContainer.appendChild(voteAverageData);
    let budgetContainer = document.createElement('div');
    budgetContainer.className = "budget";
    budgetContainer.innerHTML = '<br>Box office:<br>';
    let budgetData = document.createElement('span');
    budgetData.className = "meta-data";
    budgetContainer.appendChild(budgetData);
    additionalDetails.append(trailerContent, runtimeContainer, voteAverageContainer, budgetContainer);

    if (response.budget.toLocaleString() !== '0') {
        budgetData.innerHTML = '$' + response.budget.toLocaleString();
    } else {
        budgetContainer.innerHTML = ' ';
        additionalDetails.style.gridTemplateAreas = '" v v " "  k j "';
    }
}

function createSimilarMoviesContent(response, similarMovies) {
    similarMovies.className = "similar-movies";
    let similarMoviesContent = document.createElement('div');
    similarMoviesContent.className = "similar-movies__content";
    similarMoviesContent.id = "similarMoviesContent"
    let buttonPrev = document.createElement('button');
    buttonPrev.textContent = '⇦';
    buttonPrev.className = 'arrow prev';
    let buttonNext = document.createElement('button');
    buttonNext.textContent = '⇨';
    buttonNext.className = 'arrow next';
    let similarMovieList = document.createElement('div');
    similarMovieList.className = "similar-movie__list";
    similarMovieList.id = "similarMovieList"
    similarMoviesContent.append(buttonPrev, similarMovieList, buttonNext);
    similarMovies.appendChild(similarMoviesContent);
}

function setSimilarMovies(response, similarMovies) {
    if (response.similar.results[0] === undefined) {
        similarMovies.innerHTML = ' ';
    } else {
        let similarMovieList = document.getElementById('similarMovieList');
        response.similar.results.forEach(function (movie) {
            let item = document.createElement('div');
            item.className = "similar-movie__item";
            item.id = "similarMovie"
            let poster = document.createElement('img');
            poster.className = "similar-movie__img";
            poster.src = `${BASE_IMAGE_URL + SMALL_IMAGE_SIZE + movie.poster_path}`;
            poster.alt = "Similar movie poster";
            let title = document.createElement('h3');
            title.className = "similar-movie__title";
            title.textContent = `${movie.title}` + ` (${new Date(movie.release_date).getFullYear()})`;
            item.append(poster, title);
            similarMovieList.appendChild(item);
        })

        initSlider();
    }
}

function initSlider() {
    let i = 1;
    let similarList = document.getElementById('similarMoviesContent');
    for (let item of similarList.querySelectorAll('div')) {
        item.style.position = 'relative';
        i++;
    }

    let width = 130;
    let count = 1;

    let list = similarList.querySelector('div');
    let listElem = similarList.querySelectorAll('div');

    let position = 0;

    similarList.querySelector('.prev').onclick = function () {
        position += width * count;
        position = Math.min(position, 0);
        list.style.marginLeft = position + 'px';
    };

    similarList.querySelector('.next').onclick = function () {
        position -= width * count;
        position = Math.max(position, -width * (listElem.length - count));
        list.style.marginLeft = position + 'px';
    };
}

function changeBackgroundByMovie(response) {
    let background = BASE_IMAGE_URL + ORIGINAL_IMAGE_SIZE + response.backdrop_path;
    document.body.style.backgroundImage = 'url(' + background + ')';
}
