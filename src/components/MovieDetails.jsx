import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import YouTube from "react-youtube";


const omdbKey =process.env.REACT_APP_OMDB_API ;
const ytapiKey = process.env.REACT_APP_YT_API_KEY;
function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerId, setTrailerId] = useState("");
  const [downloadLink, setDownloadLink] = useState(null);
  const [streamLink, setStreamLink] = useState(null);

  // Fetch Movie Info
  useEffect(() => {
    fetch(`${omdbKey}&i=${id}&plot=full`)
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, [id]);

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

  // Search Internet Archive for Public Domain
useEffect(() => {
  fetch("https://movie-explorer-qvf8.onrender.com/api/archive")
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then(data => {
      console.log("Archive data:", data);
      // setState(data) or handle the data here
    })
    .catch(err => {
      console.error("Fetch error:", err);
    });
}, []);

  if (!movie) {
    return <h2 style={{ textAlign: "center",paddingTop:"350px"}}>Loading movie details…</h2>;
  }

  return (
    <div className="movie-details">
      <Link to="/" className="back-btn">⬅ Back</Link>
      <div className="details-container">
        <img src={movie.Poster} alt={movie.Title} className="details-poster" />
        <div className="details-info">
          <h1>{movie.Title}</h1>
          <p><strong>Year:</strong> {movie.Year}</p>
          <p><strong>Genre:</strong> {movie.Genre}</p>
          <p><strong>Plot:</strong> {movie.Plot}</p>

          {/* Trailer */}
          {trailerId ? (
            <YouTube videoId={trailerId} opts={{ width: '100%', height: '315' }} />
          ) : (
            <p>Trailer not found.</p>
          )}

          {/* Public Domain Streaming */}
          {streamLink && (
            <div className="stream-player">
              <h3>📽 Watch Now</h3>
              <video width="100%" controls>
                <source src={streamLink} type="video/mp4" />
                Your browser does not support HTML video.
              </video>
            </div>
          )}

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

            {downloadLink ? (
              <a
                href={downloadLink}
                target="_blank"
                rel="noreferrer"
                className="btn-download"
              >
                 Download
              </a>
            ) : (
              <button className="btn-download disabled" disabled>
                 Download Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
