import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import '../App.css';
import Country from '../pages/Country';
import Movie from '../pages/Movie';
import NewMovie from '../pages/NewMovie';
import Genre from '../pages/Genre';
import TVseries from '../pages/TVseries';
import Header from './Header/Header';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <Header setSearchQuery={setSearchQuery} />
      <main>
        <Routes>
          <Route
            path="/react_project/"
            element={<NewMovie searchQuery={searchQuery} />}
          />
          <Route path="/react_project/genre" element={<Genre />} />
          <Route path="/react_project/country" element={<Country />} />
          <Route path="/react_project/movie" element={<Movie />} />
          <Route path="/react_project/tv-series" element={<TVseries />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
