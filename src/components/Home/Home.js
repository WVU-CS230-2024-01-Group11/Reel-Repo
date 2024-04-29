import NavigationBar from "../NavigationBar/NavigationBar";
import { useState, useEffect, useCallback } from "react";
import theMovieDb from "../Utils/themoviedb";
import { useNavigate } from 'react-router-dom';
import  { useUsername } from '../Contexts/UsernameContext';
import { getFriendsTopRatings, fetchFiveMoviesByRating, fetchFiveShowsByRating, totalMovieWatchTime, totalTVWatchTime, totalWatchTime, getCurrentFriends, movieGenreCounts, TVGenreCounts, getWatchLaterMoviesView, getWatchLaterTVView, fetchCharacterIcon} from '../../services/database';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Dropdown } from "react-bootstrap";
import "./Home.css"
import "../NavigationBar/NavigationBar.css";
import avatar1 from '../Profile/Avatars/row-1-column-1.jpg'
import avatar2 from '../Profile/Avatars/row-1-column-2.jpg';
import avatar3 from '../Profile/Avatars/row-1-column-3.jpg';
import avatar4 from '../Profile/Avatars/row-1-column-4.jpg';
import avatar5 from '../Profile/Avatars/row-2-column-1.jpg';
import avatar6 from '../Profile/Avatars/row-2-column-2.jpg';
import avatar7 from '../Profile/Avatars/row-2-column-3.jpg';
import avatar8 from '../Profile/Avatars/row-2-column-4.jpg';
import avatar9 from '../Profile/Avatars/row-3-column-1.jpg';
import avatar10 from '../Profile/Avatars/row-3-column-2.jpg';
import avatar11 from '../Profile/Avatars/row-3-column-3.jpg';
import avatar12 from '../Profile/Avatars/row-3-column-4.jpg';
import defaultAvatar from '../Profile/Avatars/blank-profile-picture-973460_1280.jpg'
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
//Colors for piechart
const colorList = ["Dimgrey", "FloralWhite", "Gainsboro", "LightSlateGrey", "MintCream", "OldLace", "SeaShell", "Silver", "HoneyDew", "WhiteSmoke"];

