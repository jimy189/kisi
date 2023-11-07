// Titles: https://omdbapi.com/?s=thor&page=1&apikey=fc1fef96
// details: http://www.omdbapi.com/?i=tt3896198&apikey=fc1fef96

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const resultFavorito= document.getElementById('result-favorito');

// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Ano: ${details.Year}</li>
            <li class = "released"> Diretor: ${details.Director}</li>
        </ul>
        <p class = "genre"><b>Genêro:</b> ${details.Genre}</p>
        <p class = "writer"><b>Escritor:</b> ${details.Writer}</p>
        <p class = "actors"><b>Ator: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Linguagem:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
        <button class="btn btn-primary" id="addtButton">Adicionar</button>
        <button class="btn btn-primary" id="editButton"><a class="btn btn-primary" href="editar.html">Editar</a></button>
        <button class="btn btn-danger" id="deleteButton">Deletar</button>
        <td>
        
    </td>
    </div>
    `;

      // Adicione um evento de clique ao botão "Adicionar"
      const addButton = document.getElementById('addButton');
      addButton.addEventListener('click', () => {
          addFavoriteMovie(details);
      });
}


window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});

function addFavoriteMovie(movieDetails) {
    const resultFavorito = document.getElementById('result-favorito');

    // Crie um novo elemento para o filme favorito
    const favoriteMovie = document.createElement('div');
    favoriteMovie.classList.add('movie-item');

    // Copie o HTML dos detalhes do filme
    favoriteMovie.innerHTML = `
        <div class="movie-poster">
            <img src="${(movieDetails.Poster != "N/A") ? movieDetails.Poster : "image_not_found.png"}" alt="movie poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movieDetails.Title}</h3>
            <ul class="movie-misc-info">
                <li class="year">Ano: ${movieDetails.Year}</li>
                <li class="rated">Ratings: ${movieDetails.Rated}</li>
                <li class="released">Lançado: ${movieDetails.Released}</li>
            </ul>
            <p class="genre"><b>Genêro:</b> ${movieDetails.Genre}</p>
            <p class="writer"><b>Escritor:</b> ${movieDetails.Writer}</p>
            <p class="actors"><b>Ator: </b>${movieDetails.Actors}</p>
            <p class="plot"><b>Plot:</b> ${movieDetails.Plot}</p>
            <p class="language"><b>Linguagem:</b> ${movieDetails.Language}</p>
            <p class="awards"><b><i class="fas fa-award"></i></b> ${movieDetails.Awards}</p>
        </div>
    `;

    // Adicione o filme favorito à seção de favoritos
    resultFavorito.appendChild(favoriteMovie);
}


 const addtButton = document.getElementById('addButton');
 const editButton = document.getElementById('editButton');
 const deleteButton = document.getElementById('deleteButton');

 editButton.addEventListener('click', function () {
    // Lógica para editar o filme
    // Aqui você pode fazer uma solicitação post para a API para adcionar o filme
    const editedMovieData = {
        title: movieData.Title,
        year: movieData.Year,
        director: movieData.Director,
    };

    fetch(`/sua/api/create?idFilme=ID_DO_FILME`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedMovieData),
    })
    .then((response) => {
        if (response.status === 200) {
            console.log("Editado com sucesso!")
        } else {
           console.log("Erro")
        }
    });
});

 editButton.addEventListener('click', function () {
     // Lógica para editar o filme
     // Aqui você pode fazer uma solicitação PUT para a API para editar o filme
     const editedMovieData = {
         title: movieData.Title,
         year: movieData.Year,
         director: movieData.Director,
     };

     fetch(`/sua/api/editar?idFilme=ID_DO_FILME`, {
         method: 'PUT',
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify(editedMovieData),
     })
     .then((response) => {
         if (response.status === 200) {
             console.log("Editado com sucesso!")
         } else {
            console.log("Erro")
         }
     });
 });

 deleteButton.addEventListener('click', function () {
     // Lógica para deletar o filme
     // Aqui você pode fazer uma solicitação DELETE para a API para deletar o filme
     fetch(`/sua/api/deletar?idFilme=ID_DO_FILME`, {
         method: 'DELETE',
     })
     .then((response) => {
         if (response.status === 200) {
            console.log("Deletado com sucesso!")
             movieInfoTable.innerHTML = '';
         } else {
            console.log("Erro")
         }
     });
 });
