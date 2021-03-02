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
                movieItem.innerHTML += `
                        <div class="search-movie-result__item">
                          <img class="search-movie-result__item__img" src="${BASE_IMAGE_URL + BIG_IMAGE_SIZE + movie.poster_path}" alt="Search result movie poster">
                           <h3 class="search-movie-result__item__title">${movie.title}</h3>
                        </div>
                    `;
            });
        }
    }

    xhr.open("GET", BASE_URL + MOVIES_SEARCH_QUERY + API_KEY + MOVIE_LANGUAGE_QUERY + ENG_MOVIE_LANGUAGE + '&' + `query=${input.value}`, true);
    xhr.send();
    evt.preventDefault();
}