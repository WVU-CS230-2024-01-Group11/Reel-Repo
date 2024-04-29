import React from 'react'
import "./NavigationBar.css"
import Search from '../Search/Search';
import { useState } from 'react';

export default function NavigationBar(props) {
 
  return (
    <nav className="navigation-bar">
      <div className="navbar-logo">
        <a href="/home" className="logo-text">
          Reel Repo
        </a>
      </div>
      <Search/>
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
              <a className="shown-anchors" href="/">Logout</a>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  )
}
