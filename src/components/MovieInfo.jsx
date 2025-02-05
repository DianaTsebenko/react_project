import React, { useEffect, useState, useRef } from "react";
import "../styles/MovieInfo.css";
import { tmdbApi } from "../api/api";

const MovieInfo = ({ movie }) => {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [watchNowUrl, setWatchNowUrl] = useState("");
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [shouldShowMore, setShouldShowMore] = useState(false);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const checkDescriptionOverflow = () => {
      if (descriptionRef.current) {
        setShouldShowMore(descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight);
      }
    };

    checkDescriptionOverflow();
    window.addEventListener("resize", checkDescriptionOverflow);
    return () => window.removeEventListener("resize", checkDescriptionOverflow);
  }, [movie]);

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!movie) return;
      try {
        const response = await tmdbApi.get(`/movie/${movie.id}/videos`);
        const trailers = response.data.results;
        const officialTrailer = trailers.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );

        if (officialTrailer) {
          setTrailerUrl(`https://www.youtube.com/watch?v=${officialTrailer.key}`);
        } else {
          setTrailerUrl("");
        }
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };

    const fetchWatchProviders = async () => {
      if (!movie) return;
      try {
        const response = await tmdbApi.get(`/movie/${movie.id}/watch/providers`);
        const providers = response.data.results;

        const countryCode = "US";
        if (providers[countryCode] && providers[countryCode].link) {
          setWatchNowUrl(providers[countryCode].link);
        } else {
          setWatchNowUrl("");
        }
      } catch (error) {
        console.error("Error fetching watch providers:", error);
      }
    };

    fetchTrailer();
    fetchWatchProviders();
  }, [movie]);

  if (!movie) return null;

  return (
    <div className="movie-info">
      <h1 className="movie-title">{movie.title}</h1>
      <p className="movie-details">
        {movie.release_date ? movie.release_date.split("-")[0] : "Unknown"} •{" "}
        {movie.runtime ? `${movie.runtime} min` : "Unknown duration"} •{" "}
        {movie.genres && movie.genres.length > 0
          ? movie.genres.map((g) => g.name).join(", ")
          : "Unknown genres"}
      </p>

      <div
        className={`movie-description ${isDescriptionExpanded ? "expanded" : ""}`}
        ref={descriptionRef}
      >
        {movie.overview}
      </div>

      {shouldShowMore && (
        <button onClick={() => setDescriptionExpanded(!isDescriptionExpanded)} className="read-more">
          {isDescriptionExpanded ? "Read less" : "Read more"}
        </button>
      )}

      <div className="movie-buttons">
        {trailerUrl && (
          <a href={trailerUrl} target="_blank" rel="noopener noreferrer" className="watch-trailer">
            Watch Trailer
          </a>
        )}
        {watchNowUrl ? (
          <a href={watchNowUrl} target="_blank" rel="noopener noreferrer" className="watch-now">
            Watch Now
          </a>
        ) : (
          <span className="watch-now disabled">Not Available</span>
        )}
      </div>
    </div>
  );
};

export default MovieInfo;
