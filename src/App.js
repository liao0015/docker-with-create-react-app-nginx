import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>iMetaLab Dashboard XXX</h1>
          <p>Data processing, visualization and analysis</p>
          <p>need this to test hot reloading</p>
          <p>the real test for hot reloading</p>
          <a
            className="App-link"
            href="http://imetalab.ca"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn iMetaLab workflow
          </a>
        </header>
      </div>
    );
  }
}

export default App;
