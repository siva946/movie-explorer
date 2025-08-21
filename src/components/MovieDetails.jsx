import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import YouTube from "react-youtube";
import {FaArrowUp,FaArrowLeft,FaArrowDown} from "react-icons/fa";
// const omdbKey = process.env.REACT_APP_OMDB_API;
const ytapiKey = process.env.REACT_APP_YT_API_KEY;
const tmdbkey=process.env.REACT_APP_TMDB_API;
const TMDB_API_URL="https://api.themoviedb.org/3";
function MovieDetails() {
  const params = useParams();
  const id = params.id;
  const mediaType = params.type || 'movie';
  const [movie, setMovie] = useState(null);
  const [trailerId, setTrailerId] = useState("");
  const [seasons, setSeasons] = useState([]);
  const [expandedSeasons, setExpandedSeasons] = useState(new Set());
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  // Fetch Movie Info
  useEffect(() => {
    const fetchMedia = async () => {
      const data = await fetch(`${TMDB_API_URL}/${mediaType}/${id}?api_key=${tmdbkey}`).then(res => res.json());
      let imdbID = data.imdb_id;
      if (mediaType === 'tv' && !imdbID) {
        const ext = await fetch(`${TMDB_API_URL}/tv/${id}/external_ids?api_key=${tmdbkey}`).then(res => res.json());
        imdbID = ext.imdb_id;
      }
      const isSeries = mediaType === 'tv';
      const formattedMovie = {
        ...data,
        Title: isSeries ? data.name : data.title,
        Year: ((isSeries ? data.first_air_date : data.release_date) || '').split("-")[0] || "N/A",
        Genre: data.genres ? data.genres.map(g => g.name).join(", ") : "N/A",
        Plot: data.overview || "No plot available",
        Poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : "https://via.placeholder.com/400",
        imdbID: imdbID || data.id.toString(),
        imdbRating: data.vote_average,
        runTime: isSeries ? null : data.runtime,
        Type: isSeries ? "series" : "movie",
        totalSeasons: isSeries ? data.number_of_seasons : null,
      };
      setMovie(formattedMovie);
    };
    fetchMedia();
  }, [id, mediaType]);
  // Fetch seasons and episodes for series
  useEffect(() => {
    if (movie && movie.Type === "series" && movie.totalSeasons) {
      const fetchSeasons = async () => {
        let allSeasons = [];
        for (let season = 1; season <= movie.totalSeasons; season++) {
          const res = await fetch(`${TMDB_API_URL}/tv/${id}/season/${season}?api_key=${tmdbkey}`);
          const seasonData = await res.json();
          allSeasons.push({
            season_number: seasonData.season_number,
            name: seasonData.name,
            poster: seasonData.poster_path ? `https://image.tmdb.org/t/p/w500${seasonData.poster_path}` : null,
            episodes: seasonData.episodes ? seasonData.episodes.map(ep => ({
              episode_number: ep.episode_number,
              name: ep.name,
              air_date: ep.air_date,
              vote_average: ep.vote_average,
            })) : [],
          });
        }
        setSeasons(allSeasons);
      };
      fetchSeasons();
    }
  }, [movie, id]);

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


  const toggleSeason = (seasonNum) => {
    const newSet = new Set(expandedSeasons);
    if (newSet.has(seasonNum)) {
      newSet.delete(seasonNum);
    } else {
      newSet.add(seasonNum);
    }
    setExpandedSeasons(newSet);
  };

  if (!movie) {
    return <h2 style={{ textAlign: "center", paddingTop: "350px" }}>Loading movie details…</h2>;
  }

  return (
    <div className="movie-details">
      <Link to="/" className="back-btn text-decoration-none"><FaArrowLeft/> Back</Link>
      <div className="details-container">
        <div className="details-header">
<img 
  src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/400"} 
  alt={movie.Title} 
  className="details-poster img-fluid rounded" 
/>
          <div className="details-info ">
            <h1>{movie.Title}</h1>
            <p><strong>Year:</strong> {movie.Year}   <strong>ImDb Rating:</strong> {movie.imdbRating}</p>
            <p><strong>Duration:</strong> {movie.Type === "movie" ? (movie.runTime ? `${movie.runTime} min` : 'N/A') : (movie.totalSeasons ? `${movie.totalSeasons} Seasons` : 'N/A')}</p>
            <p><strong>Genre:</strong> {movie.Genre}</p>
            <p><strong>Plot:</strong> {movie.Plot}</p>

            {/* Trailer */}
            {trailerId ? (
              <YouTube videoId={trailerId} opts={{ width: '100%', height: '215' }} />
            ) : (
              <p>Trailer not found.</p>
            )}


          </div>
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
          {
            movie.Type==="series"&& (
              <div className="series-details">
                <h2>Seasons and Episodes</h2>
                {selectedEpisode && (
                  <div className="episode-player">
                    <h4>Watching Season {selectedEpisode.season} Episode {selectedEpisode.episode}</h4>
                    <iframe
                      src={`https://vidsrc.cc/v3/embed/tv/${movie.imdbID}/${selectedEpisode.season}/${selectedEpisode.episode}?autoPlay=false`}
                      width="100%"
                      height="400"
                      allowFullScreen
                      frameBorder="0"
                      title="Vidsrc Player"
                      sandbox="allow-scripts allow-same-origin"
                    ></iframe>
                  </div>
                )}
                {seasons.length === 0 ? <p>Loading seasons...</p> : (
                  <div className="seasons-container">
                    {seasons.map(season => (
                      <div key={season.season_number} className="season">
                        <button onClick={() => toggleSeason(season.season_number)}>
                          Season {season.season_number} - {season.name} {expandedSeasons.has(season.season_number) ? <FaArrowUp/> : <FaArrowDown/>}
                        </button>
                        {expandedSeasons.has(season.season_number) && (
                          <>
                            <h4>Episodes</h4>
                            <ul className="episodes-list">
                              {season.episodes.map(ep => (
                                <li 
                                  key={ep.episode_number} 
                                  onClick={() => setSelectedEpisode({season: season.season_number, episode: ep.episode_number})}
                                  style={{cursor: 'pointer'}}
                                >
                                  <strong>Episode {ep.episode_number}: {ep.name}</strong>
                                  <p>Air Date: {ep.air_date} | Rating: {ep.vote_average}</p>
                                  <p>{ep.overview}</p>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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