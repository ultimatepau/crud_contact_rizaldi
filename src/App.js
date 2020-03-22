import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from './Container/Home'
import Create from "./Container/Create";

class App extends React.Component {
  render() {
    return (
      <Router basename={`${process.env.PUBLIC_URL}/`}>
          <Switch>
            <Route component={Create} exact path="/create" />
            <Route component={Create} exact path="/edit" />
            <Route component={Create} exact path="/detail" />
            <Route component={Home} exact path="/" />
          </Switch>
      </Router>
    );
  }
}

export default App