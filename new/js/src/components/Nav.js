import React from 'react';
import { NavLink } from 'react-router-dom';
import { BRAND_URL } from '../Constant'

function Nav () {
  return (
    <nav>
      <div className="nav-wrapper">
        <a href={BRAND_URL}
          target='_blank'
          rel='noopener noreferrer'
          className="brand-logo">
          <img src="images/logo.png" alt='stanford bioinformatics logo' />
          Stanford Genetics
        </a>
        <ul id='nav-mobile' className="right hide-on-med-and-down">
          <li><NavLink to='/'>Apps</NavLink></li>
          <li><NavLink to='/monitor'>Monitor</NavLink></li>
        </ul>
      </div>
    </nav>
  )
}

export default Nav