import "./Home.css"
import NavigationBar from "../NavigationBar/NavigationBar";
import { useState, useEffect } from "react";
import { getFriendsTopRatings } from "../../services/database";
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import  { useUsername } from '../Contexts/UsernameContext';
import { totalMovieWatchTime, totalTVWatchTime, totalWatchTime, getCurrentFriends, movieGenreCounts, getWatchLaterMoviesView, getWatchLaterTVView} from '../../services/database';
import profile_placeholder from "./profile_placeholder.png"
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

//Colors for piechart
const colorList = ["Dimgrey", "FloralWhite", "Gainsboro", "LightSlateGrey", "MintCream", "OldLace", "SeaShell", "Silver", "HoneyDew", "WhiteSmoke"];

function Home() {
  //Username context
  const { username, setUsername } = useUsername();
  //setUsername("test");

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
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
  const [watchTimeString, setWatchTimeString] = useState([]);
  const [currentFriends, setCurrentFriends] = useState([]);
  const [genreCount, setGenreCount] = useState([]);
  const [watchLaterMovies, setWatchLaterMovies] = useState([]);
  const [watchLaterTV, setWatchLaterTV] = useState([]);
  //Fetches frinds, friends ratings, watch time, and genre counts when username changes
  useEffect(() => {
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
    const fetchGenres = async () => {
      const genres = await movieGenreCounts(username);
      setGenreCount(genres);
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
      fetchData();
      fetchUserWatchTime();
      fetchFriends();
      fetchGenres();
      fetchWatchLaterMovies();
    }
  }, [username]);

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
    //Only create string is genreCount has data
    if(genreCount.length !== 0){
      var str = "conic-gradient(";
      var degree = 0;
      var total = 0;
      //Find total genre count
      for(var i=0; i<genreCount.length && colorList.length; i++){
        total += genreCount[i].titles_watched;
      }
      //Create style string
      for(var j=0; j<genreCount.length && colorList.length; j++){
        str += colorList[j] + " " + degree + "deg, ";
        degree += 360*genreCount[j].titles_watched/total;
        str += colorList[j] + " " + degree + "deg, ";
      }
      str = str.substring(0, str.length-2) + ")";
      document.getElementsByClassName("piechart")[0].style.backgroundImage = str;
    }
  }, [genreCount]);
  
  return (
    <>
      <NavigationBar/>
      <div>
        </div>
          <div className="content">
            <div className="card-normal card1" onClick={()=>navigate('/profile')}>
              <div className="card-label">Profile</div>
              <div className='card-content'>
                <div id='profile'> <img src={profile_placeholder} alt='Profile'/> {username}</div>
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
            <table>
                <thead>
                    <tr>
                    <th>Friend</th>
                    <th colSpan="2">Top Movie</th>
                    <th>Rating</th>
                    <th colSpan="2">Top TV Show</th>
                    <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {friendsRatings.map(friend => (
                        <tr key={friend.friend_username}>
                            <td className="friend-username" >{friend.friend_username}</td>
                            <td><img src={`https://image.tmdb.org/t/p/w200${friend.top_movie_poster}`} alt={friend.top_movie} onClick={()=>navigate(`/details/movie/${friend.top_movie_id}`)} /></td>
                            <td className="movie-name" onClick={()=>navigate(`/details/movie/${friend.top_movie_id}`)}>{friend.top_movie}</td>
                            <td className="movie-rating">{friend.movie_rating}</td>
                            <td><img src={`https://image.tmdb.org/t/p/w200${friend.top_show_poster}`} alt={friend.top_show} onClick={()=>navigate(`/details/tv/${friend.top_show_id}`)}/></td>
                            <td className="show-name" onClick={()=>navigate(`/details/tv/${friend.top_show_id}`)}>{friend.top_show}</td>
                            <td className="show-rating" >{friend.show_rating}</td>
                        </tr>
                    ))}
                </tbody>
              </table>
          </div>
            <div className="card-wide card4" onClick={()=>navigate('/repository')}>
              <div className="card-label">Movie Genres</div>
              <div className="card-content card-pie">
              <div className="piechart"></div>
                <div className="genre-column">
                  <div><div className="legend" style={(genreCount.length > 0) ? {backgroundColor: colorList[0]} : {backgroundColor: ""}}></div>{(genreCount.length > 0) ? genreCount[0].movieGenre_name : " "}</div>
                  <div><div className="legend" style={(genreCount.length > 1) ? {backgroundColor: colorList[1]} : {backgroundColor: ""}}></div>{(genreCount.length > 1) ? genreCount[1].movieGenre_name : " "}</div>
                  <div><div className="legend" style={(genreCount.length > 2) ? {backgroundColor: colorList[2]} : {backgroundColor: ""}}></div>{(genreCount.length > 2) ? genreCount[2].movieGenre_name : " "}</div>
                  <div><div className="legend" style={(genreCount.length > 3) ? {backgroundColor: colorList[3]} : {backgroundColor: ""}}></div>{(genreCount.length > 3) ? genreCount[3].movieGenre_name : " "}</div>
                  <div><div className="legend" style={(genreCount.length > 4) ? {backgroundColor: colorList[4]} : {backgroundColor: ""}}></div>{(genreCount.length > 4) ? genreCount[4].movieGenre_name : " "}</div>
                </div>
                <div className="genre-column">
                  <div><div className="legend" style={(genreCount.length > 5) ? {backgroundColor: colorList[5]} : {backgroundColor: ""}}></div>{(genreCount.length > 5) ? genreCount[5].movieGenre_name : " "}</div>
                  <div><div className="legend" style={(genreCount.length > 6) ? {backgroundColor: colorList[6]} : {backgroundColor: ""}}></div>{(genreCount.length > 6) ? genreCount[6].movieGenre_name : " "}</div>
                  <div><div className="legend" style={(genreCount.length > 7) ? {backgroundColor: colorList[7]} : {backgroundColor: ""}}></div>{(genreCount.length > 7) ? genreCount[7].movieGenre_name : " "}</div>
                  <div><div className="legend" style={(genreCount.length > 8) ? {backgroundColor: colorList[8]} : {backgroundColor: ""}}></div>{(genreCount.length > 8) ? genreCount[8].movieGenre_name : " "}</div>
                  <div><div className="legend" style={(genreCount.length > 9) ? {backgroundColor: colorList[9]} : {backgroundColor: ""}}></div>{(genreCount.length > 9) ? genreCount[9].movieGenre_name : " "}</div>
                </div>
              </div>
            </div>
            <div className="card-long card5">
              <div className="card-label">Recommended &amp; Suggested</div>
              
            </div>
            <div className="card-long card6" >
              <div className="card-label">Watch Later Movies</div>
              <Carousel
                swipeable={false}
                draggable={false}
                showDots={true}
                responsive={responsive}
                ssr={true} // means to render carousel on server-side.
                infinite={true}
                autoPlay={false}
                keyBoardControl={true}
                customTransition="all .5s ease-in-out"
                transitionDuration={500}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                deviceType={responsive.desktop}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
              >
                  {watchLaterMovies.map(movie => (
                    <div key={movie.movie_id} className="watchLaterBox" onClick={()=>navigate(`/details/movie/${movie.movie_id}`)}>
                    <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} />
                    <div>{movie.movie_name}</div>
                    </div>
                  ))}
                  
            </Carousel>
</div>
          </div>
        </>
    );
}

export default Home;