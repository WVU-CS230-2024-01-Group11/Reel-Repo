// Temporary homepage, shows how to navigate via useNavigate
// Needed to get to search as of right now

import "./Home.css"
import NavigationBar from "../NavigationBar/NavigationBar";

function Home() {

    return (
        <>
    <NavigationBar/>
  <div className="content">
    <div className="card-normal card1">
      <div className="card-label">Time</div>
    </div>
    <div className="card-normal card2">
      <div className="card-label">Ratings</div>
    </div>
    <div className="card-big card3">
      <div className="card-label">Friend Rankings</div>
    </div>
    <div className="card-wide card4">
      <div className="card-label">Genres Piechart</div>
    </div>
    <div className="card-long card5">
      <div className="card-label">Recommended &amp; Suggested</div>
    </div>
    <div className="card-long card6">
      <div className="card-label">Previously Watched</div>
    </div>
  </div>
</>
    );
}

export default Home;