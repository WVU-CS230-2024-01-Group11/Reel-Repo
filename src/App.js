import React from 'react';
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

// Used to move around website, different pages
function App() {
  //Each Route is a new page. Path = what you want the extension to be. "/" is the start up page
  // If you want to dynamically add a user Id or something, refer to the Details :id. It adds the movie id
  // to the URL so it can be fetched and details about it can be populated
  // Element is the component you want that page to be. I think it can only be used with Components
  // Component must be exported in its own file and then imported here for it to work
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            exact 
            path="/"
            element={<Home />}
          />
          <Route
            exact 
            path="/repository"
            element={<Repository />}
          />
          <Route
            exact 
            path="/stats"
            element={<UserStatistics />}
          />
          <Route
            exact
            path="/details/:media-type/:id"
            element={<Details />}
          />
          <Route
            exact 
            path="/profile"
            element={<Profile />}
          />
          <Route
            exact
            path="/settings"
            element={<AccountDeletion />}
            />
             <Route 
            exact 
            path="/account-creation" 
            element={<AccountCreation />} 
            />
            <Route 
            exact 
            path="/account-login" 
            element={<AccountLogin />} 
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
            element={<FriendsDemo />}
            />
        </Routes>
      </BrowserRouter>
    </>
  )
    
}

export default App;