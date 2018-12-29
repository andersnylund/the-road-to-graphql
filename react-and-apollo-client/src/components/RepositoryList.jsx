import React from 'react';
import { Container, List } from 'semantic-ui-react';

import RepositoryItem from './RepositoryItem';
import Button from './Button';
import Loading from './Loading';

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
    {loading ? (
      <Loading />
    ) : (
      repositories.pageInfo.hasNextPage && (
        <Button
          onClick={() =>
            fetchMore({
              variables: {
                cursor: repositories.pageInfo.endCursor,
              },
              updateQuery,
            })
          }
        >
          More repositories
        </Button>
      )
    )}
  </Container>
);

export default RepositoryList;
