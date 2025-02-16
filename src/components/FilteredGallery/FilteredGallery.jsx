import React, { useEffect, useState } from "react";
import { HiChevronDoubleUp } from "react-icons/hi";
import { tmdbApi } from "../../api/api";
import "./FilteredGallery.css";

const FilteredGallery = ({ filterType, filterValues, urlType }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const moviesPerPage = 20;

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let params = { page, per_page: moviesPerPage };

        if (filterValues && filterValues.length > 0) {
          params[filterType] = Array.isArray(filterValues)
            ? filterValues.join(",")
            : filterValues.trim();
        }

        const response = await tmdbApi.get(`${urlType}`, { params });
        setMovies((prevMovies) =>
          page === 1 ? response.data.results : [...prevMovies, ...response.data.results]
        );
        setHasMore(response.data.results.length === moviesPerPage); // Перевірка на кількість фільмів
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [filterType, filterValues, page, urlType]);

  useEffect(() => {
    setMovies([]);
    setPage(1);
  }, [filterType, filterValues, urlType]);

  const loadMoreMovies = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleScroll = () => {
    setShowBackToTop(window.scrollY > 500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading && page === 1) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="filtered-gallery">
        {movies.length > 0 ? (
          movies.filter(movie => movie.poster_path).map((movie) => (
            <a
              key={movie.id}
              href={urlType === "/search/tv" 
              ? `https://www.themoviedb.org/tv/${movie.id}` 
              : `https://www.themoviedb.org/movie/${movie.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="movie-card-link"
            >
              <div key={movie.id} className="movie-card-filtered">
                <div className="movie-poster-wrapper">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster-filtered"
                  />
                  <div className="movie-hover-details">
                    <p className="movie-description-filtered">
                      {movie.overview || "Description unavailable"}
                    </p>
                  </div>
                </div>
                <h4 className="movie-title-filtered">
                  {movie.title ? movie.title : movie.name ? movie.name : "Unknown Title"}
                </h4>
                <p className="movie-details-filtered">
                  {movie.release_date
                    ? movie.release_date.split("-")[0]
                    : movie.first_air_date
                    ? movie.first_air_date.split("-")[0]
                    : "Unknown"}{" "}
                  • {movie.vote_average ? `Vote: ${movie.vote_average}` : "Unknown vote"}
                </p>
              </div>
            </a>
          ))
        ) : (
          <h1 className="no-movies">No movies found...</h1>
        )}
      </div>
      {hasMore && movies.length % moviesPerPage === 0 && !loading && (
        <button onClick={loadMoreMovies} className="load-more-button">Load More</button>
      )}
      {showBackToTop && (
        <button onClick={scrollToTop} className="back-to-top-button"><HiChevronDoubleUp /></button>
      )}
    </div>
  );
};

export default FilteredGallery;
