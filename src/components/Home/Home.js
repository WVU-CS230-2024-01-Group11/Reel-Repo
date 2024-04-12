// Temporary homepage, shows how to navigate via useNavigate
// Needed to get to search as of right now


import "./Home.css"
import NavigationBar from "../NavigationBar/NavigationBar";
import { useContext } from "react";
import  { UsernameContext } from '../Contexts/UsernameContext';
import { useState, useEffect } from "react";
import { getFriendsTopRatings } from "../../services/database";
import { useNavigate } from 'react-router-dom';

function Home() {
    const {username, setUsername}=useContext(UsernameContext);
    const navigate = useNavigate();
    //const username = "test";
    const [friendsRatings, setFriendsRatings] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const ratings = await getFriendsTopRatings(username);
        setFriendsRatings(ratings);
      };

      fetchData();
    }, [username]);

    return (
        <>
    <NavigationBar/>
    <div style={{ marginTop: '150px' }}>
    Logged in as: {username} 
   </div>
  <div className="content">
    <div className="card-normal card1">
      <div className="card-label">Time</div>
    </div>
    <div className="card-normal card2">
      <div className="card-label">Ratings</div>
    </div>
    <div className="card-big card3">
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
    <div className="card-wide card4">
      <div className="card-label">Genres Piechart</div>
    </div>
    <div className="card-long card5">
      <div className="card-label">Recommended &amp; Suggested</div>
    </div>
    <div className="card-long card6">
      <div className="card-label">Watch Later</div>
    </div>
   
  </div>
</>
    );
}

export default Home;