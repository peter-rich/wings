import React from 'react';

// FastqToSam
// FastqToSam > 50 G
// GATK
// Detail Introduction
// AnnotationHive
function Header () {
  const title = 'Annotate';
  const description = 'AnnotationHive: A Cloud-based Annotation Engine';
  return (
    <nav>
      <div class="nav-wrapper">
        <a href="#" class="brand-logo"><img src="images/logo.png" /></a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li><a href="sass.html">Sass</a></li>
          <li><a href="badges.html">Components</a></li>
          <li><a href="collapsible.html">JavaScript</a></li>
        </ul>
      </div>
    </nav>
  )
};

export default Header;