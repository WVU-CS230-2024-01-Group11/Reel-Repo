import React, { useState, useEffect } from 'react';
import { totalMovieWatchTime,movieGenreCounts, allWatchedMovies, moviesWatchedMonth, moviesByRating, moviesWatchedYear} from '../../services/database';
import './UserStatistics.css'
import NavigationBar from '../NavigationBar/NavigationBar';

function UserStatistics({ username="test" }) {
 
  const [stats, setStats] = useState({
    totalMovieWatchTime: [0],
    movieGenreCount: [],
    allWatchedMovies: [],
    moviesWatchedMonth: [],
    moviesWatchedYear: [],
    moviesByRating: [],
  });
  useEffect(() => {
    fetchUserStats();
  }, [username]);
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
    <NavigationBar/>
  <div className="UserStatistics">
  <h2>User Statistics for {username}</h2>
  <div className="Stat">
    <p>Total Watch Time: {stats.totalMovieWatchTime[0].total_watch_time}</p>
    <p>Movie Genre Count:</p>
    <ul>
      {stats.movieGenreCount.map((genre, index) => (
        <li key={index}>
          {genre.movieGenre_name}: {genre.titles_watched}
        </li>
      ))}
    </ul>
    <p>Movies watched month: </p>
    <ul>
      {stats.moviesWatchedMonth.map((movie, index) => (
        <li key={index}>{movie.movie_name}</li>
      ))}
    </ul>
    
    <p>Movies watched this year: </p>
    <ul>
      {stats.moviesWatchedYear.map((movie, index) => (
        <li key={index}>{movie.movie_name}</li>
      ))}
    </ul>
  </div>
</div>
</>
  );
}

export default UserStatistics;