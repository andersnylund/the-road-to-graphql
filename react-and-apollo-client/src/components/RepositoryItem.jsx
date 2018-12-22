import React from 'react';
import { Header } from 'semantic-ui-react';

import Link from './Link';

const RepositoryItem = ({
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred,
}) => (
  <div>
    <div>
      <Header as="h2">
        <Link href={url}>{name}</Link>
      </Header>
      <div>
        {`${stargazers.totalCount} `}
        Stars
      </div>
    </div>
    <div>
      <div dangerouslySetInnerHTML={{ __html: descriptionHTML }} />
      <div>
        <div>
          {primaryLanguage && (
            <span>
              Language:
              {primaryLanguage.name}
            </span>
          )}
        </div>
        <div>
          {owner && (
            <span>
              Owner:
              <a href={owner.url}>{owner.login}</a>
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default RepositoryItem;
