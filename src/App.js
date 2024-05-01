import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Details from './components/Search/Details';
import Home from './components/Home/Home';
import AccountDeletion from './components/UserAccount/AccountDeletion';
import UserStatistics from './components/Stats/UserStatistics';
import AccountCreation from './components/UserAccount/AccountCreation';
import AccountLogin from './components/UserAccount/AccountLogin';
import Repository from './components/Repository/Repository';
import Profile from './components/Profile/Profile';
import Settings from './components/Settings/Settings';
import TVStats from './components/UserAccount/TVStats';
import TimeStats from './components/UserAccount/TimeStats';
import FriendsDemo from './components/FriendsTesting/FriendsDemo';
import { UsernameProvider } from './components/Contexts/UsernameContext';
// Used to move around website, different pages


function App() {
  const [username, setUsername] = useState(localStorage.getItem('username') || "");
  
  // Update local storage whenever username changes
  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);

  //Each Route is a new page. Path = what you want the extension to be. "/" is the start up page
  // If you want to dynamically add a user Id or something, refer to the Details :id. It adds the movie id
  // to the URL so it can be fetched and details about it can be populated
  // Element is the component you want that page to be. I think it can only be used with Components
  // Component must be exported in its own file and then imported here for it to work

  const colors = ["#002855", "#EAAA00", "#1C2B39", " #7F6310"]; //["#FF204E", "#A0153E", "#5D0E41", "#00224D"]
  return (
    //Username global context wrapper
    <UsernameProvider>
      <BrowserRouter>
        <Routes>
          <Route
            exact 
            path="/"
            element={<AccountLogin primary={colors[0]} secondary={colors[1]} accent1={colors[2]} accent2={colors[3]}/>}
          />
          <Route
            exact 
            path="/repository"
            element={<Repository primary={colors[0]} secondary={colors[1]} accent1={colors[2]} accent2={colors[3]}/>}
          />
          <Route
            exact 
            path="/stats"
            element={<UserStatistics primary={colors[0]} secondary={colors[1]} accent1={colors[2]} accent2={colors[3]}/>}
          />
          <Route
            exact
            path="/details/:media-type/:id"
            element={<Details primary={colors[0]} secondary={colors[1]} accent1={colors[2]} accent2={colors[3]}/>}
          />
          <Route
            exact 
            path="/profile"
            element={<Profile primary={colors[0]} secondary={colors[1]} accent1={colors[2]} accent2={colors[3]}/>}
          />
          <Route
            exact
            path="/settings"
            element={<AccountDeletion primary={colors[0]} secondary={colors[1]} accent1={colors[2]} accent2={colors[3]}/>}
            />
             <Route 
            exact 
            path="/account-creation" 
            element={<AccountCreation primary={colors[0]} secondary={colors[1]} accent1={colors[2]} accent2={colors[3]}/>} 
            />
            <Route 
            exact 
            path="/home" 
            element={<Home primary={colors[0]} secondary={colors[1]} accent1={colors[2]} accent2={colors[3]}/>} 
            />
            <Route
            exact
            path="/tvstats"
            element={<TVStats />}
            />
            <Route
            exact
            path="/timestats"
            element={<TimeStats />}
            />
            <Route
            exact
            path="/friends"
            element={<FriendsDemo primary={colors[0]} secondary={colors[1]} accent1={colors[2]} accent2={colors[3]}/>}
            />
        </Routes>
        
      </BrowserRouter>
      </UsernameProvider>
  )
}

export default App;