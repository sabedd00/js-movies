'use strict';

function loadMovieDetails(movieId) {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
            if (xhr.status === 200 && xhr.readyState === 4) {
                let movieDetails = document.getElementById('mainContent');
                let response = JSON.parse(xhr.responseText);

                let background = BASE_IMAGE_URL + ORIGINAL_IMAGE_SIZE + response.backdrop_path;
                document.body.style.backgroundImage = 'url(' + background + ')';

                let poster = BASE_IMAGE_URL + BIG_IMAGE_SIZE + response.poster_path;
                let title = response.title;
                let overview = response.overview;
                let genresList = response.genres.map(genre => genre.name).join(', ');
                let releaseYear = new Date(response.release_date).getFullYear();
                let runtime = response.runtime;
                let voteAverage = response.vote_average;
                let budget = response.budget.toLocaleString();
                let trailer = URL_YOUTUBE + response.videos.results[0].key;

                if (budget !== '0') {
                    budget = '$' + response.budget.toLocaleString();
                } else {
                    budget = 'Unknown';
                }

                movieDetails.innerHTML = ' ';
                movieDetails.innerHTML = (`
                      <main class="movie-details"> 
                        <section class="details">
                         <div class="poster__img-container">
                          <img class="poster__img" src="${poster}" alt="Movie poster">
                         </div>
                         <div class="details__content">
                            <h1 class="movie__title ">${title + ` (${releaseYear})`}</h1>
                            <div class="genres__list">
                                ${genresList}
                              </div>
                            <div class="overview">
                              <p class="overview__text">
                                  ${overview}
                              </p>
                            </div>
                       </section>
                       <section class="additional-details">
                          <iframe class="trailer" src="${trailer}" width="800px" height="450px">
                          </iframe>
                          <div class="running-time">
                             <br>Running Time:<br>
                             <span class="meta-data">${runtime + ' mins'}</span>
                          </div>
                          <div class="vote-average">
                             <br>Vote Average:<br>
                             <span class="meta-data">${voteAverage + ' / 10'}</span>
                          </div>
                          <div class="budget">
                             <br>Box office:<br>
                             <span class="meta-data">${budget}</span>
                          </div>
                       </section>
                       <section class="similar-movies">
                         <div class="similar-movies__list">
                          <div class="similar-movie__item" id="similarMovieItem"></div>
                          </div>
                         </div>
                       </section>
                      </main>
                    `);

                let similarMovieItem = document.getElementById('similarMovieItem');
                response.similar.results.forEach(function (movie) {
                    similarMovieItem.innerHTML += `
                       <div class="similar-movie__item">
                         <img class="similar-movie__img" src="${BASE_IMAGE_URL + SMALL_IMAGE_SIZE + movie.poster_path}" alt="Similar movie poster">
                         <h3 class="similar-movie__title">${movie.title}</h3>
                       </div>
                    `
                })
            }
        }
    )
    xhr.open("GET", BASE_URL + `movie/${movieId}?` + API_KEY + QUERY_APPEND_TO_RESPONSE + 'videos,similar', true);
    xhr.send();
}