function Home(props) {
  //Username context
  const { username } = useUsername();
  const [key, setKey] = useState(0);
  //Avatar map 
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
  const responsive = {
    superWide: {
      breakpoint: { max: 5000, min: 3001 },  // Covers screens wider than 3000px
      items: 4,
      slidesToSlide: 1
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4 ,
      slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };

  //Navigation for clicking on cards
  const navigate = useNavigate();

  //Use states for data from database
  const [friendsRatings, setFriendsRatings] = useState([]);
  const [watchTime, setWatchTime] = useState({
    totalMovieWatchTime: [0],
    totalTVWatchTime: [0],
    totalWatchTime: [0],
  });
  const [avatar,setCurrentAvatar]=useState(0);
  const [watchTimeString, setWatchTimeString] = useState([]);
  const [currentFriends, setCurrentFriends] = useState([]);
  const [movieGenreCount, setMovieGenreCount] = useState([]);
  const [showGenreCount, setShowGenreCount] = useState([]);
  const [piechart, setPiechart] = useState([]);
  const [watchLaterMovies, setWatchLaterMovies] = useState([]);
  const [watchLaterTV, setWatchLaterTV] = useState([]);
  const [watchLaterSelectedContent, setWatchLaterSelectedContent] = useState('Movies');
  const [recommendedSelectedContent, setRecommendedSelectedContent] = useState('Movies');
  const [genreSelectedContent, setGenreSelectedContent] = useState('Movie')
  const [movieRecommendations, setMovieRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [topShows, setTopShows] = useState([]);
  //Fetches frinds, friends ratings, watch time, and genre counts when username changes
  useEffect(() => {
    const fetchAvatar = async () => {
      const result = await fetchCharacterIcon(username);
      setCurrentAvatar(avatarMap[result[0].character_icon] || defaultAvatar);
  };
    const fetchData = async () => {
        const ratings = await getFriendsTopRatings(username);
        setFriendsRatings(ratings);
    };
    const fetchUserWatchTime = async () => {
      const data = {
        totalMovieWatchTime: await totalMovieWatchTime(username),
        totalTVWatchTime: await totalTVWatchTime(username),
        totalWatchTime: await totalWatchTime(username),
      };
      setWatchTime(data);
    };
    const fetchFriends = async () => {
      const friends = await getCurrentFriends(username);
      setCurrentFriends(friends);
    };
    const fetchMovieGenres = async () => {
      const genres = await movieGenreCounts(username);
      setMovieGenreCount(genres);
    };
    const fetchShowGenres = async () => {
      const genres = await TVGenreCounts(username);
      setShowGenreCount(genres);
      console.log(genres)
    };
    const fetchWatchLaterMovies = async () => {
      const movieList = await getWatchLaterMoviesView(username);
      setWatchLaterMovies(movieList);
    }
    const fetchWatchLaterTV = async () => {
      const tvList = await getWatchLaterTVView(username);
      setWatchLaterTV(tvList);
    }
   

    //Only fetch from database is username is not empty
    if(username !== ''){
      fetchAvatar();
      fetchData();
      fetchUserWatchTime();
      fetchFriends();
      fetchMovieGenres();
      fetchShowGenres();
      fetchWatchLaterMovies();
      fetchWatchLaterTV();
    }
  }, [username]);

  useEffect(() => {
    const fetchTopMovies = async () => {
      const movies = await fetchFiveMoviesByRating(username);
      setTopMovies(movies);
    };
    const fetchTopShows = async () => {
      const shows = await fetchFiveShowsByRating(username);
      setTopShows(shows);
    };
    if(username !== '') {
      fetchTopMovies();
      fetchTopShows();
    }
  }, [username]);

  useEffect(() => {
    if(topMovies != '' && topShows != ''){
      getMovieRecommendations(topMovies);
      getShowRecommendations(topShows);
    }
  }, [topMovies, topShows]);

  //Creates formatted strings to display watch time when watch time change
  useEffect(() => {
    //Only create string if watchTime has numerical data
    if(watchTime && watchTime.totalWatchTime[0] && !isNaN(watchTime.totalWatchTime[0].total_runtime)){
      var total = watchTime.totalWatchTime[0].total_runtime;
      //Calculate days
      var days = Math.floor(total/1440);
      var daysStr = days;
      //Format grammar
      if(days === 1){
        daysStr += " Day";
      }
      else{
        daysStr += " Days";
      }
      //Calculate hours
      var hours = Math.floor((total-days*1440)/60);
      var hoursStr = hours;
      //Format grammar
      if(hours === 1){
        hoursStr += " Hour";
      }
      else{
        hoursStr += " Hours";
      }
      //Calculate minutes
      var minutes = total-days*1440-hours*60;
      var minutesStr = minutes;
      //Format grammer
      if(minutes === 1){
        minutesStr += " Minute";
      }
      else{
        minutesStr += " Minutes";
      }
      setWatchTimeString([daysStr, hoursStr, minutesStr]);
    }
  }, [watchTime])

  //Creates string for piehchart style when genre count changes
  useEffect(() => {
    //Only create string is movieGenreCount has data
    //media_count
    if(movieGenreCount.length !== 0){
      var genres;
      if(genreSelectedContent == 'Movie'){
        genres = movieGenreCount
        var str = "conic-gradient(";
        var degree = 0;
        var total = 0;
        //Find total genre count
        for(var i=0; i<genres.length && colorList.length; i++){
          total += genres[i].titles_watched;
        }
        //Create style string
        for(var j=0; j<genres.length && colorList.length; j++){
          str += colorList[j] + " " + degree + "deg, ";
          degree += 360*genres[j].titles_watched/total;
          str += colorList[j] + " " + degree + "deg, ";
        }
        str = str.substring(0, str.length-2) + ")";
        document.getElementsByClassName("piechart")[0].style.backgroundImage = str;
      }
      else if(genreSelectedContent == 'TV'){
        genres = showGenreCount
        var str = "conic-gradient(";
        var degree = 0;
        var total = 0;
        //Find total genre count
        for(var i=0; i<genres.length && colorList.length; i++){
          total += genres[i].media_count;
        }
        //Create style string
        for(var j=0; j<genres.length && colorList.length; j++){
          str += colorList[j] + " " + degree + "deg, ";
          degree += 360*genres[j].media_count/total;
          str += colorList[j] + " " + degree + "deg, ";
        }
        str = str.substring(0, str.length-2) + ")";
        document.getElementsByClassName("piechart")[0].style.backgroundImage = str;
        }
    }
  }, [movieGenreCount, showGenreCount, genreSelectedContent]);
  
  useEffect(() => {
    const handleResize = () => {
        // Update the key to force re-render
        setKey(prevKey => prevKey + 1);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
}, []);

  const handleWatchLaterSelect = (eventKey) => {
    setWatchLaterSelectedContent(eventKey);

  }

  const handleRecommendedSelect = (eventKey) => {
    setRecommendedSelectedContent(eventKey);
  }

  const handleGenreSelect = (eventKey) => {
    setGenreSelectedContent(eventKey);
  }

  const getMovieRecommendations = () => {
    let recommended = [];
    const movieIds = topMovies.map(movie => movie.movie_id);
    let completedCalls = 0;

    movieIds.forEach(id => {
      theMovieDb.movies.getRecommendations({"id": id}, successCB, errorCB);
      function successCB(data) {
          const parsedData = JSON.parse(data).results.slice(0, 2);
          completedCalls++;
          recommended = [...recommended, ...parsedData];

          if (completedCalls === movieIds.length) {
            setMovieRecommendations(recommended);
          }
      }

      function errorCB(error) {
          console.error('Error fetching data:', error);
      }
    });
  };
  const getShowRecommendations = () => {
    let recommended = [];
    const showIds = topShows.map(show => show.show_id);
    let completedCalls = 0;

    showIds.forEach(id => {
      theMovieDb.tv.getRecommendations({"id": id}, successCB, errorCB);
      function successCB(data) {
          const parsedData = JSON.parse(data).results.slice(0, 2);
          completedCalls++;
          recommended = [...recommended, ...parsedData];

          if (completedCalls === showIds.length) {
            setShowRecommendations(recommended);
          }
      }

      function errorCB(error) {
          console.error('Error fetching data:', error);
      }
    });
  };

  const particlesInit = useCallback(async engine => {
    console.log(engine);
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    await console.log(container);
  }, []);

  return (
    <>
      <NavigationBar />
      <div>
        </div>
          <div className="content">
            <div className="card-normal card1" onClick={()=>navigate('/profile')}>
              <div className="card-label">Profile</div>
              <div className='card-content'>
                <div id='profile'> <img src={avatar || defaultAvatar} alt='Profile' style={{borderRadius: "50%"}}/> @{username}</div>
                <div id='friend-count'>{currentFriends.length} Friends</div>
              </div>
            </div>
            <div className="card-normal card2" onClick={()=>navigate('/stats')}>
              <div className="card-label">Watch Time</div>
              <div className='card-content' id='watch-time' >
                <div>{watchTimeString[0]}</div>
                <div>{watchTimeString[1]}</div>
                <div>{watchTimeString[2]}</div>
              </div>
            </div>
            <div className="card-big card3" >
            <div className="card-label">Friend Rankings</div>
            <table >
                <thead>
                    <tr>
                    <th style={{backgroundColor: props.accent2}}>Friend</th>
                    <th colSpan="2" style={{backgroundColor: props.accent2}}>Top Movie</th>
                    <th style={{backgroundColor: props.accent2}}>Rating</th>
                    <th colSpan="2" style={{backgroundColor: props.accent2}}>Top TV Show</th>
                    <th style={{backgroundColor: props.accent2}}>Rating</th>
                    </tr>
                </thead>
                <tbody>
                  {friendsRatings.map(friend => (
                    <tr key={friend.friend_username}>
                      <td className="friend-username">{friend.friend_username}</td>
                      <td>
                        {friend.top_movie_poster ? (
                          <img src={`https://image.tmdb.org/t/p/original${friend.top_movie_poster}`} alt={friend.top_movie || 'No Movie'} onClick={() => navigate(`/details/movie/${friend.top_movie_id}`)} />
                        ) : (
                          <span>No Movie</span>
                        )}
                      </td>
                      <td className="movie-name" onClick={() => friend.top_movie_id ? navigate(`/details/movie/${friend.top_movie_id}`) : null}>
                        {friend.top_movie || 'No Movie'}
                      </td>
                      <td className="movie-rating">
                        {friend.movie_rating || 'No Rating'}
                      </td>
                      <td>
                        {friend.top_show_poster ? (
                          <img src={`https://image.tmdb.org/t/p/original${friend.top_show_poster}`} alt={friend.top_show || 'No Show'} onClick={() => navigate(`/details/tv/${friend.top_show_id}`)} />
                        ) : (
                          <span>No Show</span>
                        )}
                      </td>
                      <td className="show-name" onClick={() => friend.top_show_id ? navigate(`/details/tv/${friend.top_show_id}`) : null}>
                        {friend.top_show || 'No Show'}
                      </td>
                      <td className="show-rating">
                        {friend.show_rating || 'No Rating'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
            <div className="card-wide card4">
            <div className="card-label">
              <Dropdown onSelect={handleGenreSelect} >
                  <Dropdown.Toggle id="dropdown-basic">
                      {genreSelectedContent}
                  </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="Movie">Movie</Dropdown.Item>
                      <Dropdown.Item eventKey="TV">TV</Dropdown.Item>
                    </Dropdown.Menu>
              </Dropdown>
              Genres
              </div>
              <div className="card-content card-pie">
              {genreSelectedContent == 'Movie' ? 
                (<>
                <div className="piechart"></div>
                <div className="genre-column">
                  <div><div className="legend" style={(movieGenreCount.length > 0) ? {backgroundColor: colorList[0]} : {backgroundColor: ""}}></div>{(movieGenreCount.length > 0) ? movieGenreCount[0].movieGenre_name : " "}</div>
                  <div><div className="legend" style={(movieGenreCount.length > 1) ? {backgroundColor: colorList[1]} : {backgroundColor: ""}}></div>{(movieGenreCount.length > 1) ? movieGenreCount[1].movieGenre_name : " "}</div>
                  <div><div className="legend" style={(movieGenreCount.length > 2) ? {backgroundColor: colorList[2]} : {backgroundColor: ""}}></div>{(movieGenreCount.length > 2) ? movieGenreCount[2].movieGenre_name : " "}</div>
                  <div><div className="legend" style={(movieGenreCount.length > 3) ? {backgroundColor: colorList[3]} : {backgroundColor: ""}}></div>{(movieGenreCount.length > 3) ? movieGenreCount[3].movieGenre_name : " "}</div>
                  <div><div className="legend" style={(movieGenreCount.length > 4) ? {backgroundColor: colorList[4]} : {backgroundColor: ""}}></div>{(movieGenreCount.length > 4) ? movieGenreCount[4].movieGenre_name : " "}</div>
                </div>
                <div className="genre-column">
                  <div><div className="legend" style={(movieGenreCount.length > 5) ? {backgroundColor: colorList[5]} : {backgroundColor: ""}}></div>{(movieGenreCount.length > 5) ? movieGenreCount[5].movieGenre_name : " "}</div>
                  <div><div className="legend" style={(movieGenreCount.length > 6) ? {backgroundColor: colorList[6]} : {backgroundColor: ""}}></div>{(movieGenreCount.length > 6) ? movieGenreCount[6].movieGenre_name : " "}</div>
                  <div><div className="legend" style={(movieGenreCount.length > 7) ? {backgroundColor: colorList[7]} : {backgroundColor: ""}}></div>{(movieGenreCount.length > 7) ? movieGenreCount[7].movieGenre_name : " "}</div>
                  <div><div className="legend" style={(movieGenreCount.length > 8) ? {backgroundColor: colorList[8]} : {backgroundColor: ""}}></div>{(movieGenreCount.length > 8) ? movieGenreCount[8].movieGenre_name : " "}</div>
                  <div><div className="legend" style={(movieGenreCount.length > 9) ? {backgroundColor: colorList[9]} : {backgroundColor: ""}}></div>{(movieGenreCount.length > 9) ? movieGenreCount[9].movieGenre_name : " "}</div>
                </div>
                </>)
                :
                (
                <>
                <div className="piechart"></div>
                <div className="genre-column">
                  <div><div className="legend" style={(showGenreCount.length > 0) ? {backgroundColor: colorList[0]} : {backgroundColor: ""}}></div>{(showGenreCount.length > 0) ? showGenreCount[0].tvGenre_name : " "}</div>
                  <div><div className="legend" style={(showGenreCount.length > 1) ? {backgroundColor: colorList[1]} : {backgroundColor: ""}}></div>{(showGenreCount.length > 1) ? showGenreCount[1].tvGenre_name : " "}</div>
                  <div><div className="legend" style={(showGenreCount.length > 2) ? {backgroundColor: colorList[2]} : {backgroundColor: ""}}></div>{(showGenreCount.length > 2) ? showGenreCount[2].tvGenre_name : " "}</div>
                  <div><div className="legend" style={(showGenreCount.length > 3) ? {backgroundColor: colorList[3]} : {backgroundColor: ""}}></div>{(showGenreCount.length > 3) ? showGenreCount[3].tvGenre_name : " "}</div>
                  <div><div className="legend" style={(showGenreCount.length > 4) ? {backgroundColor: colorList[4]} : {backgroundColor: ""}}></div>{(showGenreCount.length > 4) ? showGenreCount[4].tvGenre_name : " "}</div>
                </div>
                <div className="genre-column">
                  <div><div className="legend" style={(showGenreCount.length > 5) ? {backgroundColor: colorList[5]} : {backgroundColor: ""}}></div>{(showGenreCount.length > 5) ? showGenreCount[5].tvGenre_name : " "}</div>
                  <div><div className="legend" style={(showGenreCount.length > 6) ? {backgroundColor: colorList[6]} : {backgroundColor: ""}}></div>{(showGenreCount.length > 6) ? showGenreCount[6].tvGenre_name : " "}</div>
                  <div><div className="legend" style={(showGenreCount.length > 7) ? {backgroundColor: colorList[7]} : {backgroundColor: ""}}></div>{(showGenreCount.length > 7) ? showGenreCount[7].tvGenre_name : " "}</div>
                  <div><div className="legend" style={(showGenreCount.length > 8) ? {backgroundColor: colorList[8]} : {backgroundColor: ""}}></div>{(showGenreCount.length > 8) ? showGenreCount[8].tvGenre_name : " "}</div>
                  <div><div className="legend" style={(showGenreCount.length > 9) ? {backgroundColor: colorList[9]} : {backgroundColor: ""}}></div>{(showGenreCount.length > 9) ? showGenreCount[9].tvGenre_name : " "}</div>
                </div>
              </>
                )
              }
              
              </div>
            </div>
            <div className="card-long card5">
              <div className="card-label">Recommended &amp; Suggested
              <Dropdown onSelect={handleRecommendedSelect} >
                  <Dropdown.Toggle id="dropdown-basic">
                      {recommendedSelectedContent}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="Movies">Movies</Dropdown.Item>
                      <Dropdown.Item eventKey="TV">TV</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
              </div>
              <Carousel
                swipeable={false}
                draggable={false}
                showDots={true}
                responsive={responsive}
                ssr={true} // Server-side rendering enabled for SEO
                infinite={true}
                autoPlay={false}
                keyBoardControl={true}
                customTransition="transform 500ms ease-in-out"
                transitionDuration={500}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
                key={key}  // Use key to force re-render
            >
              
                {recommendedSelectedContent === 'Movies' ? (
                  movieRecommendations.map(movie => (
                    <div key={movie.id} className="watchLaterBox" onClick={()=>navigate(`/details/movie/${movie.id}`)}>
                    <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} />
                    <div>{movie.title}</div>
                    </div>
                  ))
                ) : (
                  showRecommendations.map(show => (
                    <div key={show.id} className="watchLaterBox" onClick={()=>navigate(`/details/tv/${show.id}`)}>
                    <img src={`https://image.tmdb.org/t/p/original${show.poster_path}`} />
                    <div>{show.name}</div>
                    </div>
                  ))
                )}
            </Carousel>
            </div>
            <div className="card-long card6" >
              <div className="card-label">Watch Later 
                  <Dropdown onSelect={handleWatchLaterSelect} >
                  <Dropdown.Toggle id="dropdown-basic">
                      {watchLaterSelectedContent}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="Movies">Movies</Dropdown.Item>
                      <Dropdown.Item eventKey="TV">TV</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
              </div>
              <Carousel
                  swipeable={false}
                  draggable={false}
                  showDots={true}
                  responsive={responsive}
                  ssr={true} // Server-side rendering enabled for SEO
                  infinite={true}
                  autoPlay={false}
                  keyBoardControl={true}
                  customTransition="transform 500ms ease-in-out"
                  transitionDuration={500}
                  containerClass="carousel-container"
                  removeArrowOnDeviceType={["tablet", "mobile"]}
                  dotListClass="custom-dot-list-style"
                  itemClass="carousel-item-padding-40-px"
                  key={key}  // Use key to force re-render
              >
                {watchLaterSelectedContent === 'Movies' ? (
                  watchLaterMovies.map(movie => (
                    <div key={movie.movie_id} className="watchLaterBox" onClick={()=>navigate(`/details/movie/${movie.movie_id}`)}>
                    <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} />
                    <div>{movie.movie_name}</div>
                    </div>
                  ))
                ) : (
                  watchLaterTV.map(show => (
                    <div key={show.show_id} className="watchLaterBox" onClick={()=>navigate(`/details/tv/${show.show_id}`)}>
                    <img src={`https://image.tmdb.org/t/p/original${show.poster_path}`} />
                    <div>{show.show_name}</div>
                    </div>
                  ))
                )}
            
            </Carousel>
          </div>
          </div>
          <Particles
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
                        value: props.primary,
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

export default Home;