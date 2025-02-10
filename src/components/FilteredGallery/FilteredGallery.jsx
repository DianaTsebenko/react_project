import React, { useEffect, useState } from "react";
import { tmdbApi } from "../../api/api";
import "./FilteredGallery.css"; 

const FilteredGallery = ({ filterType, filterValues }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await tmdbApi.get("/discover/movie", {
          params: {
            [filterType]: filterValues.join(","),
          },
        });
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    if (filterValues.length > 0) {
      fetchMovies();
    }
  }, [filterType, filterValues]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="filtered-gallery">
      {movies.map((movie) => (
        <div key={movie.id} className="movie-card-filtered">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="movie-poster-filtered"
          />
              <h4 className="movie-title-filtered">{movie.title}</h4>
               <p className="movie-details-filtered">
                    {movie.release_date ? movie.release_date.split("-")[0] : "Unknown"} •{" "}
                    {movie.vote_average ? `Vote: ${movie.vote_average}` : "Unknown vote"}
                </p>

        </div>
      ))}
    </div>
  );
};

export default FilteredGallery;
