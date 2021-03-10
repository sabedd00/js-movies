'use strict';

loadPopularMovies();

function loadPopularMovies() {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let movieItem = document.getElementById('movieItem');
            let response = JSON.parse(xhr.responseText);

            movieItem.innerHTML = ' ';
            response.results.forEach(function (movie) {
                let releaseYear = new Date(movie.release_date).getFullYear();
                let item = document.createElement('div');
                item.className = "popular-movie__item";
                let poster = document.createElement('img');
                poster.className = "popular-movie__item__img";
                poster.src = `${BASE_IMAGE_URL + BIG_IMAGE_SIZE + movie.poster_path}`;
                poster.alt = "Poster of a popular movie";
                let title = document.createElement('h3');
                title.className = "popular-movie__item__title";
                title.textContent = `${movie.title + `(${releaseYear})`}`;
                item.append(poster, title);
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

    xhr.open('GET', BASE_URL + QUERY_POPULAR_MOVIES + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + QUERY_POPULAR_MOVIES_PAGE, true);
    xhr.send();
}