import React, { useState, useEffect, useCallback } from 'react';
import { fetchParticlesMode, fetchThemeMode, totalMovieWatchTime,movieGenreCounts, TVGenreCounts, allWatchedEpisodes, TVWatchedMonth, TVWatchedYear, TVByRating, allWatchedMovies, moviesWatchedMonth, moviesByRating, moviesWatchedYear, getUserTopRatedMovie, getUserTopRatedTVShow, totalWatchTimeMonth, totalWatchTimeYear, totalTVWatchTime, totalWatchTime} from '../../services/database';
import './UserStatistics.css'
import NavigationBar from '../NavigationBar/NavigationBar';
import { Nav } from 'react-bootstrap';
import { Tab, Tabs } from 'react-bootstrap';
import { useUsername } from '../Contexts/UsernameContext';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

function UserStatistics(props) {
  const { username, setUsername } = useUsername();
  const [key, setKey] = useState('time');
  const [stats, setStats] = useState({
    getUserTopRatedMovie: [0],
    getUserTopRatedTVShow: [0],
    movieGenreCount: [],
    allWatchedMovies: [],
    moviesWatchedMonth: [],
    moviesWatchedYear: [],
    moviesByRating: [],
    totalMovieWatchTime: [0],
    totalWatchTimeMonth: [0],
    totalWatchTimeYear: [0],
    totalTVWatchTime: [0],
    totalWatchTime: [0],
    TVGenreCount: [],
    allWatchedEpisodes: [],
    TVWatchedMonth: [],
    TVWatchedYear: [],
    TVByRating: [],
  });
  useEffect(() => {
    fetchUserStats();
  }, []);
  const fetchUserStats = async () => {
    
  
    const data = {
      totalMovieWatchTime: await totalMovieWatchTime(username),
      totalWatchTimeMonth: await totalWatchTimeMonth(username),
      totalWatchTimeYear: await totalWatchTimeYear(username),
      totalTVWatchTime: await totalTVWatchTime(username),
      totalWatchTime: await totalWatchTime(username),
      getUserTopRatedMovie: await getUserTopRatedMovie(username),
      getUserTopRatedTVShow: await getUserTopRatedTVShow(username),
      movieGenreCount: await movieGenreCounts(username),
      allWatchedMovies: await allWatchedMovies(username),
      moviesWatchedMonth: await moviesWatchedMonth(username),
      moviesWatchedYear: await moviesWatchedYear(username),
      moviesByRating: await moviesByRating(username),
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


  const organizedMonthData = stats.TVWatchedMonth.reduce((acc, episode) => {
    const { show_name, season_number, poster_path } = episode;
  
    if (!acc[show_name]) {
      acc[show_name] = {
        poster_path, 
        seasons: {}
      };
    }
  
    if (!acc[show_name].seasons[season_number]) {
      acc[show_name].seasons[season_number] = [];
    }
  
    acc[show_name].seasons[season_number].push(episode);
    return acc;
  }, {});

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
  
  <div className="UserStatistics">
    <NavigationBar />
    <div className="content">
      <h1>Statistics</h1>
  <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"
    >
  <Tab eventKey="time" title="Both">
  <h2 style={{marginBottom: "50px"}}>Time Spent Watching</h2>
    <div className="Stat">
    <div className="stat-row">
      <div className="stat-item" style={{backgroundColor: cardColor, opacity: "0.97"}}>
        <p className="stat-title">Total Watch Time:</p>
        <p className="stat-data">{stats.totalWatchTime[0] ? stats.totalWatchTime[0].total_runtime : 0} min</p>
      </div>
      <div className="stat-item" style={{backgroundColor: cardColor, opacity: "0.97"}}>
        <p className="stat-title">Total Watch Time This Year:</p>
        <p className="stat-data">{stats.totalWatchTimeYear[0] ? stats.totalWatchTimeYear[0].total_runtime : 0} min</p>
      </div>
      <div className="stat-item" style={{backgroundColor: cardColor, opacity: "0.97"}}>
        <p className="stat-title">Total Watch Time This Month:</p>
        <p className="stat-data">{stats.totalWatchTimeMonth[0] ? stats.totalWatchTimeMonth[0].total_runtime : 0} min</p>
      </div>
    </div>
    <div className="stat-row">
      <div className="stat-item" style={{backgroundColor: cardColor, opacity: "0.97"}}>
        <p className="stat-title">Movie Watch Time:</p>
        <p className="stat-data">{stats.totalMovieWatchTime[0] ? stats.totalMovieWatchTime[0].total_watch_time : 0} min</p>
      </div>
      <div className="stat-item" style={{backgroundColor: cardColor, opacity: "0.97"}}>
        <p className="stat-title">TV Watch Time:</p>
        <p className="stat-data">{stats.totalTVWatchTime[0] ? stats.totalTVWatchTime[0].total_watch_time : 0} min</p>
      </div>
    </div>
  </div>
  </Tab>
  <Tab eventKey="movies" title="Movies">
  <h2>Top Movie</h2>
  <div className='movie-container'>
    <img src={stats.getUserTopRatedMovie[0] && stats.getUserTopRatedMovie[0].poster_path ? `https://image.tmdb.org/t/p/w200${stats.getUserTopRatedMovie[0].poster_path}` : 'default_poster.jpg'} alt="Top Movie Poster"/>
    <div>
      <div className='topMovieName'>{stats.getUserTopRatedMovie[0] ? stats.getUserTopRatedMovie[0].movie_name : 'No Movies Yet'}</div>
      <div className='topMovieRating'>Your Rating: {stats.getUserTopRatedMovie[0] ? stats.getUserTopRatedMovie[0].user_rating : 'No Rating'}</div>
    </div>
  </div>
  <p>Movie Genre Count:</p>
  <div className='genre-container'>
    {stats.movieGenreCount && stats.movieGenreCount.length > 0 ? stats.movieGenreCount.map((genre, index) => (
      <div className='genre-box' key={index} style={{backgroundColor: cardColor}}>
        {genre.movieGenre_name}: {genre.titles_watched}
      </div>
    )) : <p>No Genre Data Available</p>}
  </div>
  <p>Movies watched this month:</p>
  <div className='monthly-movies'>
    {stats.moviesWatchedMonth && stats.moviesWatchedMonth.length > 0 ? stats.moviesWatchedMonth.map((movie, index) => (
      <div className='stat-movie-box' key={index}>
        <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'default_poster.jpg'} alt={movie.movie_name}/>
        <div>{movie.movie_name || 'Unknown Movie'}</div>
      </div>
    )) : <p>No Movies Watched This Month</p>}
  </div>
</Tab>

<Tab eventKey="tv" title="TV">
  <h2>Top Show</h2>
  <div className='show-container'>
    <img src={stats.getUserTopRatedTVShow[0] && stats.getUserTopRatedTVShow[0].poster_path ? `https://image.tmdb.org/t/p/w200${stats.getUserTopRatedTVShow[0].poster_path}` : 'default_poster.jpg'} alt="Top Show Poster"/>
    <div>
      <div className='topMovieName'>{stats.getUserTopRatedTVShow[0] ? stats.getUserTopRatedTVShow[0].show_name : 'No Top Show Yet'}</div>
      <div className='topMovieRating'>Your Rating: {stats.getUserTopRatedTVShow[0] ? stats.getUserTopRatedTVShow[0].avg_user_rating : 'No Rating'}</div>
    </div>
  </div>
  <p>TV Genre Count:</p>
  <div className='genre-container'>
    {stats.TVGenreCount && stats.TVGenreCount.length > 0 ? stats.TVGenreCount.map((genre, index) => (
      <div className='genre-box' key={index} style={{backgroundColor: cardColor}}>
        {genre.tvGenre_name}: {genre.media_count}
      </div>
    )) : <p>No TV Genre Data Available</p>}
  </div>

  <p>Episodes watched this month:</p>
  <div className='shows-container'>
    {organizedMonthData && Object.keys(organizedMonthData).length > 0 ? Object.keys(organizedMonthData).map((showName, index) => {
      const show = organizedMonthData[showName];
      return (
        <div className='show-details' key={index}>
          <img src={show.poster_path ? `https://image.tmdb.org/t/p/w200${show.poster_path}` : 'default_poster.jpg'} alt={`${showName} Poster`} />
          <div className='show-info'>
            <strong>{showName}</strong>
            {show.seasons && Object.keys(show.seasons).map((seasonNumber) => (
              <div className='season-details' key={seasonNumber}>
                <strong>Season {seasonNumber}</strong>
                {show.seasons[seasonNumber] && show.seasons[seasonNumber].map((episode, episodeIndex) => (
                  <div className='episode-details' key={episodeIndex}>
                    <img src={episode.still_path ? `https://image.tmdb.org/t/p/w200${episode.still_path}` : 'default_still.jpg'} alt={`Episode ${episode.episode_number} Still`} />
                    <span>Episode {episode.episode_number}: {episode.episode_name || 'No Episodes'}</span>
                    
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }) : <p>No Episodes Watched This Month</p>}
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
</div>
  );
}

export default UserStatistics;