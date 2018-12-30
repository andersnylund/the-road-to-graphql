import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

import * as routes from '../constants/routes';
import OrganizationSearch from './OrganizationSearch';

class NavBar extends React.Component {
  state = {
    activeItem: 'organization',
  };

  handleItemClick = (e, { name }) =>
    this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;
    const {
      location: { pathname },
      organizationName,
      onOrganizationSearch,
    } = this.props;

    return (
      <Menu>
        <Menu.Item
          as={Link}
          to={routes.ORGANIZATION}
          name="organization"
          active={activeItem === 'organization'}
          onClick={this.handleItemClick}
        >
          Organization
        </Menu.Item>
        <Menu.Item
          as={Link}
          to={routes.PROFILE}
          name="profile"
          active={activeItem === 'profile'}
          onClick={this.handleItemClick}
        >
          Profile
        </Menu.Item>
        {pathname === routes.ORGANIZATION && (
          <OrganizationSearch
            organizationName={organizationName}
            onOrganizationSearch={onOrganizationSearch}
          />
        )}
      </Menu>
    );
  }
}

export default withRouter(NavBar);
