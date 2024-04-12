import React, { useState, useEffect } from 'react';
import {getUserMovieWatchHistory, getUserEpisodeWatchHistory} from '../../services/database';
import NavigationBar from '../NavigationBar/NavigationBar'

function Repository({ currentUser="test" }) {
  const [movieHistory, setMovieHistory] = useState([]);
  const [episodeHistory, setEpisodeHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        const movies = await getUserMovieWatchHistory(currentUser);
        const episodes = await getUserEpisodeWatchHistory(currentUser);
        setMovieHistory(movies);
        setEpisodeHistory(episodes);
    };

    fetchData();
}, [currentUser]);
  return (
    <>
    <NavigationBar />
    <div className='content'>
      
    </div>
  `</>
  );
}

export default Repository;