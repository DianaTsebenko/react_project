import React, { useState, useEffect, useRef, useCallback } from "react";
import { tmdbApi } from "../../api/api";
import MovieInfo from "../Info/MovieInfo";
import "./MovieGallery.css";

const MovieGallery = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const isFetchingRef = useRef(false);
  const galleryRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragRatio = useRef(1.5);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const fetchMovies = useCallback(async (isLeftScroll = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const response = await tmdbApi.get("/movie/popular");
      const newMovies = response.data.results;

      setMovies((prevMovies) => (isLeftScroll ? [...newMovies, ...prevMovies] : [...prevMovies, ...newMovies]));

      if (!selectedMovie && newMovies.length > 0) {
        handleSelectMovie(newMovies[0]);
      }
    } catch (error) {
      console.error("Error fetching movie data", error);
    } finally {
      isFetchingRef.current = false;
    }
  }, [selectedMovie]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleSelectMovie = async (movie) => {
    try {
      const response = await tmdbApi.get(`/movie/${movie.id}`);
      const fullMovieDetails = response.data;

      setSelectedMovie({
        ...movie,
        genres: fullMovieDetails.genres,
        runtime: fullMovieDetails.runtime,
      });

      document.body.style.backgroundImage = `linear-gradient(to top, rgba(0, 0, 0, 0), rgba(7, 7, 7, 0.7)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  return (
    <div className="app">
      {selectedMovie && <MovieInfo movie={selectedMovie} />}
      <div className="slider" ref={galleryRef}>
        {movies.map((movie, index) => (
          <div
            key={index}
            className={`movie ${selectedMovie?.id === movie.id ? "active" : "inactive"} ${isDraggingState ? "dragging" : ""}`}
            onClick={() => handleSelectMovie(movie)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              className="movie-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieGallery;