import React, { useState, useEffect, useRef, useCallback } from "react";
import { tmdbApi } from "../../api/api";
import MovieInfo from "../Info/MovieInfo";
import "./MovieGallery.css";

const MovieGallery = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const sliderRef = useRef(null);
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const duplicatedMovies = useRef([]);

  const fetchMovies = useCallback(async () => {
    try {
      const response = await tmdbApi.get("/movie/popular");
      const movieList = response.data.results;

      duplicatedMovies.current = [
        ...movieList.slice(-3),
        ...movieList,
        ...movieList.slice(0, 3),
      ];

      if (movieList.length > 0 && !selectedMovie) {
        setSelectedMovie(movieList[0]);
      }
    } catch (error) {
      console.error("Error fetching movie data", error);
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

  const handleMouseDown = (e) => {
    e.preventDefault();
    isMouseDown.current = true;
    startX.current = e.clientX;
    scrollLeft.current = sliderRef.current.scrollLeft;
    sliderRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown.current) return;
    const distance = e.clientX - startX.current;
    sliderRef.current.scrollLeft = scrollLeft.current - distance;
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
    sliderRef.current.style.cursor = "grab";
  };

  const handleMouseLeave = () => {
    if (isMouseDown.current) {
      isMouseDown.current = false;
      sliderRef.current.style.cursor = "grab";
    }
  };

  const handleScroll = () => {
    const scrollWidth = sliderRef.current.scrollWidth;
    const clientWidth = sliderRef.current.clientWidth;
    const scrollPosition = sliderRef.current.scrollLeft;

    if (scrollPosition >= scrollWidth - clientWidth) {
      sliderRef.current.scrollLeft = clientWidth;
    }

    if (scrollPosition <= 0) {
      sliderRef.current.scrollLeft = scrollWidth - 2 * clientWidth;
    }
  };

  return (
    <div className="app">
      {selectedMovie && <MovieInfo movie={selectedMovie} />}
      <div
        className="slider-container"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onScroll={handleScroll}
      >
        <div className="slider">
          {duplicatedMovies.current.map((movie, index) => (
            <div
              key={index}
              className={`movie ${selectedMovie?.id === movie.id ? "active" : "inactive"}`}
              onClick={() => handleSelectMovie(movie)}
              data-id={movie.id}
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
    </div>
  );
};

export default MovieGallery;
