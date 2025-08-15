import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import MovieCard from "./components/MovieCard";
import MovieDetails from "./components/MovieDetails";
import SearchIcon from "./search.svg";

const API_URL = "http://www.omdbapi.com/?i=tt3896198&apikey=aad3a173";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const searchMovies = async (title) => {
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();
    setMovies(data.Search || []);
  };

  useEffect(() => {
    searchMovies("batman");
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app">
              <h1>Movie Explorer</h1>
              <div className="search">
                <input
                  placeholder="🔍 Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchMovies(searchTerm)}
                />
                <img src={SearchIcon} alt="search" onClick={() => searchMovies(searchTerm)} />
              </div>

              <div className="container">
                {movies.length > 0 ? (
                  movies.map((movie) => <MovieCard movie={movie} key={movie.imdbID} />)
                ) : (
                  <div className="empty">
                    <h2>No movies found</h2>
                  </div>
                )}
              </div>
            </div>
          }
        />

        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
