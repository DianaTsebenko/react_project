import React, { useState, useEffect } from "react";
import { tmdbApi } from "../api/api.js";
import "../App.css";

const MovieGallery = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await tmdbApi.get("/movie/popular");
        setMovies(response.data.results);
        setSelectedMovie(response.data.results[0]);
        document.body.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${response.data.results[0].poster_path})`;
      } catch (error) {
        console.error("Error fetching movie data", error);
      }
    };
    fetchMovies();
  }, []);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    document.body.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.poster_path})`;
  };

  const handleNext = () => {
    const currentIndex = movies.indexOf(selectedMovie);
    const nextIndex = (currentIndex + 1) % movies.length;
    handleSelectMovie(movies[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = movies.indexOf(selectedMovie);
    const prevIndex = (currentIndex - 1 + movies.length) % movies.length;
    handleSelectMovie(movies[prevIndex]);
  };

  if (movies.length === 0) return <div>Loading...</div>;

  return (
    <div className="app">
      <div className="slider" style={{ marginBottom: "80px" }}>
        {movies.map((movie) => (
          <div
            key={movie.id}
            className={`movie ${
              selectedMovie?.id === movie.id ? "active" : "inactive"
            }`}
            style={{
              width: "176px",
              height: "234px",
              borderRadius: "8px",
              backgroundImage: `url(https://image.tmdb.org/t/p/w200${movie.poster_path})`,
              backgroundPosition: "center",
              flex: "none",
              order: 3,
              flexGrow: 0,
              background: `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://image.tmdb.org/t/p/w200${movie.poster_path})`,
            }}
            onClick={() => handleSelectMovie(movie)}
          >
            <div className="movie-title">{movie.title}</div>
          </div>
        ))}
      </div>

      <button className="nav-button prev" onClick={handlePrev}>
        Previous
      </button>
      <button className="nav-button next" onClick={handleNext}>
        Next
      </button>
    </div>
  );
};

export default MovieGallery;