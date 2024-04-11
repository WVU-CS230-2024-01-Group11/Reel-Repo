import React, { useState, useEffect } from 'react';
import { totalMovieWatchTime,movieGenreCounts, allWatchedMovies, moviesWatchedMonth, moviesByRating, moviesWatchedYear} from '../../services/database';
import { totalTVWatchTime, TVGenreCounts, allWatchedEpisodes, TVWatchedMonth, TVWatchedYear, TVByRating } from '../../services/database';


function TVStats({ username="test" }) {
 
  const [stats, setStats] = useState({
    totalTVWatchTime: [0],
    TVGenreCount: [],
    allWatchedEpisodes: [],
    TVWatchedMonth: [],
    TVWatchedYear: [],
    TVByRating: [],
  });
  useEffect(() => {
    fetchUserStats();
  }, [username]);
  const fetchUserStats = async () => {
    
  
    const data = {
      totalTVWatchTime: await totalTVWatchTime(username),
      TVGenreCount: await TVGenreCounts(username),
      allWatchedEpisodes: await allWatchedEpisodes(username),
      TVWatchedMonth: await TVWatchedMonth(username),
      TVWatchedYear: await TVWatchedYear(username),
      TVByRating: await TVByRating(username)
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

  const organizedData = stats.TVWatchedYear.reduce((acc, show) => {
    if (!acc[show.show_name]) {
      acc[show.show_name] = {};
    }
    if (!acc[show.show_name][show.season_number]) {
      acc[show.show_name][show.season_number] = [];
    }
    acc[show.show_name][show.season_number].push(show);
    return acc;
  }, {});

  const organizedMonthData = stats.TVWatchedMonth.reduce((acc, show) => {
    if (!acc[show.show_name]) {
      acc[show.show_name] = {};
    }
    if (!acc[show.show_name][show.season_number]) {
      acc[show.show_name][show.season_number] = [];
    }
    acc[show.show_name][show.season_number].push(show);
    return acc;
  }, {});
  
  return (
  <div className="UserStatistics">
  <h2>TV Statistics for {username}</h2>
  <div className="Stat">
    <p>Total TV Watch Time: {stats.totalTVWatchTime[0].total_watch_time}</p>
    <p>TV Genre Count:</p>
    <ul>
      {stats.TVGenreCount.map((genre, index) => (
        <li key={index}>
          {genre.tvGenre_name}: {genre.media_count}
        </li>
      ))}
    </ul>
    <p>TV watched this month:</p>
<ul>
  {Object.keys(organizedMonthData).map((showName, index) => (
    <li key={index}>
      {showName}
      <ul>
        {Object.keys(organizedMonthData[showName]).map((seasonNumber) => (
          <li key={seasonNumber}>
            Season {seasonNumber}
            <ul>
              {organizedMonthData[showName][seasonNumber].map((episode, episodeIndex) => (
                <li key={episodeIndex}>
                  Episode {episode.episode_number}: {episode.episode_name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </li>
  ))}
</ul>

    
    <p>TV watched this year:</p>
<ul>
  {Object.keys(organizedData).map((showName, index) => (
    <li key={index}>
      {showName}
      <ul>
        {Object.keys(organizedData[showName]).map((seasonNumber) => (
          <li key={seasonNumber}>
            Season {seasonNumber}
            <ul>
              {organizedData[showName][seasonNumber].map((episode, episodeIndex) => (
                <li key={episodeIndex}>
                  Episode {episode.episode_number}: {episode.episode_name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </li>
  ))}
</ul>
  </div>
</div>
  );
}

export default TVStats;