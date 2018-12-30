import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

import * as routes from '../constants/routes';

class NavBar extends React.Component {
  state = {};

  handleItemClick = (e, { name }) =>
    this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

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
      </Menu>
    );
  }
}

export default NavBar;
