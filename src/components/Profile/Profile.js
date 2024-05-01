import React from 'react'
import NavigationBar from '../NavigationBar/NavigationBar'
import { useState, useEffect, useCallback } from 'react'
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
import { fetchThemeMode, fetchParticlesMode, updateCharacterIcon, fetchCharacterIcon, fetchUserDetails, getUserMovieWatchHistory, getUserEpisodeWatchHistory,fetchFiveMoviesByRating, fetchFiveShowsByRating } from '../../services/database'
import styles from './/Profile.css'
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function Profile(props) {
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

const [particlesMode, setParticlesMode] = useState();
    const [themeMode, setThemeMode] = useState();
    const [particlesColor, setParticlesColor] = useState();
    useEffect(() => {
        fetchUserSettings();
        console.log("Particles: "+particlesMode)
      }, [username]);
    const fetchUserSettings = async () => {
      const fetchUserSettings = async () => {
        const fetchedParticlesMode = await fetchParticlesMode(username);
        const fetchedThemeMode = await fetchThemeMode(username);
        setParticlesMode(fetchedParticlesMode.particles_mode);
        setThemeMode(fetchedThemeMode.theme_mode);
        setParticlesColor('light' === fetchedThemeMode.theme_mode ? props.primary : props.secondary);
        const element = document.body;
        element.dataset.bsTheme = fetchedThemeMode.theme_mode;
        
    }
    }

const particlesInit = useCallback(async engine => {
  await loadSlim(engine);
}, []);

const particlesLoaded = useCallback(async container => {
  await console.log(container);
}, []);

return (
  <>
    <NavigationBar />
    <div className='content'>
      <div className='profileHeader' style={{opacity: "0.97"}}>
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
            <div className='movieCard' style={{opacity: "0.97"}}>{movie.movie_name}</div>
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
    <Particles style={{display: particlesMode === 1 ? "" : "none"}}
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                fullScreen: {
                    enable: true,
                    zIndex: -1
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: {
                            enable: false,
                            mode: "push",
                        },
                        onHover: {
                            enable: false,
                            mode: "repulse",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: particlesColor,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 8,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 4000,
                        },
                        value: 80,
                    },
                    opacity: {
                        value: 1,
                    },
                    shape: {
                        type: "square",
                    },
                    size: {
                        value: { min: 10, max: 20 },
                    },
                },
                detectRetina: true,
            }}
          />
  </>
);
}