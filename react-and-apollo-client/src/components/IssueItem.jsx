import React from 'react';
import { Header } from 'semantic-ui-react';

import Link from './Link';

const IssueItem = ({ issue }) => (
  <div>
    <Header as="h3">
      <Link href={issue.url}>{issue.title}</Link>
    </Header>
    <div dangerouslySetInnerHTML={{ __html: issue.bodyHTML }} />
  </div>
);

export default IssueItem;
