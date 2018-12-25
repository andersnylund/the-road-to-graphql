import React from 'react';
import { Header } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Link from './Link';
import Button from './Button';
import StarButton from './StarButton';

const CHANGE_SUBSCRIPTION_OF_REPOSITORY = gql`
  mutation($id: ID!, $subscriptionState: SubscriptionState!) {
    updateSubscription(
      input: { subscribableId: $id, state: $subscriptionState }
    ) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

const RepositoryItem = ({
  id,
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
      <StarButton
        id={id}
        stargazers={stargazers}
        viewerHasStarred={viewerHasStarred}
      />
      <div>
        {viewerSubscription === 'SUBSCRIBED' ? (
          <Mutation
            mutation={CHANGE_SUBSCRIPTION_OF_REPOSITORY}
            variables={{ id, subscriptionState: 'UNSUBSCRIBED' }}
          >
            {(changeSubscription, { data, loading, error }) => {
              return (
                <Button onClick={changeSubscription}>
                  {`${watchers.totalCount} Unwatch`}
                </Button>
              );
            }}
          </Mutation>
        ) : (
          <Mutation
            mutation={CHANGE_SUBSCRIPTION_OF_REPOSITORY}
            variables={{ id, subscriptionState: 'SUBSCRIBED' }}
          >
            {(changeSubscription, { data, loading, error }) => {
              return (
                <Button onClick={changeSubscription}>
                  {`${watchers.totalCount} Watch`}
                </Button>
              );
            }}
          </Mutation>
        )}
      </div>
    </div>
    <div>
      <div dangerouslySetInnerHTML={{ __html: descriptionHTML }} />
      <div>
        <div>
          {primaryLanguage && (
            <span>
              Language:
              {` ${primaryLanguage.name}`}
            </span>
          )}
        </div>
        <div>
          {owner && (
            <span>
              Owner:
              <a href={owner.url}>{` ${owner.login}`}</a>
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default RepositoryItem;
