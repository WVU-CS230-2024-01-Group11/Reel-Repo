// Import necessary React libraries and hooks, database methods, styles, bootstrap components
import React, { useState, useEffect, useCallback } from 'react';
import {fetchParticlesMode, fetchThemeMode, getUserMovieWatchHistory, getUserEpisodeWatchHistory} from '../../services/database';
import NavigationBar from '../NavigationBar/NavigationBar'
import { Tab } from 'react-bootstrap';
import { Tabs, Accordion, Table } from 'react-bootstrap';
import { useUsername } from '../Contexts/UsernameContext';
import styles from './/Repository.css';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

function Repository(props) {
  const { username, setUsername } = useUsername();
  // State for storing movie and episode watch histories
  const [movieHistory, setMovieHistory] = useState(new Map());
  const [episodeHistory, setEpisodeHistory] = useState([]);
  // State for controlling active tab
  const [key, setKey] = useState('movie');

  // Effect hook to fetch data on component mount or when username changes
  useEffect(() => {
    const fetchData = async () => {
      const movies = await getUserMovieWatchHistory(username);
      const episodes = await getUserEpisodeWatchHistory(username);
      const sortedMovies = organizeMoviesByDate(movies);
      const sortedEpisodes = organizeEpisodesByDate(episodes);
      setMovieHistory(sortedMovies);
      setEpisodeHistory(sortedEpisodes);
    };

    fetchData();
}, [username]);

  // Helper object to convert month names to numbers for sorting
  const monthToNumber = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12
  };

 // Function to organize movies by date into a nested Map structure
const organizeMoviesByDate = (movies) => {
  const movieMap = new Map();
  movies.forEach(movie => {
    const date = new Date(movie.date_watched);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    const yearMonthKey = `${year}-${month}`;

    if (!movieMap.has(year)) {
      movieMap.set(year, new Map());
    }

    const monthMap = movieMap.get(year);
    if (!monthMap.has(yearMonthKey)) {
      monthMap.set(yearMonthKey, []);
    }

    monthMap.get(yearMonthKey).push(movie);
  });
  return movieMap;
};

const organizeEpisodesByDate = (episodes) => {
  const episodeMap = new Map();
  episodes.forEach(episode => {
    const date = new Date(episode.date_watched);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    const yearMonthKey = `${year}-${month}`;
    const showName = episode.show_name;

    if (!episodeMap.has(year)) {
      episodeMap.set(year, new Map());
    }

    const monthMap = episodeMap.get(year);
    if (!monthMap.has(yearMonthKey)) {
      monthMap.set(yearMonthKey, new Map());
    }

    const showMap = monthMap.get(yearMonthKey);
    if (!showMap.has(showName)) {
      showMap.set(showName, {
        poster_path: episode.show_poster_path,
        seasons: {}
      });
    }

    const seasonNumber = episode.season_number;
    const showDetails = showMap.get(showName);
    if (!showDetails.seasons[seasonNumber]) {
      showDetails.seasons[seasonNumber] = [];
    }

    showDetails.seasons[seasonNumber].push(episode);
  });
  return episodeMap;
};

