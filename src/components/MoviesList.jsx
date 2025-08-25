import { useState, useEffect } from "react";
import MovieCard from "./MovieCard";

const TMDB_API_URL = "https://api.themoviedb.org/3/movie/popular";
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API;

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(`${TMDB_API_URL}?api_key=${TMDB_API_KEY}&page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        // ✅ transform here (data is available now)
        const formattedMovies = (data.results || []).map((movie) => ({
          imdbID: movie.id, // use TMDB id as unique key
          Title: movie.title,
          Year: movie.release_date ? movie.release_date.split("-")[0] : "N/A",
          Type: "movie",
          Poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/400",
        }));

        setMovies(formattedMovies);
        setTotalPages(data.total_pages);
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, [page]);

  return (
    <div className="movies-section">
      <p className="text-white fs-4">Movies List</p>
      <div className="row">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            className="col-12 col-sm-6 col-md-4 col-lg-3 mb-5 pb-3 col-xl-2 d-flex"
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="btn btn-outline-light"
        >
          Prev
        </button>

        <span className="text-white">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="btn btn-outline-light"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default MoviesList;
