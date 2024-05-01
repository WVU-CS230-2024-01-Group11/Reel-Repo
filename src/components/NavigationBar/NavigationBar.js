import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./NavigationBar.css";
import Search from '../Search/Search';
import { fetchThemeMode} from '../../services/database';
import { useUsername } from '../Contexts/UsernameContext';
import logo from './logo.png'

/**
 * NavigationBar component represents the navigation bar of the application.
 * It displays the logo, search bar, navigation links, and a dark mode toggle.
 *
 * @param {object} props - The component props.
 * @returns {JSX.Element} - The rendered NavigationBar component.
 */
export default function NavigationBar(props) {
  const { username, setUsername } = useUsername();

  /**
   * Logs out the user by resetting the username in the context.
   */
  function logout() {
    setUsername('');
  }

  const [themeMode, setThemeMode] = useState();
  useEffect(() => {
      fetchUserSettings();
  }, [username]);
  const fetchUserSettings = async () => {
      const fetchedThemeMode = await fetchThemeMode(username);
      setThemeMode(fetchedThemeMode.theme_mode);
  }

  const handleHoverColor = () => {
    document.getElementsByClassName("anchor-text").style.backgroundColor = "green"
    console.log(document.getElementsByClassName("shown-anchors"))
  }

  return (
    <nav className="navigation-bar">
      <img src={logo} style={{width: "50px", margin: "10px", marginLeft: "25px"}}/>
      <div className="navbar-logo">
        
        <a href="/home" className="logo-text">
          Reel Repo
        </a>
      </div>
      <Search primary={props.primary} secondary={props.secondary} accent1={props.accent1} accent2={props.accent2}/>
      <ul className="navbar-anchors">
        <li className="navbar-anchor nonhidden-anchors">
          <div className="anchor-link">
            <a href="/repository" className="anchor-text">
              Repo
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
              <a className="hidden-anchors" onMouseEnter={handleHoverColor} href="/repository">Repo</a>
              <a className="hidden-anchors" href="/Stats">Stats</a>
              <a className="shown-anchors" href={`/profile/${username}`}>Profile</a>
              <a className="shown-anchors" href="/friends">Friends</a>
              <a className="shown-anchors" href="/settings">Settings</a>
              <a onClick={logout} className="shown-anchors" href="/">Logout</a>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  );
}
