import React from 'react'
import NavigationBar from '../NavigationBar/NavigationBar'
import { useState, useEffect } from 'react'
import  { useUsername } from '../Contexts/UsernameContext'
import { Carousel, Dropdown } from 'react-bootstrap/'
import Popup from 'reactjs-popup'
import { useLocation, useNavigate } from 'react-router-dom';
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
import { TVByRating, updateCharacterIcon, fetchCharacterIcon, getUserTopRatedMovie,getUserTopRatedTVShow,fetchUserDetails,totalWatchTime, getUserMovieWatchHistory, getAverageMovieRating, getAverageEpisodeRating, totalMovieWatchTime, totalTVWatchTime, getUserEpisodeWatchHistory,fetchFiveMoviesByRating, fetchFiveShowsByRating, checkFriendship, sendFriendRequest, removeFriend } from '../../services/database'
import "./Profile.css";

/**
 * Profile Component
 *
 * Provides a detailed view of a user's profile, displaying watch history, top-rated media, avatar selection,
 * and watch time statistics. Supports friend requests and avatar updates.
 *
 * @returns {JSX.Element} - The JSX structure of the Profile component.
 */
export default function Profile() {
   // Obtain username and setter from the Username context.
  const { username, setUsername } = useUsername();
  // Obtain location
  const location = useLocation();
   // State variables to manage user profile details.
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatar);
  const [currentAvatar, setCurrentAvatar] = useState();
  const [userDetails, setUserDetails] = useState({ firstname: '', lastname: '' });
  const [movieHistory, setMovieHistory] = useState([]);
  const [episodeHistory, setEpisodeHistory] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [topShows, setTopShows] = useState([]);
  const [topEpisodes, setTopEpisodes] = useState([]);
  const [index, setIndex] = useState(0);
  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(0);
  const [index3, setIndex3] = useState(0);
  const [index4, setIndex4] = useState(0);
  const [activeProfile, setActiveProfile] = useState();
  const [friendStatus, setFriendStatus] = useState({isFriends: false });
  const [recentlyWatchedSelect, setRecentlyWatchedSelect] = useState('Movies');
  const [topSelect, setTopSelect] = useState('Movies');
  const [averageEpisodeRating, setAverageEpisodeRating] = useState({ avg_episode_rating: 0});
  const [averageMovieRating, setAverageMovieRating] = useState({ avg_movie_rating: 0 });
  const [watchTime, setWatchTime] = useState({
    totalMovieWatchTime: [0],
    totalTVWatchTime: [0],
    totalWatchTime: [0],
  });
  const [topRated, setTopRated] = useState({
   topRatedMovie: [0],
    topRatedShow: [0],
  });

  /**
     * handleSelect Function
     *
     * Handles selection changes for the carousel of average ratings.
     *
     * @param {int} selectedIndex - The selected index from the carousel.
     * @returns {void}
     */
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  /**
     * handleSelect1 Function
     *
     * Handles selection changes for the watch time carousel.
     *
     * @param {int} selectedIndex1 - The selected index from the carousel.
     * @returns {void}
     */
  const handleSelect1 = (selectedIndex1) => {
    setIndex1(selectedIndex1);
  };
  /**
     * handleSelect2 Function
     *
     * Handles selection changes for the carousel of top-rated media.
     *
     * @param {int} selectedIndex2 - The selected index from the carousel.
     * @returns {void}
     */
  const handleSelect2 = (selectedIndex2) => {
    setIndex2(selectedIndex2);
  };
  /**
     * handleSelect3 Function
     *
     * Handles selection changes for the carousel of recently watched media.
     *
     * @param {int} selectedIndex3 - The selected index from the carousel.
     * @returns {void}
     */
  const handleSelect3 = (selectedIndex3) => {
    setIndex3(selectedIndex3);
  };
  /**
     * handleSelect4 Function
     *
     * Handles selection changes for the carousel of top-five media.
     *
     * @param {int} selectedIndex4 - The selected index from the carousel.
     * @returns {void}
     */
  const handleSelect4 = (selectedIndex4) => {
    setIndex4(selectedIndex4);
  };

  /**
     * handleRecentSelect Function
     *
     * Handles dropdown selections for recently watched media.
     *
     * @param {string} eventKey - The selected dropdown option.
     * @returns {void}
     */
  const handleRecentSelect = (eventKey) => {
    setRecentlyWatchedSelect(eventKey);
  }

  /**
     * handleTopSelect Function
     *
     * Handles dropdown selections for top-five media.
     *
     * @param {string} eventKey - The selected dropdown option.
     * @returns {void}
     */
  const handleTopSelect = (eventKey) => {
    setTopSelect(eventKey);
  }

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

  /**
     * useEffect Hook
     *
     * Updates the active profile from the URL.
     *
     * @returns {void}
     */
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const user = pathParts.pop();
    console.log(user);
    setActiveProfile(user);
  }, [location.pathname]);

  /**
     * useEffect Hook
     *
     * Checks friendship status between the active profile and the current user.
     *
     * @returns {void}
     */
  useEffect(() => {
    if (!activeProfile || !username) return; 
    const checkFriends = async () => {
        const result = await checkFriendship(activeProfile, username);
        setFriendStatus(result);
    };

    if (activeProfile !== username) {
        checkFriends();
    }
}, [activeProfile, username]);

  /**
     * useEffect Hook
     *
     * Loads profile details, including avatar, watch history, ratings, and statistics.
     *
     * @returns {void}
     */
  useEffect(() => {
    const loadCharacterIcon = async () => {
      const result = await fetchCharacterIcon(activeProfile);
      setCurrentAvatar(avatarMap[result[0].character_icon] || defaultAvatar);
        
    };
    const getUserDetails = async () => {
      const details = await fetchUserDetails(activeProfile);
      setUserDetails(details);
    };
    const getMovieHistory = async () => {
      const movies = await getUserMovieWatchHistory(activeProfile);
      setMovieHistory(movies.splice(0,5));
    }
    const getEpisodeHistory = async () => {
      const episodes = await getUserEpisodeWatchHistory(activeProfile);
      setEpisodeHistory(episodes.splice(0,5));
    }
    const getTopMovies = async () => {
      const movies = await fetchFiveMoviesByRating(activeProfile);
      setTopMovies(movies);
    }
    const getTopShows = async () => {
      const episodes = await fetchFiveShowsByRating(activeProfile);
      setTopShows(episodes.splice(0,5));
    }
    const getAverageEpisode = async () => {
      const episodes = await getAverageEpisodeRating(activeProfile);
      setAverageEpisodeRating(episodes);
    }
    const getAverageMovie = async () => {
      const movies = await getAverageMovieRating(activeProfile);
      setAverageMovieRating(movies);
    }
    const fetchUserWatchTime = async () => {
      const data = {
        totalMovieWatchTime: await totalMovieWatchTime(activeProfile),
        totalTVWatchTime: await totalTVWatchTime(activeProfile),
        totalWatchTime: await totalWatchTime(activeProfile),
      };
      setWatchTime(data);
    };
    const fetchUserTopRated = async () => {
      const data = {
        topRatedMovie: await getUserTopRatedMovie(activeProfile),
        topRatedShow: await getUserTopRatedTVShow(activeProfile)
      };
      setTopRated(data);
    };
    const getTopEpisodes = async () => {
      const episodes = await TVByRating(activeProfile);
      setTopEpisodes(episodes.splice(0,5));
    }
    if (activeProfile) {
        loadCharacterIcon();
        getUserDetails();
        getMovieHistory();
        getEpisodeHistory();
        getTopMovies();
        getTopShows();
        getAverageEpisode();
        getAverageMovie();
        fetchUserWatchTime();
        fetchUserTopRated();
        getTopEpisodes();
      
    }
  }, [activeProfile]);

  /**
     * handleAvatarSelect Function
     *
     * Handles avatar selection from a list of available avatars.
     *
     * @param {string} key - The key corresponding to the selected avatar.
     * @returns {void}
     */
  const handleAvatarSelect = (key) => {
    setSelectedAvatar(avatarMap[key]);
};
  /**
     * handleSelection Function
     *
     * Confirms avatar selection, updates it in the database, and applies it to the profile.
     *
     * @returns {void}
     */
  const handleSelection = () => {
    if (selectedAvatar) {
        const avatarKey = Object.keys(avatarMap).find(key => avatarMap[key] === selectedAvatar);
        if (avatarKey) {
            updateCharacterIcon(username, avatarKey).catch(console.error);
            handleConfirmAvatar();
        }
    }
  }
  /**
     * handleConfrimAvatar Function
     *
     * Confirms avatar selection, sets selected avatar to updated one
     *
     * @returns {void}
     */
  const handleConfirmAvatar = async () => {
    try {
        await updateCharacterIcon(username, Object.keys(avatarMap).find(key => avatarMap[key] === selectedAvatar));
        setCurrentAvatar(selectedAvatar);  // Update the avatar shown on the profile
    } catch (error) {
        console.error('Error updating avatar:', error);
    }
  };

  /**
     * handleSendRequest Function
     *
     * Sends a friend request to the target user.
     *
     * @param {string} targetUser - The username of the target user.
     * @returns {void}
     */
  const handleSendRequest = async (targetUser) => {
    await sendFriendRequest(username, targetUser);
    alert('Friend request sent!');
  };

