import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router,
  Switch,
  Route
} from "react-dom";
import Home from './Home.js';
import Vote from './Vote.js';

function App() {
  return (
    <div>
 <Router>
    <Switch>
    <Route path="/Home" ></Route>
    <Route paht="/Vote"></Route>
    </Switch>
  </Router>

    </div>
 
  );
}

export default App;
