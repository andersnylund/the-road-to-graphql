import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Profile from './pages/Profile';
import Organization from './pages/Organization';
import NavBar from './components/NavBar';

import * as routes from './constants/routes';

class App extends React.Component {
  state = {
    organizationName: 'the-road-to-learn-react',
  };

  onOrganizationSearch = value => {
    this.setState({
      organizationName: value,
    });
  };

  render() {
    const { organizationName } = this.state;

    return (
      <Router>
        <Fragment>
          <NavBar
            organizationName={organizationName}
            onOrganizationSearch={this.onOrganizationSearch}
          />
          <Route
            exact
            path={routes.ORGANIZATION}
            component={() => (
              <Organization organizationName={organizationName} />
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
  }
}

export default App;
