import React, { useState } from "react";
import GenreFilter from "../components/GenreFilter/GenreFilter";
import FilteredGallery from "../components/FilteredGallery/FilteredGallery";

const Genre = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);

  return (
    <div>
      <GenreFilter onFilterChange={setSelectedGenres} />
      <FilteredGallery filterType="with_genres" filterValues={selectedGenres} urlType='/discover/movie'/>
    </div>
  );
};

export default Genre;
