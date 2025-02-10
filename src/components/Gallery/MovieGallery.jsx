import React, { useState, useEffect, useRef, useCallback } from "react";
import { tmdbApi } from "../../api/api";
import MovieInfo from "../Info/MovieInfo";
import "./MovieGallery.css";

const MovieGallery = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const isFetchingRef = useRef(false); // ✅ Use useRef to track fetching state
  const galleryRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragRatio = useRef(1.5);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const fetchMovies = useCallback(async (isLeftScroll = false) => {
    if (isFetchingRef.current) return; // ✅ Prevent fetching if already in progress
    isFetchingRef.current = true; // ✅ Update useRef instead of state

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
      isFetchingRef.current = false; // ✅ Reset useRef after fetching
    }
  }, [selectedMovie]); // ✅ No 'isFetching' in dependencies

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

  const handleScroll = useCallback(() => {
    if (!galleryRef.current || isFetchingRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;

    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      fetchMovies();
    }

    if (scrollLeft <= 50) {
      fetchMovies(true);
    }
  }, [fetchMovies]); 

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const onScroll = () => window.requestAnimationFrame(handleScroll);
    gallery.addEventListener("scroll", onScroll);

    return () => gallery.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

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
