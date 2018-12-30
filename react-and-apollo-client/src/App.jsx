import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Profile from './pages/Profile';
import Organization from './pages/Organization';
import NavBar from './components/NavBar';

import * as routes from './constants/routes';

const App = () => (
  <Router>
    <Fragment>
      <NavBar />
      <Route
        exact
        path={routes.ORGANIZATION}
        component={() => (
          <Organization organizationName="the-road-to-learn-react" />
        )}
      />
      <Route
        exact
        path={routes.PROFILE}
        component={() => <Profile />}
      />
    </Fragment>
  </Router>
);

export default App;
