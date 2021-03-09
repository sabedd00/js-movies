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
                movieItem.innerHTML += `
                      <div class="popular-movie__item">
                        <img class="popular-movie__item__img" src="${BASE_IMAGE_URL + BIG_IMAGE_SIZE + movie.poster_path}" alt="Poster of a popular movie">
                        <h3 class="popular-movie__item__title">${movie.title + `(${releaseYear})`}</h3>
                      </div>
                `;
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