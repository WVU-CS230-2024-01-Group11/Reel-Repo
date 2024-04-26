import React from 'react'
import NavigationBar from '../NavigationBar/NavigationBar'
import { useState, useEffect } from 'react'
import  { useUsername } from '../Contexts/UsernameContext'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css';
import avatar1 from './Avatars/row-1-column-1.jpg';
import avatar2 from './Avatars/row-1-column-2.jpg';
import avatar3 from './Avatars/row-1-column-3.jpg';
import avatar4 from './Avatars/row-1-column-4.jpg';
import avatar5 from './Avatars/row-2-column-1.jpg';
import avatar6 from './Avatars/row-2-column-2.jpg';
import avatar7 from './Avatars/row-2-column-3.jpg';
import avatar8 from './Avatars/row-2-column-4.jpg';
import avatar9 from './Avatars/row-3-column-1.jpg';
import avatar10 from './Avatars/row-3-column-2.jpg';
import avatar11 from './Avatars/row-3-column-3.jpg';
import avatar12 from './Avatars/row-3-column-4.jpg';
import defaultAvatar from './Avatars/blank-profile-picture-973460_1280.jpg'
import { updateCharacterIcon, fetchCharacterIcon, fetchUserDetails, getUserMovieWatchHistory, getUserEpisodeWatchHistory,fetchFiveMoviesByRating, fetchFiveShowsByRating } from '../../services/database'
import styles from './/Profile.css'

export default function Profile() {
  const { username, setUsername } = useUsername();
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatar);
  const [currentAvatar, setCurrentAvatar] = useState();
  const [userDetails, setUserDetails] = useState({ firstname: '', lastname: '' });
  const [movieHistory, setMovieHistory] = useState([]);
  const [episodeHistory, setEpisodeHistory] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [topEpisodes, setTopEpisodes] = useState([]);

  const avatarMap = {
    defaultAvatar: defaultAvatar,
    avatar1: avatar1,
    avatar2: avatar2,
    avatar3: avatar3,
    avatar4: avatar4,
    avatar5: avatar5,
    avatar6: avatar6,
    avatar7: avatar7,
    avatar8: avatar8,
    avatar9: avatar9,
    avatar10: avatar10,
    avatar11: avatar11,
    avatar12: avatar12
  };
  
  useEffect(() => {
    const loadCharacterIcon = async () => {
      const result = await fetchCharacterIcon(username);
      setCurrentAvatar(avatarMap[result[0].character_icon] || defaultAvatar);
        
    };
    const getUserDetails = async () => {
      const details = await fetchUserDetails(username);
      setUserDetails(details);
    };
    const getMovieHistory = async () => {
      const movies = await getUserMovieWatchHistory(username);
      setMovieHistory(movies.splice(0,5));
    }
    const getEpisodeHistory = async () => {
      const episodes = await getUserEpisodeWatchHistory(username);
      setEpisodeHistory(episodes.splice(0,5));
    }
    const getTopMovies = async () => {
      const movies = await fetchFiveMoviesByRating(username);
      setTopMovies(movies);
    }
    const getTopEpisodes = async () => {
      const episodes = await fetchFiveShowsByRating(username);
      setTopEpisodes(episodes.splice(0,5));
    }
    if (username) {
        loadCharacterIcon();
        getUserDetails();
        getMovieHistory();
        getEpisodeHistory();
        getTopMovies();
        getTopEpisodes();
    }
  }, [username]);
  
  const handleAvatarSelect = (key) => {
    console.log('Selected avatar:', key);
    setSelectedAvatar(avatarMap[key]);
};
const handleSelection = () => {
  if (selectedAvatar) {
      const avatarKey = Object.keys(avatarMap).find(key => avatarMap[key] === selectedAvatar);
      if (avatarKey) {
          updateCharacterIcon(username, avatarKey).catch(console.error);
          handleConfirmAvatar();
      }
  }
}
const handleConfirmAvatar = async () => {
  try {
      // Assume updateCharacterIcon sends the selected avatar key and updates the database
      await updateCharacterIcon(username, Object.keys(avatarMap).find(key => avatarMap[key] === selectedAvatar));
      setCurrentAvatar(selectedAvatar);  // Update the avatar shown on the profile
  } catch (error) {
      console.error('Error updating avatar:', error);
  }
};
return (
  <>
    <NavigationBar />
    <div className='contentProfile'>
      <div className='profileHeader'>
        <img src={currentAvatar} alt="Current Avatar" className='profilePic' />
        <div>
          <h2 className='usernameHandle'>@{username}</h2>
          <h1 className='userFullName'>{userDetails.firstname} {userDetails.lastname}</h1>
        </div>
        <Popup trigger={<button className='avatarBtn'>Choose Avatar</button>} modal nested>
          <div className='avatarSelection'>
            {Object.entries(avatarMap).map(([key, image]) => (
              <button key={key} onClick={() => handleAvatarSelect(key)}>
                <img src={image} alt={`Avatar ${key}`} className='avatarImage' />
              </button>
            ))}
            <button onClick={handleSelection}>Confirm Selection</button>
          </div>
        </Popup>
      </div>
      <div className='dataSection'>
        <div className='recentlyWatchedMovies'>
          <h3>Recently Watched Movies</h3>
          {movieHistory.map(movie => (
            <div className='movieCard'>{movie.movie_name}</div>
          ))}
        </div>
        <div className='recentlyWatchedEpisodes'>
          <h3>Recently Watched Episodes</h3>
          {episodeHistory.map(episode => (
            <div className='episodeCard'>{episode.show_name}: Season {episode.season_number}, {episode.episode_name}</div>
          ))}
        </div>
        <div className='topMovies'>
          <h3>Top Movies</h3>
          {topMovies.map(movie => (
            <div className='movieCard'>{movie.movie_name}</div>
          ))}
        </div>
        <div className='topShows'>
          <h3>Top Shows</h3>
          {topEpisodes.map(show => (
            <div className='showCard'>{show.show_name}</div>
          ))}
        </div>
      </div>
    </div>
  </>
);
}