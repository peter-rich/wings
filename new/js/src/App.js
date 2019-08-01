import React from 'react';
// import logo from './logo.svg';
import './App.css';
import VariantViewer from './components/VariantViewer'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <VariantViewer />
        <hr width="100%" />
        <VariantViewer />
      </header>
    </div>
  );
}

export default App;