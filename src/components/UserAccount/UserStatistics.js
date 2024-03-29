import React, { useState, useEffect } from 'react';
import { totalMovieWatchTime,movieGenreCounts, allWatchedMovies, moviesWatchedMonth, moviesByRating, moviesWatchedYear} from '../../services/database';


function UserStatistics({ username="test" }) {
 
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
  <div className="UserStatistics">
  <h2>User Statistics for {username}</h2>
  <div className="Stat">
    <p>Total Watch Time: {stats.totalMovieWatchTime}</p>
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
  </div>
</div>
  );
}

export default UserStatistics;