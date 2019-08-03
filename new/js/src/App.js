import React from 'react';
// import logo from './logo.svg';
import './materialize.css';

import Header from './components/Header'
import VariantViewer from './components/VariantViewer'
import MiniApp from './components/MiniApp'

function App() {
  return (
    <div>
    <Header />
    <div class="container">
      <div class="row">
        <div class="col s6 m4 l3">
          <MiniApp />
        </div>
        <div class="col s6 m4 l3">
          <MiniApp />
        </div>
        <div class="col s6 m4 l3">
          <MiniApp />
        </div>
        <div class="col s6 m4 l3">
          <MiniApp />
        </div>
        <div class="col s6 m4 l3">
          <MiniApp />
        </div>
        <div class="col s6 m4 l3">
          <MiniApp />
        </div>
      </div>
      <div class="divider"></div>
      <VariantViewer />
    </div>
    </div>
  );
}

export default App;