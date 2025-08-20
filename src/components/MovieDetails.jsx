import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import YouTube from "react-youtube";
import './MovieDetails.css'
// const omdbKey = process.env.REACT_APP_OMDB_API;
const ytapiKey = process.env.REACT_APP_YT_API_KEY;
const tmdbkey=process.env.REACT_APP_TMDB_API;
const TMDB_API_URL="https://api.themoviedb.org/3";
function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerId, setTrailerId] = useState("");

  // Fetch Movie Info
  useEffect(() => {
    fetch(`${TMDB_API_URL}/movie/${id}?api_key=${tmdbkey}`)
      .then((res) => res.json())
      .then((data) => {
        // Map TMDB response to expected format
        const formattedMovie = {
          ...data,
          Title: data.title,
          Year: data.release_date ? data.release_date.split("-")[0] : "N/A",
          Genre: data.genres ? data.genres.map(g => g.name).join(", ") : "N/A",
          Plot: data.overview || "No plot available",
          Poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : "https://via.placeholder.com/400",
          imdbID: data.imdb_id || data.id,
          imdbRating:data.vote_average,
          runTime:data.runtime,
          Type: "movie"
        };
        setMovie(formattedMovie);
      });
  }, [id]);
  // Fetch episodes for series
  // useEffect(() => {
  //   if (movie && movie.Type === "series" && movie.totalSeasons) {
  //     const fetchAllEpisodes = async () => {
  //       let allEpisodes = [];
  //       for (let season = 1; season <= Number(movie.totalSeasons); season++) {
  //         const res = await fetch(`${omdbKey}&i=${movie.imdbID}&Season=${season}`);
  //         const data = await res.json();
  //         if (data.Episodes) {
  //           allEpisodes = [...allEpisodes, ...data.Episodes.map(ep => ({
  //             ...ep,
  //             Season: season
  //           }))];
  //         }
  //       }
  //       setEpisodes(allEpisodes);
  //     };
  //     fetchAllEpisodes();
  //   }
  // }, [movie]);

  // Fetch YouTube Trailer
  useEffect(() => {
    if (movie?.Title) {
      fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
          movie.Title + " trailer"
        )}&key=${ytapiKey}`
      )
        .then((res) => res.json())
        .then((data) => {
          const vid = data.items?.[0]?.id?.videoId;
          if (vid) setTrailerId(vid);
        });
    }
  }, [movie]);


  if (!movie) {
    return <h2 style={{ textAlign: "center", paddingTop: "350px" }}>Loading movie details…</h2>;
  }

  return (
    <div className="movie-details">
      <Link to="/" className="back-btn">⬅ Back</Link>
      <div className="details-container">
<img 
  src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/400"} 
  alt={movie.Title} 
  className="details-poster img-fluid rounded" 
/>
        <div className="details-info ">
          <h1>{movie.Title}</h1>
          <p><strong>Year:</strong> {movie.Year}   <strong>ImDb Rating:</strong> {movie.imdbRating}</p>
          <p><strong>Genre:</strong> {movie.Genre}</p>
          <p><strong>Plot:</strong> {movie.Plot}</p>

          {/* Trailer */}
          {trailerId ? (
            <YouTube videoId={trailerId} opts={{ width: '100%', height: '215' }} />
          ) : (
            <p>Trailer not found.</p>
          )}


        </div>
          {
            movie.Type==="movie"&& (
              <div className="Movie-player">
                <h4>The movie is here</h4>
                <iframe
            src={`https://vidsrc.cc/v3/embed/movie/${movie.imdbID}?autoPlay=false`}
            width="100%"
            height="400"
            allowFullScreen
            frameBorder="0"
            title="Vidsrc Player"
            sandbox="allow-scripts allow-same-origin"
          ></iframe>
              </div>
            )
          }
          {/* Action Buttons */}
          <div className="action-buttons">
            <a
              href={`https://www.justwatch.com/in/search?q=${encodeURIComponent(movie.Title)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-watch"
            >
              Watch Online (Official Sources)
            </a>
          </div>
        </div>
      </div>
  );
}

export default MovieDetails;