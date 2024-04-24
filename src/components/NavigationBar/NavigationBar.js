import React from 'react'
import "./NavigationBar.css"
import Search from '../Search/Search';
import { useState } from 'react';

export default function NavigationBar() {
 
  return (
    <nav className="navigation-bar">
      <div className="navbar-logo">
        <a href="/" className="logo-text">
          Reel Repo
        </a>
      </div>
      <Search/>
      <ul className="navbar-anchors">
        <li className="navbar-anchor">
          <div className="anchor-link">
            <a href="/repository" className="anchor-text">
              Repository
            </a>
          </div>
        </li>
        <li className="navbar-anchor">
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
              <a href="/profile">Profile</a>
              <a href="/friends">Friends</a>
              <a href="/settings">Settings</a>
              <a href="/account-creation">Create Account</a>
              <a href="/account-login">Login</a>
              <a href="/">Logout</a>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  )
}
