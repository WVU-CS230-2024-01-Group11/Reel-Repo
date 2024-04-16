// Import necessary React libraries and hooks, database methods, styles, bootstrap components
import React, { useState, useEffect } from 'react';
import {getUserMovieWatchHistory, getUserEpisodeWatchHistory} from '../../services/database';
import NavigationBar from '../NavigationBar/NavigationBar'
import styles from './/Repository.css';
import { Tab } from 'react-bootstrap';
import { Tabs, Accordion, Table } from 'react-bootstrap';
import { useUsername } from '../Contexts/UsernameContext';

function Repository() {
  const { username, setUsername } = useUsername();
  // State for storing movie and episode watch histories
  const [movieHistory, setMovieHistory] = useState(new Map());
  const [episodeHistory, setEpisodeHistory] = useState([]);
  // State for controlling active tab
  const [key, setKey] = useState('movie');

  // Effect hook to fetch data on component mount or when username changes
  useEffect(() => {
    const fetchData = async () => {
        // Fetch movie and episode watch history for the current user
        const movies = await getUserMovieWatchHistory(username);
        const episodes = await getUserEpisodeWatchHistory(username);
        // Organize movies by date for better structure
        const sortedMovies = organizeMoviesByDate(movies);
        setMovieHistory(sortedMovies)
        setEpisodeHistory(episodes);
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


  return (
    <>
    <NavigationBar />
    <div className='content'>
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"
    >
      <Tab eventKey="movie" title="Movies">
      <div className="card-big repositoryCard">
        <div className="card-label">Movie Repository</div>
        <Accordion defaultActiveKey="0">
              {Array.from(movieHistory.keys()).sort().reverse().map(year => (
                <Accordion.Item eventKey={year.toString()} key={year}>
                  <Accordion.Header>{year}</Accordion.Header>
                  <Accordion.Body>
                    {Array.from(movieHistory.get(year).keys()).sort((a, b) => {
                      const monthA = a.split('-')[1];
                      const monthB = b.split('-')[1];
                      return monthToNumber[monthA] - monthToNumber[monthB];
                    }).map(monthYearKey => (
                      <Accordion defaultActiveKey="0" key={monthYearKey}>
                        <Accordion.Item eventKey={monthYearKey}>
                          <Accordion.Header>{monthYearKey.split('-')[1]}</Accordion.Header>
                          <Accordion.Body>
                            <table className='movieTable'>
                              <thead className='tableHeaders'>
                                <tr className='tableTr'>
                                  <th colSpan={2} className='movieHeader'>Movie</th>
                                  <th>Your Rating</th>
                                  <th>Average Rating</th>
                                  <th>Runtime</th>
                                </tr>
                              </thead>
                              <tbody className='movieTableBody'>
                                {movieHistory.get(year).get(monthYearKey).map(movie => (
                                  <tr key={movie.movie_id}>
                                    <td><img className='movieImage'src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}></img></td>
                                    <td className='movieName'>{movie.movie_name}</td>
                                    <td className='userRating'>{movie.user_rating}</td>
                                    <td className='averageRating'>{movie.average_rating}</td>
                                    <td className='runtime'>{movie.runtime} min</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
      <div className="card-big repositoryCard">
        <div className="card-label">TV Repository</div>
      </div>
      </Tab>
    </Tabs>
    </div>
  `</>
  );
}

export default Repository;