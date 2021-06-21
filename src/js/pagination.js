'use strict';

import {loadPopularMovies} from "./index";
import {loadSearchResults} from "./search-results";
import {loadMovieDetails} from "./movie-details";

export function initPagination(pageValue, response) {
    let mainContent = document.getElementById('mainContent');
    mainContent.append(document.getElementById('paginationTemplate').content.cloneNode(true));

    initPreviousPageButtonListener(pageValue);
    initFirstPageButtonListener(response, pageValue);
    initTripleStepBackButtonListener(pageValue);
    initCurrentPageButtonListener(pageValue);
    initTripleStepForwardButtonListener(response, pageValue);
    initNextPageButtonListener(pageValue);
    initLastPageButtonListener(response, pageValue);
    initBackPageArrowButtonListener(pageValue);
    initForwardPageArrowButtonListener(pageValue, response);
    initTwoPagesForwardButtonListener(pageValue);
    initTwoPagesBackButtonListener(pageValue);
}

function initFirstPageButtonListener(response, pageValue) {
    if (pageValue > 1 && pageValue >= 3) {
        document.getElementById('firstPageButton').style.visibility = 'visible';
        document.getElementById('firstPageButton').addEventListener('click', function () {
            setPaginationButtonClickListener(response.total_pages / response.total_pages);
        });
    } else {
        document.getElementById('firstPageButton').remove();
    }
}

function initNextPageButtonListener(pageValue) {
    document.getElementById('nextPageButton').addEventListener('click', function () {
        if (pageValue >= 1) {
            pageValue++;
            setPaginationButtonClickListener(pageValue);
        }
    });
}

function initPreviousPageButtonListener(pageValue) {
    if (pageValue > 1) {
        document.getElementById('prevPageButton').addEventListener('click', function () {
            pageValue--;
            setPaginationButtonClickListener(pageValue);
        });
    } else {
        document.getElementById('prevPageButton').remove();
    }
}

function initCurrentPageButtonListener(pageValue) {
    document.getElementById('currentPageButton').textContent = pageValue;
    document.getElementById('currentPageButton').addEventListener('click', function () {
        setPaginationButtonClickListener(pageValue);
    });
}

function initLastPageButtonListener(response, pageValue) {
    if (response.total_pages > 1) {
        document.getElementById('lastPageButton').textContent = response.total_pages;
        document.getElementById('lastPageButton').addEventListener('click', function () {
            setPaginationButtonClickListener(response.total_pages);
        });
    }
    if (pageValue === response.total_pages) {
        document.getElementById('lastPageButton').remove();
        document.getElementById('nextPageButton').style.visibility = 'hidden';
    } else if (pageValue === response.total_pages - 1) {
        document.getElementById('lastPageButton').remove();
    }
}

function initTripleStepBackButtonListener(pageValue) {
    if (pageValue < 5) {
        document.getElementById('stepBackPageButton').remove();
    } else {
        document.getElementById('stepBackPageButton').addEventListener('click', function () {
            setPaginationButtonClickListener(pageValue - 3);
        });
    }
}

function initTripleStepForwardButtonListener(response, pageValue) {
    if (pageValue + 3 > response.total_pages) {
        document.getElementById('stepForwardPageButton').remove();
    } else {
        document.getElementById('stepForwardPageButton').addEventListener('click', function () {
            setPaginationButtonClickListener(pageValue + 3);
        });
    }
}

function initBackPageArrowButtonListener(pageValue) {
    if (document.getElementById('stepBackPageButton') === true) {
        document.getElementById('backPageButton').remove();
    } else {
        document.getElementById('backPageButton').textContent = `${pageValue - 1}`;
        document.getElementById('backPageButton').addEventListener('click', function () {
            setPaginationButtonClickListener(pageValue - 1);
        });
        if (pageValue === 1) {
            document.getElementById('backPageButton').remove();
        }
    }
}

function initForwardPageArrowButtonListener(pageValue, response) {
    if (document.getElementById('stepForwardPageButton') === true) {
        document.getElementById('forwardPageButton').remove();
    } else {
        document.getElementById('forwardPageButton').textContent = `${pageValue + 1}`;
        document.getElementById('forwardPageButton').addEventListener('click', function () {
            setPaginationButtonClickListener(pageValue + 1);
        });
        if (response.total_pages === pageValue) {
            document.getElementById('forwardPageButton').remove();
        }
    }
}

function initTwoPagesBackButtonListener(pageValue) {
    if (pageValue > 3) {
        pageValue = pageValue - 2;
        document.getElementById('twoPagesBackButton').textContent = `${pageValue}`;
        document.getElementById('twoPagesBackButton').addEventListener('click', function () {
            setPaginationButtonClickListener(pageValue);
        });
    } else {
        document.getElementById('twoPagesBackButton').remove();
    }
}

function initTwoPagesForwardButtonListener(pageValue) {
    if (pageValue >= 1) {
        pageValue = pageValue + 2;
        document.getElementById('twoPagesForwardButton').textContent = `${pageValue}`;
        document.getElementById('twoPagesForwardButton').addEventListener('click', function () {
            setPaginationButtonClickListener(pageValue);
        });
    }
}

export function getPopularMovies(pageValue) {
    history.pushState({page: 'popular', page_id: pageValue}, '', `popular?page=${pageValue}`);
    loadPopularMovies(pageValue);
}

export function getSearchResults(pageValue) {
    history.pushState({page: 'search', page_id: pageValue}, '', `search?page=${pageValue}`);
    loadSearchResults(pageValue);
}

export function getMovieDetails(id) {
    history.pushState({page: 'details', details_id: `${id}`}, '', `${id}`);
    loadMovieDetails(id);
}

function setPaginationButtonClickListener(pageValue) {
    if (history.state.page === 'popular') {
        getPopularMovies(pageValue);
    } else if (history.state.page === 'search') {
        getSearchResults(pageValue);
    }
}
