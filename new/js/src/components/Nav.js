import React from 'react';
import { BRAND_URL } from '../Constant'

function Nav () {
  return (
    <nav>
      <div className="nav-wrapper">
        <a href={BRAND_URL} className="brand-logo"><img src="images/logo.png" />
          Stanford Genetics
        </a>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li><a href="sass.html">Sass</a></li>
          <li><a href="badges.html">Components</a></li>
          <li><a href="collapsible.html">JavaScript</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default Nav