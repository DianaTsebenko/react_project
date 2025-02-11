import React, { useState, useEffect, useRef } from "react";

const SearchByName = ({ onSearch, type }) => {
  const [query, setQuery] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch(query);
    }, 1000);

    return () => clearTimeout(timeoutRef.current);
  }, [query, onSearch]);

  return (
    <div className="input-container">
      <input
        type="text"
        placeholder={`Enter name of the ${type}...`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="filter-input"
      />
    </div>
  );
};

export default SearchByName;
