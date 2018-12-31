import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import IssueList from './IssueList';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { Button } from 'semantic-ui-react';

const ISSUE_STATES = {
  NONE: 'NONE',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

const TRANSITION_LABELS = {
  [ISSUE_STATES.NONE]: 'Show Open Issues',
  [ISSUE_STATES.OPEN]: 'Show Closed Issues',
  [ISSUE_STATES.CLOSED]: 'Hide Issues',
};

const TRANSITION_STATE = {
  [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
  [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
  [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE,
};

const isShow = issueState => issueState !== ISSUE_STATES.NONE;

const GET_ISSUES_OF_REPOSITORY = gql`
  query($repositoryOwner: String!, $repositoryName: String!) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5) {
        edges {
          node {
            id
            number
            state
            title
            url
            bodyHTML
          }
        }
      }
    }
  }
`;

class Issues extends React.Component {
  state = {
    issueState: ISSUE_STATES.NONE,
  };

  onChangeIssueState = nextIssueState => {
    this.setState({
      issueState: nextIssueState,
    });
  };

  render() {
    const { issueState } = this.state;
    const { repositoryOwner, repositoryName } = this.props;

    return (
      <React.Fragment>
        <Button
          onClick={() =>
            this.onChangeIssueState(TRANSITION_STATE[issueState])
          }
        >
          {TRANSITION_LABELS[issueState]}
        </Button>
        {isShow(issueState) && (
          <Query
            query={GET_ISSUES_OF_REPOSITORY}
            variables={{ repositoryOwner, repositoryName }}
          >
            {({ data, loading, error }) => {
              if (error) {
                return <ErrorMessage error={error} />;
              }
              const { repository } = data;
              if (loading && !repository) {
                return <Loading />;
              }
              const filteredRepository = {
                issues: {
                  edges: repository.issues.edges.filter(
                    issue => issue.node.state === issueState
                  ),
                },
              };
              if (!filteredRepository.issues.edges.length) {
                return <div>No issues...</div>;
              }
              return <IssueList issues={filteredRepository.issues} />;
            }}
          </Query>
        )}
      </React.Fragment>
    );
  }
}

export default Issues;
