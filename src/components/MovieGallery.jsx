import React, { useState, useEffect, useRef } from "react";
import { tmdbApi } from "../api/api.js";
import MovieInfo from "./MovieInfo";
import "../styles/MovieGallery.css";

const MovieGallery = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const galleryRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragRatio = useRef(1.5);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  let timeout;

  const fetchMovies = async (isLeftScroll = false) => {
    if (isFetching) return;
    setIsFetching(true);

    try {
      const response = await tmdbApi.get("/movie/popular");
      const newMovies = response.data.results;

      setMovies((prevMovies) => {
        if (isLeftScroll) {
          return [...newMovies, ...prevMovies];
        } else {
          return [...prevMovies, ...newMovies];
        }
      });

      if (!selectedMovie && newMovies.length > 0) {
        handleSelectMovie(newMovies[0]);
      }
    } catch (error) {
      console.error("Error fetching movie data", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

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
      <div
        className="slider"
        ref={galleryRef}
        onMouseDown={(e) => {
          isDragging.current = true;
          setIsDraggingState(true);
          startX.current = e.pageX - galleryRef.current.offsetLeft;
          scrollLeft.current = galleryRef.current.scrollLeft;
          galleryRef.current.style.cursor = "grabbing";
        }}
        onMouseMove={(e) => {
          if (!isDragging.current) return;
          e.preventDefault();
          const x = e.pageX - galleryRef.current.offsetLeft;
          const walk = (x - startX.current) * dragRatio.current;
          window.requestAnimationFrame(() => {
            galleryRef.current.scrollLeft = scrollLeft.current - walk;
          });
        }}
        onMouseUp={() => {
          isDragging.current = false;
          setIsDraggingState(false);
          galleryRef.current.style.cursor = "grab";
        }}
        onMouseLeave={() => {
          isDragging.current = false;
          setIsDraggingState(false);
          galleryRef.current.style.cursor = "grab";
        }}
        onScroll={() => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            const scrollPosition = galleryRef.current.scrollLeft;
            const scrollWidth = galleryRef.current.scrollWidth;
            const clientWidth = galleryRef.current.clientWidth;

            if (scrollPosition + clientWidth >= scrollWidth - 10 && !isFetching) {
              fetchMovies();
            }

            const SCROLL_THRESHOLD = 50;
            if (scrollPosition <= SCROLL_THRESHOLD && !isFetching && scrollPosition >= 0) {
              fetchMovies(true);
            }
          }, 200);
        }}
      >
        {movies.map((movie, index) => (
          <div
            key={index}
            className={`movie ${selectedMovie?.id === movie.id ? "active" : "inactive"} ${isDraggingState ? "dragging" : ""}`}
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w200${movie.poster_path})`,
            }}
            onClick={() => handleSelectMovie(movie)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default MovieGallery;
