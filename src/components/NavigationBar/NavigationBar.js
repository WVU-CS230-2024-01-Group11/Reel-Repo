import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./NavigationBar.css";
import Search from '../Search/Search';
import { useUsername } from '../Contexts/UsernameContext';

export default function NavigationBar(props) {
  const [darkMode, setDarkMode] = useState(false);
  const { username, setUsername } = useUsername();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You can add logic here to toggle dark mode in your application
    const element = document.body;
        element.dataset.bsTheme = 
          element.dataset.bsTheme == "light" ? "dark" : "light";
  };

  function logout() {
    setUsername('');
  }
  return (
    <nav className={`navigation-bar ${darkMode ? 'dark-mode' : ''}`}>
      <div className="navbar-logo">
        <a href="/home" className="logo-text">
          Reel Repo
        </a>
      </div>
      <Search />
      <ul className="navbar-anchors">
        <li className="navbar-anchor nonhidden-anchors">
          <div className="anchor-link">
            <a href="/repository" className="anchor-text">
              Repository
            </a>
          </div>
        </li>
        <li className="navbar-anchor nonhidden-anchors">
          <div className="anchor-link">
            <a href="/stats" className="anchor-text">
              Stats
            </a>
          </div>
        </li>
        <li className="navbar-anchor">
          <div className="dropdown">
            <span className="dropdown-text">More</span>
            <div className="dropdown-content">
              <a className="hidden-anchors" href="/repository">Repository</a>
              <a className="hidden-anchors" href="/Stats">Stats</a>
              <a className="shown-anchors" href="/profile">Profile</a>
              <a className="shown-anchors" href="/friends">Friends</a>
              <a className="shown-anchors" href="/settings">Settings</a>
              <a onClick={logout} className="shown-anchors" href="/">Logout</a>
            </div>
          </div>
        </li>
      </ul>
      <div className="form-check form-switch mx-4" onClick={toggleDarkMode}>
        <input type="checkbox" className="form-check-input p-2" id='flexSwitchCheckChecked' checked={darkMode} readOnly />
        <label className="toggle-label"></label>
      </div>
    </nav>
  );
}
