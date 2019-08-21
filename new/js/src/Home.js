import React, { Component } from 'react';
// import logo from './logo.svg';
import './materialize.css';
import './App.css';
import { PUBLIC_ROUTES } from './config.json'
import Auth from './components/Auth'
import MiniApp from './components/MiniApp'

const miniApps = [
  {
    title: 'FastqToSam',
    link: PUBLIC_ROUTES.FASTQ_TO_SAM,
    description: 'AnnotationHive: A Cloud-based Annotation Engine'
  },
  {
    title: 'FastqToSam(50G)',
    link: PUBLIC_ROUTES.FASTQ_TO_SAM_50G,
    description: 'AnnotationHive: A Cloud-based Annotation Engine'
  },
  {
    title: 'GATK',
    link: PUBLIC_ROUTES.GATK,
    description: 'AnnotationHive: A Cloud-based Annotation Engine'
  }
]
class App extends Component {
  render(){
    return (
      <div>
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
                  link={obj.link}
                  description={obj.description}
                />
              </div>
            ))
            }
          </div>
          <div className="divider"></div>
          {/* <Auth /> */}
        </div>
      </div>
    )
  }
}

export default App;