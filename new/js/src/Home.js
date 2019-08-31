import React, { Component } from 'react';
// import logo from './logo.svg';
import './materialize.css';
import './styles/App.css';
import { PUBLIC_ROUTES } from './constants'
import MiniApp from './components/MiniApp'
import Auth from './components/Auth'

const miniApps = [
  {
    title: 'FastqToSam',
    link: PUBLIC_ROUTES.FASTQ_TO_SAM,
    description: 'FastqToSam: xxxx xxxx xxxx xxxx xxxx'
  },
  {
    title: 'GATK',
    link: PUBLIC_ROUTES.GATK,
    description: 'GATK: xxxx xxxx xxxx xxxx xxxx xxxx'
  },
  {
    title: 'CNVnator',
    link: PUBLIC_ROUTES.CNVNATOR,
    description: 'CNVnator: xxxx xxxx xxxx xxxx xxxx'
  }
]
class App extends Component {
  render(){
    return (
      <>
        <div className="row">
          {miniApps.map((obj, key) => (
            <div key={key} className="col s6 m4">
              <MiniApp title={obj.title}
                link={obj.link}
                description={obj.description}
              />
            </div>
          ))
          }
        </div>
        <div className="divider"></div>
        <Auth />
      </>
    )
  }
}

export default App;