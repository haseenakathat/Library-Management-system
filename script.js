const API_KEY = 'ae9f9edb'; 
const API_URL = 'https://www.omdbapi.com/'; 

const searchInput = document.getElementById('searchInput');
const movieGrid = document.getElementById('movieGrid');
const movieDetailsModal = document.getElementById('movieDetailsModal');
const movieDetails = document.getElementById('movieDetails');
const watchlistBtn = document.getElementById('watchlistBtn');
const backBtn = document.getElementById('backBtn');
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

// Event listener for the search input
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchMovies(event.target.value);
    }
});

// Event listener for displaying the watchlist
watchlistBtn.addEventListener('click', displayWatchlist);

// Function to search movies based on input query
function searchMovies(query) {
    fetch(`${API_URL}?s=${query}&apikey=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                displayMovies(data.Search);
            } else {
                movieGrid.innerHTML = '<p>No results found</p>';
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to display movies in the grid
function displayMovies(movies) {
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button class="watchlist-btn" data-id="${movie.imdbID}" data-title="${movie.Title}" data-year="${movie.Year}" data-poster="${movie.Poster}">Add to Watchlist</button>
        `;
        movieCard.addEventListener('click', () => showMovieDetails(movie.imdbID));
        movieGrid.appendChild(movieCard);
    });

    // Attach event listeners to Add to Watchlist buttons
    document.querySelectorAll('.watchlist-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent triggering the parent click
            addToWatchlist(event.target.dataset);
        });
    });
}

// Function to show movie details in a modal
function showMovieDetails(id) {
    fetch(`${API_URL}?i=${id}&apikey=${API_KEY}`)
        .then(response => response.json())
        .then(movie => {
            movieDetails.innerHTML = `
                <h2>${movie.Title}</h2>
                <p><strong>Director:</strong> ${movie.Director}</p>
                <p><strong>Cast:</strong> ${movie.Actors}</p>
                <p><strong>Plot:</strong> ${movie.Plot}</p>
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
            `;
            movieDetailsModal.style.display = 'block';
        })
        .catch(error => console.error('Error fetching movie details:', error));
}

// Close modal function
document.querySelector('.close').onclick = function() {
    movieDetailsModal.style.display = 'none';
};

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target === movieDetailsModal) {
        movieDetailsModal.style.display = 'none';
    }
};

// Function to add movie to the watchlist
function addToWatchlist(movieData) {
    const movieExists = watchlist.some(movie => movie.id === movieData.id);
    if (!movieExists) {
        const newMovie = {
            id: movieData.id,
            title: movieData.title,
            year: movieData.year,
            poster: movieData.poster !== 'N/A' ? movieData.poster : 'placeholder.jpg'
        };
        watchlist.push(newMovie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert('Movie added to watchlist!');
    } else {
        alert('Movie is already in your watchlist.');
    }
}

// Function to remove movie from the watchlist
function removeFromWatchlist(id) {
    watchlist = watchlist.filter(movie => movie.id !== id);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    displayWatchlist(); 
    alert('Movie removed from watchlist!');
}

// Function to display watchlist movies
function displayWatchlist() {
    if (watchlist.length === 0) {
        movieGrid.innerHTML = '<p>Your watchlist is empty.</p>';
    } else {
        movieGrid.innerHTML = '';
        watchlist.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${movie.year}</p>
                <button class="remove-btn" data-id="${movie.id}">Remove from Watchlist</button>
            `;
            movieCard.querySelector('.remove-btn').addEventListener('click', (event) => {
                event.stopPropagation();
                removeFromWatchlist(movie.id);
            });
            movieGrid.appendChild(movieCard);
        });
    }
}

// Show initial sample movies on page load
function loadSampleMovies() {
    displayMovies(sampleMovies);
}
window.onload = loadSampleMovies;

// Fetch and display popular movies
function fetchPopularMovies() {
    const popularQuery = 'Batman'; 
    fetch(`${API_URL}?s=${popularQuery}&apikey=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                displayMovies(data.Search);
            } else {
                movieGrid.innerHTML = '<p>No popular movies found</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching popular movies:', error);
            movieGrid.innerHTML = '<p>There was an error fetching popular movies. Please try again later.</p>';
        });
}

// Initial popular movies load
document.addEventListener('DOMContentLoaded', fetchPopularMovies);

// Functions for showing search results and watchlist
function showSearchResults() {
    movieGrid.style.display = 'grid'; 
    backBtn.style.display = 'none';   
}

function showWatchlist() {
    movieGrid.innerHTML = ''; 
    displayWatchlist();      
    movieGrid.style.display = 'grid'; 
    backBtn.style.display = 'block'; 
}

// Back button event listener
backBtn.addEventListener('click', showSearchResults);

// Watchlist button event listener
watchlistBtn.addEventListener('click', showWatchlist);
