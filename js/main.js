'use strict';

loadPopularMovies();
loadTopRatedMovies();

function loadPopularMovies() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let movieItem = document.getElementById('movieItem');
            let movieTitle = document.getElementById('movieTitle');
            movieTitle.textContent = "Popular";
            let movieAdditionalTitle = document.getElementById('additionalMovieTitle');
            movieAdditionalTitle.textContent = "Top Rated";
            let response = JSON.parse(xhr.responseText);
            document.body.style.background = '#1a143b';
            window.scroll(0, 0);
            movieItem.innerHTML = ' ';

            response.results.forEach(function (movie) {
                let releaseYear = new Date(movie.release_date).getFullYear();
                let item = document.createElement('div');
                item.className = "popular-movie__item";
                item.id = "popularMovieItem";
                let poster = document.createElement('img');
                poster.className = "popular-movie__item__img";
                poster.id = "posterOfPopularMovie"
                poster.src = `${BASE_IMAGE_URL + BIG_IMAGE_SIZE + movie.poster_path}`;
                poster.alt = "Poster of a popular movie";
                let voteAverage = document.createElement('p');
                voteAverage.className = "popular-vote-average";
                voteAverage.id = "popularVoteAverage";
                voteAverage.textContent = `${movie.vote_average}`;
                let title = document.createElement('h3');
                title.className = "popular-movie__item__title";
                title.textContent = `${movie.title + ` (${releaseYear})`}`;
                item.append(poster, voteAverage, title);
                movieItem.appendChild(item);
            });

            let popularMovieItem = document.getElementsByClassName('popular-movie__item');
            for (let i = 0; i < popularMovieItem.length; i++) {
                popularMovieItem[i].addEventListener('click', () => {
                    let id = response.results[i].id;
                    loadMovieDetails(id);
                });
            }
        }
    }
    xhr.open('GET', BASE_URL + QUERY_POPULAR_MOVIES + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + '1', true);
    xhr.send();
}

function loadTopRatedMovies() {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            window.scroll(0, 0);
            let movieItem = document.getElementById('additionalMovieItem');
            let response = JSON.parse(xhr.responseText);
            document.body.style.background = '#1a143b';

            movieItem.innerHTML = ' ';
            response.results.forEach(function (movie) {
                let releaseYear = new Date(movie.release_date).getFullYear();
                let topRatedMovies = document.createElement('h1');
                topRatedMovies.className = "top-rated__title";
                topRatedMovies.textContent = 'Top Rated';
                let item = document.createElement('div');
                item.className = "top-rated__item";
                item.id = "topRatedItem";
                let poster = document.createElement('img');
                poster.className = "top-rated__item__img";
                poster.id = "posterOfTopRatedMovie"
                poster.src = `${BASE_IMAGE_URL + BIG_IMAGE_SIZE + movie.poster_path}`;
                poster.alt = "Poster of a top rated movie";
                let voteAverage = document.createElement('p');
                voteAverage.className = "top-rated-vote-average";
                voteAverage.id = "topRatedVoteAverage";
                voteAverage.textContent = `${movie.vote_average}`;
                let title = document.createElement('h3');
                title.className = "top-rated__item__title";
                title.textContent = `${movie.title + ` (${releaseYear})`}`;
                item.append(poster, voteAverage, title);
                movieItem.appendChild(item);
            });

            let topRatedMovieItem = document.getElementsByClassName('top-rated__item');
            for (let i = 0; i < topRatedMovieItem.length; i++) {
                topRatedMovieItem[i].addEventListener('click', () => {
                    let id = response.results[i].id;
                    loadMovieDetails(id);
                });
            }
        }
    }

    xhr.open('GET', BASE_URL + QUERY_TOP_RATED_MOVIES + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_PAGE + '1', true);
    xhr.send();
}