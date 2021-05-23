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
                let response = JSON.parse(xhr.responseText);
                changeBackgroundByMovie(response);
                window.scroll(0, 0);
                movieDetails.innerHTML = ' ';

                movieDetails.append(document.getElementById('movieDetailsTemplate').content.cloneNode(true));

                setMovieDetailsContent(response);
                setSimilarMovies(response);

                setMovieCardClickListener(response, document.getElementsByClassName('similar-movie__item'));
            }
        }
    )
}

function setMovieDetailsContent(response) {
    document.getElementById('posterByDetails').src = `${BASE_IMAGE_URL + BIG_IMAGE_SIZE + response.poster_path}`;
    document.getElementById('movieTitleByDetails').textContent = `${response.title}`;
    document.getElementById('genresList').innerHTML = `${response.genres.map(genre => genre.name).join(', ')}`;
    document.getElementById('overview').textContent = `${response.overview}`;
    document.getElementById('runningTime').innerHTML = `${response.runtime + ' min'}`;
    document.getElementById('voteAverage').innerHTML = `${response.vote_average}`;
    document.getElementById('releaseDate').textContent = `${new Date(response.release_date).getFullYear()}`;

    if (response.budget.toLocaleString() !== '0') {
        document.getElementById('budget').innerHTML = '$' + response.budget.toLocaleString();
    } else {
        document.getElementById('budget').innerHTML = ' ';
        document.getElementById('detailsContent').style.gridTemplateAreas = '" v v " "  k j "';
    }

    console.log(response.videos.results)
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
