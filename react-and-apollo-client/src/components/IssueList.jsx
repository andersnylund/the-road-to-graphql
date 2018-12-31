import React from 'react';
import { Container, List } from 'semantic-ui-react';

import IssueItem from './IssueItem';

const IssueList = ({ issues }) => (
  <Container>
    <List>
      {issues.edges.map(({ node }) => (
        <List.Item key={node.id}>
          <IssueItem issue={node} />
        </List.Item>
      ))}
    </List>
  </Container>
);

export default IssueList;
