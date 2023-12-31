// Titles: https://omdbapi.com/?s=thor&page=1&apikey=fc1fef96
// details: http://www.omdbapi.com/?i=tt3896198&apikey=fc1fef96

const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");
const resultFavorito = document.getElementById("result-favorito");

// load movies from API
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;

  const res = await fetch(`${URL}`);

  const data = await res.json();

  if (data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();

  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = "";

  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement("div");

    movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id

    movieListItem.classList.add("search-list-item");

    if (movies[idx].Poster != "N/A") moviePoster = movies[idx].Poster;
    else moviePoster = "image_not_found.png";

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

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");

  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      searchList.classList.add("hide-search-list");

      movieSearchBox.value = "";

      const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);

      const movieDetails = await result.json();

      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  resultGrid.innerHTML = /*html*/ `
        <div class = "movie-poster">
            <img src = "${details.Poster != "N/A" ? details.Poster : "image_not_found.png"}" alt = "movie poster">
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

            <button class="btn btn-primary" id="addButton" js-btn-add>Adicionar</button>
        </div>
    `;

  // Adicione os eventos
  insertBtnAdd(details);
}

window.addEventListener("click", (event) => {
  if (event.target.className != "form-control") {
    searchList.classList.add("hide-search-list");
  }
});

async function getAllMovies() {
  const resultFavorito = document.getElementById("result-favorito");

  resultFavorito.innerHTML = "";

  const getAllMovies = await fetch(`http://localhost:8080/filme/listaFilmes`, {
    method: "GET",
  });

  if (getAllMovies.status !== 200) return;

  const jsons = await getAllMovies.json();

  jsons.forEach((json) => {
    // Crie um novo elemento para o filme favorito
    const favoriteMovie = document.createElement("div");
    favoriteMovie.classList.add("movie-item");

    // Copie o HTML dos detalhes do filme
    favoriteMovie.innerHTML = /*html*/ `
        <div class = "movie-info" data-cont="${json.id}">
            <p class = "writer"><b>Titulo:</b> ${json.title}</p>
            <p class = "writer"><b>Ano:</b> ${json.year}</p>
            <p class = "genre"><b>Diretor:</b> ${json.director}</p>
            <button class="btn btn-primary" id="editButton" data-id="${json.id}">
                Editar
            </button> 
            <button class="btn btn-danger" id="deleteButton" data-id="${json.id}">
                Deletar
            </button>
        </div>
    `;

    // Adicione o filme favorito à seção de favoritos
    resultFavorito.appendChild(favoriteMovie);
  });

  const editButtons = document.querySelectorAll("#editButton");
  const deleteButtons = document.querySelectorAll("#deleteButton");

  editButtons.forEach((btn, i) => btn.addEventListener("click", (e) => editFavoriteMovie(e, jsons[i])));

  deleteButtons.forEach((btn) => btn.addEventListener("click", deleteFavoriteMovie));
}

async function addFavoriteMovie(details) {
  const objnewmovie = {
    Title: details.Title,
    Year: details.Year,
    Director: details.Director,
  };

  await fetch(`http://localhost:8080/filme/adicionarFilmes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objnewmovie),
  }).then((response) => {
    if (response.status === 200) {
      console.log("Editado com sucesso!");
    } else {
      console.log("Erro");
    }
  });

  getAllMovies();
}

function editFavoriteMovie(el, json) {
  const id = el.currentTarget.dataset.id;
  const form = document.querySelector("form[form-editar]");

  form.removeAttribute("style");

  console.log(json);

  form["titulo"].value = json.title;
  form["nomeDireito"].value = json.director;
  form["ano"].value = json.year;

  // Lógica para editar o filme
  // Aqui você pode fazer uma solicitação PUT para a API para editar o filme
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const editedMovieData = {
      title: form["titulo"].value,
      year: form["ano"].value,
      director: form["nomeDireito"].value,
    };

    await fetch(`http://localhost:8080/filme/editar?idFilme=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedMovieData),
    }).then((response) => {
      if (response.status === 200) {
        console.log("Editado com sucesso!");
      } else {
        console.log("Erro");
      }
    });

    form.setAttribute("style","display: none;");

    getAllMovies();
  });
}

async function deleteFavoriteMovie(el) {
  const id = el.currentTarget.dataset.id;

  // Lógica para deletar o filme
  // Aqui você pode fazer uma solicitação DELETE para a API para deletar o filme
  await fetch(`http://localhost:8080/filme/deletar?idFilme=${id}`, {
    method: "DELETE",
  }).then((response) => {
    if (response.status === 200) {
      console.log("Deletado com sucesso!");
    } else {
      console.log("Erro");
    }
  });

  getAllMovies();
}

function insertBtnAdd(details) {
  const addtButton = document.getElementById("addButton");

  addtButton.addEventListener("click", () => addFavoriteMovie(details));
}

getAllMovies();