// Rendering of profile content, including navigation, avatars, media statistics, and interactions
return (
  <>
    <NavigationBar />
    <div className='contentProfile'>
      <div className='profileHeader'>
        <img src={currentAvatar} alt="Current Avatar" className='profilePic' />
        <div>
          <h2 className='usernameHandle'>@{activeProfile}</h2>
          <h1 className='userFullName'>{userDetails.firstname} {userDetails.lastname}</h1>
        </div>
        {activeProfile === username ? (
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
        ) : (
          friendStatus.isFriends ? (
            <button className='friendButton' disabled >Already Friends</button>
          ):(
            <button className='friendButton'  onClick={() => handleSendRequest(activeProfile)}>Add Friend</button>
          )
          
        )}
      </div>
      <div className='topRow'>
        <div className='card-normal averagesCard'>
        <div className="card-label1"> Average Ratings</div>
        <Carousel className="averageRatingsCarousel" activeIndex={index} onSelect={handleSelect} interval={null}>
        <Carousel.Item>
            <div className="item-content">
                {averageMovieRating?.avg_movie_rating ?? "n/a"} 
            </div>
            <Carousel.Caption>
                <div className='ratingLabel'>Movies</div>
            </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
            <div className="item-content">
                {averageEpisodeRating?.avg_episode_rating ?? "n/a"} 
            </div>
            <Carousel.Caption>
                <div className='ratingLabel'>Episodes</div>
            </Carousel.Caption>
        </Carousel.Item>
    </Carousel>
       
        </div>
        <div className='card-normal topShowMovie'>
          <div className="card-label1">Top Rated</div>
          <Carousel className="topRatedCarousel" activeIndex={index2} onSelect={handleSelect2} interval={null}>
          <Carousel.Item className="topRatedItem">
              <div className="topRatedGrid">
                  <img className="posterCarousel" src={topRated.topRatedMovie?.[0]?.poster_path ? `https://image.tmdb.org/t/p/original${topRated.topRatedMovie[0].poster_path}` : ""} /> {/* Display poster or nothing */}

                  <div className='media-label'>Movie</div> 
                  <div className="movieName1">
                      {topRated.topRatedMovie?.[0]?.movie_name ?? "n/a"}
                  </div>

                  <div className="movieRating1">
                      {topRated.topRatedMovie?.[0]?.user_rating ?? "n/a"}
                  </div>
              </div>
          </Carousel.Item>

          <Carousel.Item className="topRatedItem">
              <div className="topRatedGrid">
                  <img className="posterCarousel" src={topRated.topRatedShow?.[0]?.poster_path ? `https://image.tmdb.org/t/p/original${topRated.topRatedShow[0].poster_path}` : ""} /> {/* Display poster or nothing */}

                  <div className='media-label'>Show</div> 
                  <div className="showName1">
                      {topRated.topRatedShow?.[0]?.show_name ?? "n/a"} 
                  </div>

                  <div className="showRating1">
                      {topRated.topRatedShow?.[0]?.avg_user_rating ?? "n/a"} 
                  </div>
              </div>
          </Carousel.Item>
    </Carousel>
        </div>
        <div className='card-normal watchTimes'>
          <div className="card-label1">Watch Time</div>
          <Carousel activeIndex={index1} onSelect={handleSelect1} interval={null}>
            <Carousel.Item>
                <div className="item-content">
                    {watchTime?.totalWatchTime[0]?.total_runtime ?? "N/A"} min
                </div>
                <Carousel.Caption>
                    <div className='ratingLabel'>Total</div>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
                <div className="item-content">
                    {watchTime?.totalMovieWatchTime[0]?.total_watch_time ?? "N/A"} min
                </div>
                <Carousel.Caption>
                    <div className='ratingLabel'>Movies</div>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
                <div className="item-content">
                    {watchTime?.totalTVWatchTime[0]?.total_watch_time ?? "N/A"} min
                </div>
                <Carousel.Caption>
                    <div className='ratingLabel'>TV</div>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
        </div>
        
      </div>
      <div className='secondRow'>
        <div className='card-big recentlyWatched'>
          <div className='card-label1'>Recently Watched
          <Dropdown className='dropdown1' onSelect={handleRecentSelect} >
                  <Dropdown.Toggle id="dropdown-basic">
                      {recentlyWatchedSelect}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="Movies">Movies</Dropdown.Item>
                      <Dropdown.Item eventKey="TV">TV</Dropdown.Item>
                    </Dropdown.Menu>
            </Dropdown>
            </div>
         
          <div className='recentlyWatchedEpisodes'>
          <Carousel activeIndex={index3} onSelect={handleSelect3} interval={null}>
                {recentlyWatchedSelect === 'Movies' ? (
                    movieHistory.map((movie, idx) => (
                        <Carousel.Item className='movieCard' key={idx}>
                            <div className='recentlyWatched-moviegrid'>
                                <img className="moviePosterRecent" src={`https://image.tmdb.org/t/p/original${movie.poster_path ?? ""}`} />
                                <div className='movieNameRecent'>{movie.movie_name ?? "N/A"}</div>
                                <div className='runtimeRecent'>{movie.runtime ?? "N/A"} min</div>
                                <div className='userRateRecentMovie'>{movie.user_rating ?? "N/A"}</div>
                            </div>
                        </Carousel.Item>
                    ))
                ) : (
                    episodeHistory.map((episode, idx) => (
                        <Carousel.Item className='episodeCard' key={idx}>
                            <div className='recentlyWatched-tvgrid'>
                                <img class="episodeStillRecent" src={`https://image.tmdb.org/t/p/original${episode.still_path ?? ""}`} />
                                <div class="showNameRecent">{episode.show_name ?? "N/A"}</div>
                                <div class="seasonRecent">Season {episode.season_number ?? "N/A"}</div>
                                <div class="episodeRecent">Episode {episode.episode_number ?? "N/A"}</div>
                                <div class="runtimeRecentTV">{episode.runtime ?? "N/A"} min</div>
                                <div class="userRateRecentTV">{episode.user_rating ?? "N/A"}</div>
                            </div>
                        </Carousel.Item>
                    ))
                )}
            </Carousel>
       </div>
        </div>
        <div className='card-big topFive'>
          <div className='card-label1'>Top Five 
          <Dropdown className='dropdown1' onSelect={handleTopSelect} >
                  <Dropdown.Toggle id="dropdown-basic">
                      {topSelect}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="Movies">Movies</Dropdown.Item>
                      <Dropdown.Item eventKey="Shows">Shows</Dropdown.Item>
                      <Dropdown.Item eventKey="Episodes">Episodes</Dropdown.Item>
                    </Dropdown.Menu>
            </Dropdown></div>
            <Carousel activeIndex={index4} onSelect={handleSelect4} interval={null}>
            {topSelect === 'Movies' ? (
                topMovies.map((movie, idx) => (
                    <Carousel.Item className='movieCard' key={idx}>
                        <div className='top-moviegrid'>
                            <div className="movieIndex">{idx + 1}</div>
                            <img className="moviePosterTop" src={`https://image.tmdb.org/t/p/original${movie.poster_path ?? ""}`} />
                            <div className='movieNameTop'>{movie.movie_name ?? "N/A"}</div>
                            <div className='userRateTopMovie'>{movie.highest_user_rating ?? "N/A"}</div>
                        </div>
                    </Carousel.Item>
                ))
            ) : (topSelect === 'Episodes' ? (
                topEpisodes.map((episode, idx1) => (
                    <Carousel.Item className='episodeCard' key={idx1}>
                        <div className='top-Epgrid'>
                            <div class="episodeIndex">{idx1 + 1}</div>
                            <img class="episodeStillTop" src={`https://image.tmdb.org/t/p/original${episode.still_path ?? ""}`} />
                            <div class="showNameEpTop">{episode.show_name ?? "N/A"}</div>
                            <div class="seasonTop">Season {episode.season_number ?? "N/A"}</div>
                            <div class="episodeTop">Episode {episode.episode_number ?? "N/A"}</div>
                            <div class="userRateTopEp">{episode.highest_user_rating ?? "N/A"}</div>
                        </div>
                    </Carousel.Item>
                ))
            ) : (
                topShows.map((show, idx2) => (
                    <Carousel.Item className='showCard' key={idx2}>
                        <div className='top-showgrid'>
                            <div class="showIndex">{idx2 + 1}</div>
                            <img class="showStillTop" src={`https://image.tmdb.org/t/p/original${show.poster_path ?? ""}`} />
                            <div class="showNameTop">{show.show_name ?? "N/A"}</div>
                            <div class="userRateTopTV">{show.avg_user_rating ?? "N/A"}</div>
                        </div>
                    </Carousel.Item>
                ))
            ))}
        </Carousel>
        </div>
      </div>
    </div>
  </>
);
}