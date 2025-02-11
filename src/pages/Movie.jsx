import React, { useState } from "react";
import SearchByName from "../components/SearchByName/SearchByName";
import FilteredGallery from "../components/FilteredGallery/FilteredGallery";

const Movie = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <SearchByName onSearch={setSearchQuery} type='movie'/>
      <FilteredGallery 
        filterType="query" 
        filterValues={searchQuery} 
        urlType={searchQuery ? "/search/movie" : "/movie/popular"} 
      />
    </div>
  );
};

export default Movie;
