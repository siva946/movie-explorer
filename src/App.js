import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import MovieDetails from "./components/MovieDetails";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import HomeLandingPage from "./components/HomeLandingPage";


function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomeLandingPage/>}/>
        <Route path="/tmdb/:type/:id" element={<MovieDetails />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
