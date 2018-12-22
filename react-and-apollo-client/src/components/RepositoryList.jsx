import React from 'react';
import { Container, List } from 'semantic-ui-react';

import RepositoryItem from './RepositoryItem';

const RepositoryList = ({ repositories }) => (
  <Container>
    <List divided relaxed>
      {repositories.edges.map(({ node }) => (
        <List.Item key={node.id}>
          <RepositoryItem {...node} />
        </List.Item>
      ))}
    </List>
  </Container>
);

export default RepositoryList;
