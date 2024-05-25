import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Login from "./Login.js";
import Home from "./Home.js";
import './App.css';

function App() {
  return (
    <section>
      <Router>
        <Switch>
          <Route path = "/login" component = {Login} />
          <PrivateRoute path = "/home" component = {Home} />
          <Redirect from = "/" to = "/login" />
        </Switch>
      </Router>
    </section>
  );
}

export default App;

