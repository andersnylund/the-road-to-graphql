import React from 'react';
import { Container, List } from 'semantic-ui-react';

import FetchMore from './FetchMore';
import RepositoryItem from './RepositoryItem';

const updateQuery = (previousResult, { fetchMoreResult }) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  return {
    ...previousResult,
    viewer: {
      ...previousResult.viewer,
      repositories: {
        ...previousResult.viewer.repositories,
        ...fetchMoreResult.viewer.repositories,
        edges: [
          ...previousResult.viewer.repositories.edges,
          ...fetchMoreResult.viewer.repositories.edges,
        ],
      },
    },
  };
};

const RepositoryList = ({ repositories, loading, fetchMore }) => (
  <Container>
    <List divided relaxed>
      {repositories.edges.map(({ node }) => (
        <List.Item key={node.id}>
          <RepositoryItem {...node} />
        </List.Item>
      ))}
    </List>
    <FetchMore
      loading={loading}
      hasNextPage={repositories.pageInfo.hasNextPage}
      variables={{
        cursor: repositories.pageInfo.endCursor,
      }}
      updateQuery={updateQuery}
      fetchMore={fetchMore}
    >
      Repositories
    </FetchMore>
  </Container>
);

export default RepositoryList;
