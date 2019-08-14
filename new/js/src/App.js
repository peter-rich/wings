import React, { Component } from 'react';
// import logo from './logo.svg';
import './materialize.css';
import './App.css';

import Nav from './components/Nav'
import Auth from './components/Auth'
import VariantViewer from './components/VariantViewer'
import MiniAppForm from './components/MiniAppForm'
import MiniApp from './components/MiniApp'

const miniApps = [
  {
    title: 'AnnotationHive',
    description: 'AnnotationHive: A Cloud-based Annotation Engine'
  },
  {
    title: 'FastqToSam',
    description: 'AnnotationHive: A Cloud-based Annotation Engine'
  },
  {
    title: 'FastqToSam > 50 G',
    description: 'AnnotationHive: A Cloud-based Annotation Engine'
  },
  {
    title: 'GATK',
    description: 'AnnotationHive: A Cloud-based Annotation Engine'
  },
  {
    title: 'Detail Introduction',
    description: 'AnnotationHive: A Cloud-based Annotation Engine'
  }
]
class App extends Component {
  render(){
    return (
      <div>
        <Nav />
        <div className="container">
          <div className="search-wrapper">
            <input id="search" placeholder="Search" />
            <i className="material-icons">search</i>
            <div className="search-results"></div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {miniApps.map((obj, key) => (
              <div key={key} className="col s6 m4 l3">
                <MiniApp title={obj.title}
                  description={obj.description}
                />
              </div>
            ))
            }
          </div>
          <div className="divider"></div>
          <Auth />
          {/* <VariantViewer /> */}
          <MiniAppForm />
        </div>
      </div>
    )
  }
}

export default App;