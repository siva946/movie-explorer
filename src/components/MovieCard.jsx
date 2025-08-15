import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.imdbID}`} className="movie" style={{textDecoration:"none"}}>
      <div>
        <span>{movie.Type}</span>
        <h3>{movie.Title}</h3>
      </div>
      <div>
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/400"}
          alt={movie.Title}
        />
      </div>
    </Link>
  );
}

export default MovieCard;
