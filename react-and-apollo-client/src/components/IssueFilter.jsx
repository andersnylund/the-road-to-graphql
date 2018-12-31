import React from 'react';
import { Button } from 'semantic-ui-react';
import { ApolloConsumer } from 'react-apollo';

import {
  TRANSITION_LABELS,
  TRANSITION_STATE,
  isShow,
  GET_ISSUES_OF_REPOSITORY,
} from './Issues';

const prefetchIssues = (
  client,
  repositoryOwner,
  repositoryName,
  issueState
) => {
  const nextIssueState = TRANSITION_STATE[issueState];

  if (isShow(nextIssueState)) {
    client.query({
      query: GET_ISSUES_OF_REPOSITORY,
      variables: {
        repositoryOwner,
        repositoryName,
        issueState: nextIssueState,
      },
    });
  }
};

const IssueFilter = ({
  repositoryOwner,
  repositoryName,
  issueState,
  onChangeIssueState,
}) => (
  <ApolloConsumer>
    {client => (
      <Button
        onClick={() =>
          onChangeIssueState(TRANSITION_STATE[issueState])
        }
        onMouseOver={() =>
          prefetchIssues(
            client,
            repositoryOwner,
            repositoryName,
            issueState
          )
        }
        onFocus={() => {}}
      >
        {TRANSITION_LABELS[issueState]}
      </Button>
    )}
  </ApolloConsumer>
);

export default IssueFilter;
