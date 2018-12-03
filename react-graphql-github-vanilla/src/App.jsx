import React from 'react';
import axios from 'axios';
import './App.css';
import Organization from './components/Organization';

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_ACCESS_TOKEN}`,
  },
});

const GET_ISSUES_OF_REPOSITORY = `
  query($organization: String!, $repository: String!) {
    organization(login: $organization) {
      name
      url
      repository(name: $repository) {
        name
        url
        issues(last: 5) {
          edges {
            node {
              id
              title
              url
            }
          }
        }
      }
    }
  }
`;

const TITLE = 'React GraphQL GitHub Client';

class App extends React.Component {
  state = {
    path: 'the-road-to-learn-react/the-road-to-learn-react',
    organization: null,
    errors: null,
  };

  componentDidMount() {
    this.onFetchFromGitHub();
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = e => {
    e.preventDefault();
    this.onFetchFromGitHub();
  };

  onFetchFromGitHub = async () => {
    const { path } = this.state;
    const [organization, repository] = path.split('/');
    const response = await axiosGitHubGraphQL.post('', {
      query: GET_ISSUES_OF_REPOSITORY,
      variables: { organization, repository },
    });
    this.setState({
      organization: response.data.data && response.data.data.organization,
      errors: response.data.errors,
    });
  };

  showResult = (organization, errors) => {
    if (errors) {
      return (
        <p>
          <strong>Something went wrong:</strong>
          {errors.map(error => error.message).join(' ')}
        </p>
      );
    }

    return organization ? (
      <Organization organization={organization} errors={errors} />
    ) : (
      <p>No information yet...</p>
    );
  };

  render() {
    const { path, organization, errors } = this.state;

    return (
      <div>
        <h1>{TITLE}</h1>
        <form onSubmit={this.onSubmit}>
          <label htmlFor="path">
            Show open issues fro https://github.com/
            <input
              style={{ width: '30rem' }}
              type="text"
              id="path"
              name="path"
              value={path}
              onChange={this.onChange}
            />
          </label>
          <button type="submit" onClick={this.onSubmit}>
            Search
          </button>
        </form>
        {this.showResult(organization, errors)}
      </div>
    );
  }
}

export default App;
