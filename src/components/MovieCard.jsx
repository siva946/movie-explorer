import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  // Decide which ID to use (TMDB vs OMDb)
  const movieId = movie.imdbID || movie.id; 
  const isTmdb = !!movie.id && !movie.imdbID;
  const tmdbType = movie.Type === "TV" ? "tv" : "movie";

  return (
    <Link
      to={isTmdb ? `/tmdb/${tmdbType}/${movieId}` : `/movie/${movieId}`}
      className="movie-card h-80 bg-dark text-decoration-none text-white"
    >
      <img
        src={
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/400"
        }
        alt={movie.Title}
        className="img-fluid rounded"
        style={{objectFit:"cover",height:"100%"}}
      />
      <div>
        <h6 className="card-title">{movie.Title}</h6>
        <small>
          {movie.Type || "Movie"} • {movie.Year}
        </small>
      </div>
    </Link>
  );
}

export default MovieCard;
