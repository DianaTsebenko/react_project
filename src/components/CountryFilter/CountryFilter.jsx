import React, { useState, useEffect } from 'react';
import { tmdbApi } from '../../api/api';  
import './CountryFilter.css'; 

const CountryFilter = ({ onCountrySelect }) => {
  const [inputValue, setInputValue] = useState(''); 
  const [countries, setCountries] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [debouncedInput, setDebouncedInput] = useState(''); 
  const [selectedCountry, setSelectedCountry] = useState(null);  // Додали стан для вибраної країни

  // Затримка перед відправкою запиту
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(inputValue);
    }, 1000); 

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Пошук країн за введеним значенням
  useEffect(() => {
    if (debouncedInput.length >= 1) {
      const fetchCountries = async () => {
        setIsLoading(true);
        try {
          const response = await tmdbApi.get('/configuration/countries');
          if (!response.data || response.data.length === 0) {
            console.log('No countries returned');
          }

          const filteredCountries = response.data.filter(country => 
            country.english_name && country.english_name.toLowerCase().includes(debouncedInput.toLowerCase())
          ); 

          if (filteredCountries.length === 0) {
            console.log('No countries match the input');
          }

          setCountries(filteredCountries);
        } catch (error) {
          console.error('Error fetching countries:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCountries();
    } else {
      setCountries([]);  
    }
  }, [debouncedInput]);

  // Хендл для зміни тексту в полі вводу
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Хендл для вибору країни
  const handleCountrySelect = (country) => {
    setInputValue(country.english_name);  
    setSelectedCountry(country); 
    onCountrySelect(country); 
    setInputValue(''); 
  };

  return (
    <div className="input-container">
      <input
        type="text"
        value={inputValue}  
        onChange={handleInputChange}  
        placeholder={selectedCountry ? selectedCountry.english_name : 'Enter country'}  
        className="filter-input"
      />
      {isLoading && <p className="loading-text">Loading...</p>}
      {countries.length > 0 && (
        <ul className="country-list">
          {countries.map((country) => (
            <li
              key={country.iso_3166_1}
              onClick={() => handleCountrySelect(country)} 
              className="country-item"
            >
              {country.english_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountryFilter;