const [particlesMode, setParticlesMode] = useState();
const [particlesColor, setParticlesColor] = useState();
const [cardColor, setCardColor] = useState();
    const [themeMode, setThemeMode] = useState();
    useEffect(() => {
        fetchUserSettings();
      }, [username]);
    const fetchUserSettings = async () => {
      const fetchedParticlesMode = await fetchParticlesMode(username);
      const fetchedThemeMode = await fetchThemeMode(username);
      setParticlesMode(fetchedParticlesMode.particles_mode);
      setThemeMode(fetchedThemeMode.theme_mode);
      setParticlesColor('light' === fetchedThemeMode.theme_mode ? props.primary : props.secondary);
      setCardColor('light' === fetchedThemeMode.theme_mode ? props.secondary : props.accent2);
      const element = document.body;
      element.dataset.bsTheme = fetchedThemeMode.theme_mode;
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
      <h1>Repository</h1>
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"
    >
      <Tab eventKey="movie" title="Movies">
      <div className="card-big repositoryCard" style={{backgroundColor: cardColor}}>
        <div className="card-label">Movie Repository</div>
        <Accordion defaultActiveKey="0">
              {Array.from(movieHistory.keys()).sort().reverse().map(year => (
                <Accordion.Item eventKey={year.toString()} key={year}>
                  <Accordion.Header className='outer-header'>{year}</Accordion.Header>
                  <Accordion.Body className='outer-accordian'>
                    {Array.from(movieHistory.get(year).keys()).sort((a, b) => {
                      const monthA = a.split('-')[1];
                      const monthB = b.split('-')[1];
                      return monthToNumber[monthA] - monthToNumber[monthB];
                    }).map(monthYearKey => (
                      <Accordion defaultActiveKey="0" key={monthYearKey}>
                        <Accordion.Item className='outerItem' eventKey={monthYearKey}>
                          <Accordion.Header className='accordianHeader'>{monthYearKey.split('-')[1]}</Accordion.Header>
                          <Accordion.Body className="inner-accordian">
                            <div className='headerContainer'>
                                <div className="posterLabel">Poster</div>
                                <div className="movieLabel">Title</div>
                                <div className="ratingLabel">Your Rating</div>
                                <div className="averageLabel">Average Rating</div>
                                <div className="runtimeLabel">Runtime</div>
                                </div>
                            {movieHistory.get(year).get(monthYearKey).map((movie, index) => (
                              <div key={index} className="grid-container">
                                
                                
                                <div className="grid-item">
                                  <img className='grid-movieImage' src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt="Movie Poster" />
                                </div>
                                <div className="grid-item movieName">{movie.movie_name}</div>
                                <div className="grid-item userRating">{movie.user_rating}</div>
                                <div className="grid-item averageRating">{movie.average_rating}</div>
                                <div className="grid-item runtime">{movie.runtime} min</div>
                              </div>
                            ))}
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          
        </div>
      </Tab>
      <Tab eventKey="TV" title="TV Shows">
  <div className="card-big repositoryCard" style={{backgroundColor: cardColor}}>
    <div className='card-label'>TV Repository</div>
    <Accordion defaultActiveKey="0">
      {Array.from(episodeHistory.keys()).sort().reverse().map(year => (
        <Accordion.Item eventKey={year.toString()} key={year}>
          <Accordion.Header className='outer-header'>{year}</Accordion.Header>
          <Accordion.Body className='outer-accordian'>  
            <Accordion defaultActiveKey="0">
              {Array.from(episodeHistory.get(year).keys()).sort((a, b) => {
                const monthA = a.split('-')[1];
                const monthB = b.split('-')[1];
                return monthToNumber[monthA] - monthToNumber[monthB];
              }).map(monthYearKey => (
                <Accordion.Item eventKey={monthYearKey} key={monthYearKey}>
                  <Accordion.Header>{monthYearKey.split('-')[1]}</Accordion.Header>
                  <Accordion.Body>
                  <div className='headerContainer1'>
                    <div className="episodeLabel">Episode</div>
                    <div className="ratingLabel1">Your Rating</div>
                    <div className="averageLabel1">Average Rating</div>
                    <div className="runtimeLabel1">Runtime</div>
                  </div>
                  {Array.from(episodeHistory.get(year).get(monthYearKey).keys()).map(showName => {
                    const showDetails = episodeHistory.get(year).get(monthYearKey).get(showName);
                    return (
                      <div className='show-details1' key={showName}>
                      <div className='show-poster-and-name'>
                        <img className='tvPoster' src={showDetails.poster_path ? `https://image.tmdb.org/t/p/w200${showDetails.poster_path}` : 'default_poster.jpg'} alt={`${showName} Poster`} />
                        <strong className='showName1'>{showName}</strong>
                      </div>
                      <div className='show-info1'>
                        {Object.keys(showDetails.seasons).map(seasonNumber => (
                          <div className='season-details1' key={seasonNumber}>
                            <strong>Season {seasonNumber}</strong>
                            {showDetails.seasons[seasonNumber].map((episode, episodeIndex) => (
                              <div className="grid-container1" key={episodeIndex}>
                                <div className="grid-item1 episodeDetails">
                                  <img className='grid-stillImage' src={episode.still_path ? `https://image.tmdb.org/t/p/w200${episode.still_path}` : 'default_still.jpg'} alt={`Episode ${episode.episode_number} Still`} />
                                </div>
                                <div className="grid-item1 episodeName">Episode {episode.episode_number}: {episode.episode_name || 'No Episode Name'}</div>
                                <div className="grid-item1 userRating">{episode.user_rating}</div>
                                <div className="grid-item1 averageRating">{episode.average_rating}</div>
                                <div className="grid-item1 runtime">{episode.runtime} min</div>
                              </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  </div>
</Tab>
    </Tabs>
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

export default Repository;