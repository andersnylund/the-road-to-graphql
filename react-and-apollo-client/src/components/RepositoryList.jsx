import React from 'react';
import { Container, List } from 'semantic-ui-react';

import FetchMore from './FetchMore';
import RepositoryItem from './RepositoryItem';
import Issues from './Issues';

const getUpdateQuery = entry => (
  previousResult,
  { fetchMoreResult }
) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  return {
    ...previousResult,
    [entry]: {
      ...previousResult[entry],
      repositories: {
        ...previousResult[entry].repositories,
        ...fetchMoreResult[entry].repositories,
        edges: [
          ...previousResult[entry].repositories.edges,
          ...fetchMoreResult[entry].repositories.edges,
        ],
      },
    },
  };
};

const RepositoryList = ({
  repositories,
  loading,
  fetchMore,
  entry,
}) => (
  <Container>
    <List divided relaxed>
      {repositories.edges.map(({ node }) => (
        <List.Item key={node.id}>
          <RepositoryItem {...node} />
          <Issues
            repositoryName={node.name}
            repositoryOwner={node.owner.login}
          />
        </List.Item>
      ))}
    </List>
    <FetchMore
      loading={loading}
      hasNextPage={repositories.pageInfo.hasNextPage}
      variables={{
        cursor: repositories.pageInfo.endCursor,
      }}
      updateQuery={getUpdateQuery(entry)}
      fetchMore={fetchMore}
    >
      Repositories
    </FetchMore>
  </Container>
);

export default RepositoryList;
