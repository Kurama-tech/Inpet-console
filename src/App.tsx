import React from 'react';
import './App.css';
import Layout from './components/Layout';
import { BrowserRouter as Router} from 'react-router-dom';
import Store from './store/store';


function App() {
  return (
    <Store>
    <div className="App">
      <Router>
      <Layout />
      </Router>   
    </div>
    </Store>
  );
}

export default App;
