import { useState, useRef } from "react";
import { Search, X } from "lucide-react";
import "./SearchBar.css";

export default function SearchBar({ setSearchQuery }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget) && query === "") {
      setIsOpen(false);
    }
  };

  const handleChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSearchQuery(newQuery); 
  };

  return (
    <div className="search-bar-cont" onBlur={handleBlur}>
      {!isOpen ? (
        <div className="search-icon-cont">
          <div className="custom-div"></div>
          <button onClick={handleOpen} className="search-bar-icon">
            <Search size={18} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search size={18} className="input-icon" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Name, genre ..."
            className="search-input"
          />
          {query && (
            <button onClick={() => { setQuery(""); setSearchQuery(""); }} className="clear-button">
              <X size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

