'use strict';

import {getData, setMovieCardClickListener} from './index.js';
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
                let movieDetails = document.getElementById('mainContent');
                let mainTitle = document.getElementById('movieTitle');
                let response = JSON.parse(xhr.responseText);

                changeBackgroundByMovie(response);
                window.scroll(0, 0);

                movieDetails.innerHTML = ' ';
                mainTitle.innerHTML = ' ';
                let main = document.createElement('main');
                main.className = "movie-details";

                let movieDetailsSection = document.createElement('section');
                createMovieDetailsContent(response, movieDetailsSection);

                let trailerSection = document.createElement('section');
                createTrailerContent(response, trailerSection);

                let similarMoviesSection = document.createElement('section');
                createSimilarMoviesContent(response, similarMoviesSection);

                main.append(movieDetailsSection, trailerSection, similarMoviesSection);
                movieDetails.appendChild(main);

                setSimilarMovies(response, similarMoviesSection);

                let similarMovieItem = document.getElementsByClassName('similar-movie__item');
                setMovieCardClickListener(response, similarMovieItem);
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
    let additionalDetails = document.createElement('div');
    additionalDetails.className = "additional-details";
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
    additionalDetails.append(runtimeContainer, voteAverageContainer, budgetContainer);
    detailsContent.append(movieTitle, genresList, overviewContainer, additionalDetails);
    sectionDetails.append(posterContainer, detailsContent);

    if (response.budget.toLocaleString() !== '0') {
        budgetData.innerHTML = '$' + response.budget.toLocaleString();
    } else {
        budgetContainer.innerHTML = ' ';
        detailsContent.style.gridTemplateAreas = '" v v " "  k j "';
    }
}

function createTrailerContent(response, trailerContent) {
    trailerContent.className = "trailer__content";
    let trailer = document.createElement('iframe');
    trailer.className = "trailer";
    trailer.src = `${URL_YOUTUBE + response.videos.results[0].key}`;
    trailer.width = '800px';
    trailer.height = '450px';
    trailerContent.append(trailer);
}

function createSimilarMoviesContent(response, similarMovies) {
    similarMovies.className = "similar-movies";
    similarMovies.id = 'similarMovies';
    let similarMoviesContent = document.createElement('div');
    similarMoviesContent.className = "similar-movies__content";
    similarMoviesContent.id = "similarMoviesContent";
    let similarMovieList = document.createElement('div');
    similarMovieList.className = "similar-movie__list";
    similarMovieList.id = "similarMovieList";
    let buttonPrev = document.createElement('button');
    buttonPrev.className = 'glider-prev';
    buttonPrev.textContent = '<';
    let buttonNext = document.createElement('button');
    buttonNext.className = 'glider-next';
    buttonNext.textContent = '>';
    let sliderDots = document.createElement('div');
    sliderDots.className = 'dots';
    similarMoviesContent.append(similarMovieList, buttonPrev, buttonNext, sliderDots);
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
    new Glider(document.querySelector('.similar-movie__list'), {
        slidesToShow: 8,
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
