import React from 'react';
import { Route, Routes } from 'react-router-dom';
import '../App.css';
import Country from '../pages/Country';
import Movie from '../pages/Movie';
import NewMovie from '../pages/NewMovie';
import Genre from '../pages/Genre';
import TVseries from '../pages/TVseries';
import MovieDetails from '../pages/MovieDetails';
import Header from './Header/Header';

const App = () => {
  return (
    <div>
      <Header />
      <main>
        <Routes>
          <Route path="/react_project" element={<NewMovie />} />
          <Route path="/react_project/genre" element={<Genre />} />
          <Route path="/react_project/country" element={<Country />} />
          <Route path="/react_project/movie" element={<Movie />} />
          <Route path="/react_project/tv-series" element={<TVseries />} />
          <Route path="/react_project/movie/:id" element={<MovieDetails />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
