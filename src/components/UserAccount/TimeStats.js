import React, { useState, useEffect, useContext } from 'react';
import { totalMovieWatchTime,totalWatchTimeMonth,totalWatchTimeYear,totalTVWatchTime, totalWatchTime} from '../../services/database';
import './TimeStats.css';
import  { useUsername} from '../Contexts/UsernameContext';


function TimeStats() {
  const { username } = useUsername();
  const [stats, setStats] = useState({
    totalMovieWatchTime: [0],
    totalWatchTimeMonth: [0],
    totalWatchTimeYear: [0],
    totalTVWatchTime: [0],
    totalWatchTime: [0],
    
  });
  useEffect(() => {
    fetchUserStats();
  }, [username]);
  const fetchUserStats = async () => {
    
  
    const data = {
      totalMovieWatchTime: await totalMovieWatchTime(username),
      totalWatchTimeMonth: await totalWatchTimeMonth(username),
      totalWatchTimeYear: await totalWatchTimeYear(username),
      totalTVWatchTime: await totalTVWatchTime(username),
      totalWatchTime: await totalWatchTime(username),
    };
    console.log('Stats:', data); 
    setStats(data);
  };



  return (
    <div className="UserStatistics">
      <h2>Time {username} Spent Watching</h2>
      <div className="Stat">
        <div className="stat-row">
          <div className="stat-item">
            <p className="stat-title">Total Watch Time:</p>
            <p className="stat-data">{stats.totalWatchTime[0].total_runtime} min</p>
          </div>
          <div className="stat-item">
            <p className="stat-title">Watch Time This Year:</p>
            <p className="stat-data">{stats.totalWatchTimeYear[0].total_runtime} min</p>
          </div>
          <div className="stat-item">
            <p className="stat-title">Watch Time This Month:</p>
            <p className="stat-data">{stats.totalWatchTimeMonth[0].total_runtime} min</p>
          </div>
        </div>
        <div className="stat-row">
          <div className="stat-item">
            <p className="stat-title">Time Spent Watching Movies:</p>
            <p className="stat-data">{stats.totalMovieWatchTime[0].total_watch_time} min</p>
          </div>
          <div className="stat-item">
            <p className="stat-title">Time Spent Watching TV:</p>
            <p className="stat-data">{stats.totalTVWatchTime[0].total_watch_time} min</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  
  }  

export default TimeStats;