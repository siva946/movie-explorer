import { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const OMDB_API_URL = process.env.REACT_APP_OMDB_URL;
const TMDB_API_URL = "https://api.themoviedb.org/3";
const TMDB_KEY = process.env.REACT_APP_TMDB_API; // 🔑 Replace with your TMDB key

function HomeLandingPage() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const[tvshows,setTvshows]=useState([]);

  // 🔍 Search movies from OMDb
  const searchMovies = async (title) => {
    setIsSearch(true);
    const response = await fetch(`${OMDB_API_URL}&s=${title}`);
    const data = await response.json();
    setMovies(data.Search || []);
  };
  
  
  const fetchTrendingSeries=async()=>{
    setIsSearch(false);
    const response=await fetch(
      `${TMDB_API_URL}/trending/tv/week?api_key=${TMDB_KEY}`
    )
    const data=await response.json();

    const formattedSeries=data.results.map((show)=>({
      id:show.id,
      Title:show.name,
Year: show.first_air_date
        ? show.first_air_date.split("-")[0]
        : "N/A",
      Type: "TV",
      Poster: show.poster_path
        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
        : "https://via.placeholder.com/400",

    }));
    setTvshows(formattedSeries);
  }
useEffect(()=>{
  fetchTrendingSeries();
},[]);

  // 🎬 Fetch trending movies from TMDB
  const fetchTrendingMovies = async () => {
    setIsSearch(false);
    const response = await fetch(
      `${TMDB_API_URL}/trending/movie/week?api_key=${TMDB_KEY}`
    );
    const data = await response.json();

    // Map TMDB results into OMDB-like objects for MovieCard
    const formattedMovies = data.results.map((movie) => ({
      imdbID: movie.id, // using TMDB id here
      Title: movie.title,
      Year: movie.release_date ? movie.release_date.split("-")[0] : "N/A",
      Type: "movie",
      Poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/400",
    }));

    setMovies(formattedMovies);
  };

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  return (
    <div className="Landingpage bg-dark d-flex flex-column justify-content-center text-center pt-5">
      <p
        className="heading col-12"
        style={{ fontSize: "4rem", fontWeight: "700", color: "white" }}
      >
        Discover the{" "}
        <span style={{ color: "green" }}>
          world of
          <br /> Cinema
        </span>
      </p>
      <p className="sub-heading col-8 mx-auto" style={{ color: "grey", fontSize: "1.5rem" }}>
        Search millions of movies and TV shows. Stream instantly with
        high-quality video playback.
      </p>

      {/* 🔍 Search Bar */}
      <div className="search-bar bg-dark mt-4 mb-4 w-100 gap-3">
        <input
          placeholder="Search Movies, Series..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchMovies(searchTerm)}
          style={{ width: "500px", padding: "10px 15px", borderRadius: "10px" }}
        />
        <Link
          onClick={() => searchMovies(searchTerm)}
          style={{
            color: "white",
            fontSize: "1.5rem",
            marginLeft: "20px",
          }}
        >
          <FaSearch />
        </Link>
      </div>

      {/* 🔥 Heading */}
      <div className="d-flex justify-content-between text-white me-5 mx-5 mb-3">
        <p style={{ fontSize: "x-large", fontWeight: "bold" }}>
          {isSearch ? "Search Results" : "Trending Movies"}
        </p>
        <span style={{ color: "grey" }}>{movies.length} results found</span>
      </div>

      {/* 🎥 Movie List */}
      <div className="movies-list">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.imdbID}
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-5 col-xl-2 d-flex"
            >
              <MovieCard movie={movie} />
            </div>
          ))
        ) : (
          <div className="empty text-center">
            <h2>No movies found</h2>
          </div>
        )}
      </div>
      <div className="d-flex justify-content-between text-white me-5 mx-5 mb-3 mt-5">
            <p style={{ fontSize: "x-large", fontWeight: "bold" }}>
              Trending TV Shows
            </p>
             <span style={{ color: "grey" }}>{tvshows.length} results found</span>
          </div>
      <div className="movies-list">
        {
          tvshows.length>0?(
            tvshows.map((show)=>(
              <div key={show.iD}
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-5 col-xl-2 d-flex">
                <MovieCard movie={show}/>
          </div>
            ))
          ):(
            <div className="empty text-center">
              <h2>No TV shows found</h2>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default HomeLandingPage;
