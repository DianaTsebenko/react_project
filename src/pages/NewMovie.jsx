import MovieGallery from "../components/Gallery/MovieGallery";
import FilteredGallery from "../components/FilteredGallery/FilteredGallery";

const NewMovie = ({ searchQuery }) => {
  return searchQuery ? (
    <FilteredGallery filterType="query" filterValues={searchQuery} urlType="/search/movie" />
  ) : (
    <MovieGallery />
  );
};

export default NewMovie;
