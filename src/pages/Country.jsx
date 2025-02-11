import React, { useState } from 'react';
import CountryFilter from '../components/CountryFilter/CountryFilter';
import FilteredGallery from '../components/FilteredGallery/FilteredGallery';

const Country = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country.iso_3166_1);
    console.log('Selected Country:', country);
    console.log(selectedCountry)
  };
  return (
    <main>
      <CountryFilter onCountrySelect={handleCountrySelect} />
      
       <FilteredGallery filterType="with_origin_country" filterValues={selectedCountry} />
    </main>
  );
};

export default Country;