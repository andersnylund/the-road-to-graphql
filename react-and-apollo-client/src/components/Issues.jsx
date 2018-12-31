import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Button } from 'semantic-ui-react';
import { withState } from 'recompose';

import IssueList from './IssueList';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';

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
  query(
    $repositoryOwner: String!
    $repositoryName: String!
    $issueState: IssueState!
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5, states: [$issueState]) {
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

const Issues = ({
  repositoryOwner,
  repositoryName,
  issueState,
  onChangeIssueState,
}) => (
  <React.Fragment>
    <Button
      onClick={() => onChangeIssueState(TRANSITION_STATE[issueState])}
    >
      {TRANSITION_LABELS[issueState]}
    </Button>
    {isShow(issueState) && (
      <Query
        query={GET_ISSUES_OF_REPOSITORY}
        variables={{ repositoryOwner, repositoryName, issueState }}
      >
        {({ data, loading, error }) => {
          if (error) {
            return <ErrorMessage error={error} />;
          }
          const { repository } = data;
          if (loading && !repository) {
            return <Loading />;
          }
          if (!repository.issues.edges.length) {
            return <div>No issues...</div>;
          }
          return <IssueList issues={repository.issues} />;
        }}
      </Query>
    )}
  </React.Fragment>
);

export default withState(
  'issueState',
  'onChangeIssueState',
  ISSUE_STATES.NONE
)(Issues);
