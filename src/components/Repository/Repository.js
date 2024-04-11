import React, { useState, useEffect } from 'react';
import { totalMovieWatchTime,movieGenreCounts, allWatchedMovies, moviesWatchedMonth, moviesByRating, moviesWatchedYear} from '../../services/database';
import NavigationBar from '../NavigationBar/NavigationBar'

function Repository({ username="test" }) {
 
  const [stats, setStats] = useState({
    totalMovieWatchTime: [],
    movieGenreCount: [],
    allWatchedMovies: [],
    moviesWatchedMonth: [],
    moviesWatchedYear: [],
    moviesByRating: [],
  });
  useEffect(() => {
    fetchUserStats();
  }, []);
  const fetchUserStats = async () => {
    
  
    const data = {
      totalMovieWatchTime: await totalMovieWatchTime(username),
      movieGenreCount: await movieGenreCounts(username),
      allWatchedMovies: await allWatchedMovies(username),
      moviesWatchedMonth: await moviesWatchedMonth(username),
      moviesWatchedYear: await moviesWatchedYear(username),
      moviesByRating: await moviesByRating(username)
    };
    console.log('Stats:', data); 
    setStats(data);
  };


  
  const handleChange = (statName, value) => {
    setStats(prevStats => ({
      ...prevStats,
      [statName]: value
    }));
  };

  return (
    <>
    <NavigationBar />
    <div className='content'>
      <div className='movies'>{stats.allWatchedMovies.map((movie, index) => (
        <li className='movie' key={index}>{movie.movie_name}</li>
      ))}</div>
    </div>
  `</>
  );
}

export default Repository;