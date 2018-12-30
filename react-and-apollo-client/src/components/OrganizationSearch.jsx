import React, { Component } from 'react';
import { Menu, Input } from 'semantic-ui-react';

export default class OrganizationSearch extends Component {
  state = {
    value: this.props.organizationName,
  };

  onChange = event => {
    this.setState({ value: event.target.value });
  };

  onSubmit = event => {
    event.preventDefault();
    const { onOrganizationSearch } = this.props;
    const { value } = this.state;
    onOrganizationSearch(value);
  };

  render() {
    const { value } = this.state;
    return (
      <Menu.Menu position="right">
        <Menu.Item>
          <Input
            placeholder="Search organization..."
            onChange={this.onChange}
            action={{
              onClick: this.onSubmit,
              icon: 'search',
            }}
            value={value}
          />
        </Menu.Item>
      </Menu.Menu>
    );
  }
}
