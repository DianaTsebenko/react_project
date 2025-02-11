import React, { useState } from "react";
import SearchByName from "../components/SearchByName/SearchByName";
import FilteredGallery from "../components/FilteredGallery/FilteredGallery";

const TVseries = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <SearchByName onSearch={setSearchQuery} type='tv serie'/>
      <FilteredGallery 
        filterType="query" 
        filterValues={searchQuery} 
        urlType={searchQuery ? "/search/tv" : "/tv/on_the_air"} 
      />
    </div>
  );
};

export default TVseries;