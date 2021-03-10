'use strict';

document.getElementById("searchForm").addEventListener("submit", loadSearchResults);

function loadSearchResults(evt) {
    let xhr = new XMLHttpRequest();
    let input = document.getElementById("searchText");

    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let movieItem = document.getElementById('movieItem');
            let response = JSON.parse(xhr.responseText);

            movieItem.innerHTML = ' ';
            response.results.forEach(function (movie) {
                let releaseYear = new Date(movie.release_date).getFullYear();
                let resultItem = document.createElement('div');
                resultItem.className = "search-movie-result__item";
                let poster = document.createElement('img');
                poster.className = "search-movie-result__item__img";
                poster.src = `${BASE_IMAGE_URL + BIG_IMAGE_SIZE + movie.poster_path}`;
                poster.alt = "Search result movie poster";
                let title = document.createElement('h3');
                title.className = "search-movie-result__item__title";
                title.textContent = `${movie.title + ` (${releaseYear})`}`;
                resultItem.append(poster, title);
                movieItem.appendChild(resultItem);
            });

            let searchMovieResultItem = document.getElementsByClassName('search-movie-result__item');
            for (let i = 0; i < searchMovieResultItem.length; i++) {
                searchMovieResultItem[i].addEventListener('click', () => {
                    let id = response.results[i].id;
                    loadMovieDetails(id);
                });
            }
        }
    }

    xhr.open("GET", BASE_URL + MOVIES_SEARCH_QUERY + API_KEY + LANGUAGE_QUERY + ENG_LANGUAGE + '&' + `query=${input.value}`, true);
    xhr.send();
    evt.preventDefault();
}