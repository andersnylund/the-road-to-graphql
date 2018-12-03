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
  query($organization: String!, $repository: String!, $cursor: String) {
    organization(login: $organization) {
      name
      url
      repository(name: $repository) {
        name
        url
        issues(first: 5, states: [OPEN], after: $cursor) {
          edges {
            node {
              id
              title
              url
              reactions(last: 3) {
                edges {
                  node {
                    id
                    content
                  }
                }
              }
            }
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
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
    const { path } = this.state;
    this.onFetchFromGitHub(path);
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const { path } = this.state;
    this.onFetchFromGitHub(path);
  };

  onFetchFromGitHub = async (path, cursor) => {
    const [organization, repository] = path.split('/');
    const response = await axiosGitHubGraphQL.post('', {
      query: GET_ISSUES_OF_REPOSITORY,
      variables: { organization, repository, cursor },
    });

    const { data, errors } = response.data;

    if (!cursor) {
      this.setState({
        organization: data.organization,
        errors,
      });
      return;
    }

    const { edges: oldIssues } = this.state.organization.repository.issues;
    const { edges: newIssues } = data.organization.repository.issues;
    const updatedIssues = [...oldIssues, ...newIssues];
    this.setState({
      organization: {
        ...data.organization,
        repository: {
          ...data.organization.repository,
          issues: {
            ...data.organization.repository.issues,
            edges: updatedIssues,
          },
        },
      },
      errors,
    });
  };

  onFetchMoreIssues = () => {
    const { path, organization } = this.state;
    const { endCursor } = organization.repository.issues.pageInfo;
    this.onFetchFromGitHub(path, endCursor);
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
      <Organization
        organization={organization}
        errors={errors}
        onFetchMoreIssues={this.onFetchMoreIssues}
      />
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
